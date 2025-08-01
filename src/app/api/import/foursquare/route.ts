import { NextRequest, NextResponse } from 'next/server'
import { foursquareAPI, convertFoursquareVenueToActivity, KIDS_ACTIVITY_CATEGORIES } from '@/lib/foursquare'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { cities, categories, maxPerCategory = 50 } = await request.json()

    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      return NextResponse.json(
        { error: 'Cities array is required' },
        { status: 400 }
      )
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'Categories array is required' },
        { status: 400 }
      )
    }

    // Validate categories
    const validCategories = Object.keys(KIDS_ACTIVITY_CATEGORIES)
    const invalidCategories = categories.filter(cat => !validCategories.includes(cat))
    if (invalidCategories.length > 0) {
      return NextResponse.json(
        { error: `Invalid categories: ${invalidCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Get city IDs from database
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('id, name')
      .in('name', cities)

    if (cityError) {
      return NextResponse.json(
        { error: 'Failed to fetch cities from database' },
        { status: 500 }
      )
    }

    const cityMap = new Map(cityData?.map(city => [city.name, city.id]) || [])

    // Import venues from Foursquare
    const importResults = await foursquareAPI.batchImport(cities, categories, maxPerCategory)

    // Convert and insert venues into database
    const activitiesToInsert = []
    const duplicateCheck = new Set()

    for (const venue of importResults.venues) {
      // Find the city for this venue
      let cityId = null
      for (const [cityName, id] of cityMap) {
        if (venue.location.locality?.includes(cityName) || 
            venue.location.formatted_address?.includes(cityName)) {
          cityId = id
          break
        }
      }

      if (!cityId) continue

      // Determine category based on venue data
      let activityCategory = 'other'
      for (const [catKey, catConfig] of Object.entries(KIDS_ACTIVITY_CATEGORIES)) {
        if (catConfig.keywords.some(keyword => 
          venue.name.toLowerCase().includes(keyword.toLowerCase()) ||
          venue.description?.toLowerCase().includes(keyword.toLowerCase())
        )) {
          activityCategory = catKey
          break
        }
      }

      // Check for duplicates
      const duplicateKey = `${venue.fsq_id}-${cityId}`
      if (duplicateCheck.has(duplicateKey)) continue
      duplicateCheck.add(duplicateKey)

      const activity = convertFoursquareVenueToActivity(venue, cityId, activityCategory)
      activitiesToInsert.push(activity)
    }

    // Insert activities into database
    let insertedCount = 0
    let insertErrors = []

    if (activitiesToInsert.length > 0) {
      // Insert in batches to avoid timeout
      const batchSize = 50
      for (let i = 0; i < activitiesToInsert.length; i += batchSize) {
        const batch = activitiesToInsert.slice(i, i + batchSize)
        
        const { data, error } = await supabase
          .from('activities')
          .upsert(batch, { 
            onConflict: 'foursquare_id',
            ignoreDuplicates: true 
          })
          .select('id')

        if (error) {
          insertErrors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`)
        } else {
          insertedCount += data?.length || 0
        }
      }
    }

    // Update import stats
    const { error: statsError } = await supabase
      .from('import_stats')
      .insert({
        total_imported: importResults.total,
        successful: insertedCount,
        failed: importResults.failed + insertErrors.length,
        city_breakdown: JSON.stringify(
          cities.reduce((acc, city) => {
            acc[city] = importResults.venues.filter(v => 
              v.location.locality?.includes(city) || 
              v.location.formatted_address?.includes(city)
            ).length
            return acc
          }, {} as Record<string, number>)
        ),
        category_breakdown: JSON.stringify(
          categories.reduce((acc, category) => {
            acc[category] = activitiesToInsert.filter(a => a.category === category).length
            return acc
          }, {} as Record<string, number>)
        )
      })

    if (statsError) {
      console.error('Failed to update import stats:', statsError)
    }

    return NextResponse.json({
      success: true,
      foursquare_results: {
        total_found: importResults.total,
        successful_fetches: importResults.successful,
        failed_fetches: importResults.failed,
        fetch_errors: importResults.errors
      },
      database_results: {
        activities_processed: activitiesToInsert.length,
        activities_inserted: insertedCount,
        insert_errors: insertErrors
      },
      summary: {
        cities_processed: cities.length,
        categories_processed: categories.length,
        total_activities_added: insertedCount
      }
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Internal server error during import' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Foursquare Import API',
    available_categories: Object.keys(KIDS_ACTIVITY_CATEGORIES),
    usage: {
      method: 'POST',
      body: {
        cities: ['New York', 'Los Angeles'],
        categories: ['preschools', 'sports-fitness'],
        maxPerCategory: 50
      }
    }
  })
}

