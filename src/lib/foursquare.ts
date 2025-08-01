interface FoursquareVenue {
  fsq_id: string
  name: string
  location: {
    address?: string
    locality?: string
    region?: string
    postcode?: string
    country?: string
    formatted_address?: string
    latitude?: number
    longitude?: number
  }
  categories: Array<{
    id: number
    name: string
    short_name: string
    plural_name: string
    icon: {
      prefix: string
      suffix: string
    }
  }>
  rating?: number
  stats?: {
    total_photos?: number
    total_ratings?: number
    total_tips?: number
  }
  hours?: {
    display?: string
    is_local_holiday?: boolean
    open_now?: boolean
    regular?: Array<{
      close?: string
      day?: number
      open?: string
    }>
  }
  price?: number
  website?: string
  tel?: string
  email?: string
  description?: string
  features?: {
    payment?: {
      credit_cards?: {
        accepts_credit_cards?: boolean
      }
    }
    services?: {
      delivery?: boolean
      takeout?: boolean
    }
    amenities?: {
      restroom?: boolean
      parking?: boolean
      wifi?: boolean
    }
  }
}

interface FoursquareSearchResponse {
  results: FoursquareVenue[]
  context: {
    geo_bounds: {
      circle: {
        center: {
          latitude: number
          longitude: number
        }
        radius: number
      }
    }
  }
}

// Foursquare category mappings for kids activities
export const KIDS_ACTIVITY_CATEGORIES = {
  preschools: {
    query: 'preschool OR daycare OR "early childhood" OR nursery',
    categories: ['12058', '12059'], // Education categories
    keywords: ['preschool', 'daycare', 'nursery', 'early childhood', 'toddler', 'pre-k']
  },
  'after-school': {
    query: '"after school" OR "youth program" OR "kids program"',
    categories: ['12058', '10032'], // Education, Community Centers
    keywords: ['after school', 'youth program', 'kids program', 'tutoring', 'homework help']
  },
  'summer-camps': {
    query: '"summer camp" OR "day camp" OR "youth camp"',
    categories: ['10032', '18021'], // Community Centers, Recreation
    keywords: ['summer camp', 'day camp', 'youth camp', 'kids camp', 'vacation camp']
  },
  'sports-fitness': {
    query: '"kids sports" OR "youth sports" OR "children fitness"',
    categories: ['18021', '18022', '18023'], // Recreation, Sports, Fitness
    keywords: ['kids sports', 'youth sports', 'martial arts', 'gymnastics', 'swimming', 'soccer', 'basketball']
  },
  'arts-crafts': {
    query: '"art classes" OR "music lessons" OR "dance classes"',
    categories: ['10027', '10028'], // Arts & Entertainment
    keywords: ['art classes', 'music lessons', 'dance classes', 'pottery', 'painting', 'theater', 'drama']
  }
}

// City coordinates for boundary checking
export const CITY_COORDINATES = {
  'New York': { lat: 40.7128, lng: -74.0060, radius: 25000 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, radius: 30000 },
  'Chicago': { lat: 41.8781, lng: -87.6298, radius: 20000 },
  'Houston': { lat: 29.7604, lng: -95.3698, radius: 25000 },
  'Phoenix': { lat: 33.4484, lng: -112.0740, radius: 20000 },
  'Philadelphia': { lat: 39.9526, lng: -75.1652, radius: 15000 },
  'San Antonio': { lat: 29.4241, lng: -98.4936, radius: 15000 },
  'San Diego': { lat: 32.7157, lng: -117.1611, radius: 20000 },
  'Dallas': { lat: 32.7767, lng: -96.7970, radius: 20000 },
  'Austin': { lat: 30.2672, lng: -97.7431, radius: 15000 },
  'Jacksonville': { lat: 30.3322, lng: -81.6557, radius: 15000 },
  'Fort Worth': { lat: 32.7555, lng: -97.3308, radius: 15000 },
  'Columbus': { lat: 39.9612, lng: -82.9988, radius: 15000 },
  'Charlotte': { lat: 35.2271, lng: -80.8431, radius: 15000 },
  'San Francisco': { lat: 37.7749, lng: -122.4194, radius: 15000 },
  'Indianapolis': { lat: 39.7684, lng: -86.1581, radius: 15000 },
  'Seattle': { lat: 47.6062, lng: -122.3321, radius: 15000 },
  'Denver': { lat: 39.7392, lng: -104.9903, radius: 15000 },
  'Boston': { lat: 42.3601, lng: -71.0589, radius: 15000 },
  'El Paso': { lat: 31.7619, lng: -106.4850, radius: 15000 },
  'Detroit': { lat: 42.3314, lng: -83.0458, radius: 15000 },
  'Nashville': { lat: 36.1627, lng: -86.7816, radius: 15000 },
  'Portland': { lat: 45.5152, lng: -122.6784, radius: 15000 },
  'Memphis': { lat: 35.1495, lng: -90.0490, radius: 15000 },
  'Oklahoma City': { lat: 35.4676, lng: -97.5164, radius: 15000 }
}

class FoursquareAPI {
  private apiKey: string
  private baseUrl = 'https://api.foursquare.com/v3'
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 24 * 60 * 60 * 1000 // 24 hours

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`
    
    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': this.apiKey,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Cache the response
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      
      return data
    } catch (error) {
      console.error('Foursquare API request failed:', error)
      throw error
    }
  }

  async searchVenues(
    city: string,
    category: keyof typeof KIDS_ACTIVITY_CATEGORIES,
    limit: number = 50
  ): Promise<FoursquareVenue[]> {
    const cityCoords = CITY_COORDINATES[city as keyof typeof CITY_COORDINATES]
    if (!cityCoords) {
      throw new Error(`City coordinates not found for: ${city}`)
    }

    const categoryConfig = KIDS_ACTIVITY_CATEGORIES[category]
    const { lat, lng, radius } = cityCoords

    try {
      const response: FoursquareSearchResponse = await this.makeRequest('/places/search', {
        ll: `${lat},${lng}`,
        radius: radius,
        query: categoryConfig.query,
        categories: categoryConfig.categories.join(','),
        limit: Math.min(limit, 50), // Foursquare max is 50 per request
        fields: 'fsq_id,name,location,categories,rating,stats,hours,price,website,tel,email,description,features'
      })

      // Filter results for quality and relevance
      const filteredVenues = response.results.filter(venue => {
        // Must have minimum rating and reviews
        if (!venue.rating || venue.rating < 4.0) return false
        if (!venue.stats?.total_ratings || venue.stats.total_ratings < 10) return false

        // Must be within city boundaries (double-check)
        if (venue.location.latitude && venue.location.longitude) {
          const distance = this.calculateDistance(
            lat, lng,
            venue.location.latitude, venue.location.longitude
          )
          if (distance > radius) return false
        }

        // Must have relevant keywords in name or description
        const text = `${venue.name} ${venue.description || ''}`.toLowerCase()
        const hasRelevantKeywords = categoryConfig.keywords.some(keyword => 
          text.includes(keyword.toLowerCase())
        )

        return hasRelevantKeywords
      })

      return filteredVenues
    } catch (error) {
      console.error(`Error searching venues for ${city} - ${category}:`, error)
      return []
    }
  }

  async getVenueDetails(venueId: string): Promise<FoursquareVenue | null> {
    try {
      const response = await this.makeRequest(`/places/${venueId}`, {
        fields: 'fsq_id,name,location,categories,rating,stats,hours,price,website,tel,email,description,features'
      })
      return response
    } catch (error) {
      console.error(`Error getting venue details for ${venueId}:`, error)
      return null
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000 // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180)
  }

  // Batch import for multiple cities and categories
  async batchImport(
    cities: string[],
    categories: (keyof typeof KIDS_ACTIVITY_CATEGORIES)[],
    maxPerCategory: number = 50
  ): Promise<{
    total: number
    successful: number
    failed: number
    venues: FoursquareVenue[]
    errors: string[]
  }> {
    const results = {
      total: 0,
      successful: 0,
      failed: 0,
      venues: [] as FoursquareVenue[],
      errors: [] as string[]
    }

    for (const city of cities) {
      for (const category of categories) {
        try {
          console.log(`Importing ${category} venues for ${city}...`)
          const venues = await this.searchVenues(city, category, maxPerCategory)
          
          results.total += venues.length
          results.successful += venues.length
          results.venues.push(...venues)
          
          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          results.failed++
          results.errors.push(`${city} - ${category}: ${error}`)
          console.error(`Failed to import ${category} for ${city}:`, error)
        }
      }
    }

    return results
  }
}

// Export singleton instance
export const foursquareAPI = new FoursquareAPI(process.env.FOURSQUARE_API_KEY || '')

// Helper function to convert Foursquare venue to our Activity type
export function convertFoursquareVenueToActivity(venue: FoursquareVenue, cityId: string, category: string) {
  return {
    name: venue.name,
    description: venue.description || '',
    category: category,
    address: venue.location.formatted_address || venue.location.address || '',
    city_id: cityId,
    latitude: venue.location.latitude,
    longitude: venue.location.longitude,
    phone: venue.tel,
    email: venue.email,
    website: venue.website,
    rating: venue.rating,
    review_count: venue.stats?.total_ratings || 0,
    price_range: venue.price ? '$'.repeat(venue.price) : null,
    hours: venue.hours ? JSON.stringify(venue.hours) : null,
    amenities: venue.features ? [
      ...(venue.features.amenities?.parking ? ['Parking'] : []),
      ...(venue.features.amenities?.wifi ? ['WiFi'] : []),
      ...(venue.features.amenities?.restroom ? ['Restroom'] : []),
      ...(venue.features.payment?.credit_cards?.accepts_credit_cards ? ['Credit Cards'] : [])
    ] : [],
    foursquare_id: venue.fsq_id,
    featured: false,
    verified: false
  }
}

