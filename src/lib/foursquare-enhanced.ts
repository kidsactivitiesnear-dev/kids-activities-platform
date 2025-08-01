import { ActivityCategory, AgeGroup } from '@/types'

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

// Enhanced category mappings with detailed themes and age targeting
export const ENHANCED_KIDS_CATEGORIES = {
  daycare: {
    queries: [
      'daycare center',
      'child care center',
      'infant care',
      'toddler care',
      'nursery school',
      'childcare facility'
    ],
    foursquare_categories: ['12058', '12059'], // Education, Child Care
    themes: {
      'Infant Care': ['infant', 'baby', 'newborn', '0-12 months'],
      'Toddler Care': ['toddler', '1-3 years', 'early childhood'],
      'Drop-in Care': ['drop-in', 'hourly', 'flexible'],
      'Extended Hours': ['24 hour', 'extended', 'early morning', 'late evening']
    },
    age_groups: ['infants', 'toddlers'] as AgeGroup[],
    keywords: ['daycare', 'childcare', 'infant', 'toddler', 'nursery', 'babysitting']
  },
  
  preschool: {
    queries: [
      'preschool',
      'pre-k',
      'prekindergarten',
      'montessori school',
      'waldorf school',
      'early childhood education',
      'nursery school'
    ],
    foursquare_categories: ['12058', '12059', '12060'], // Education, Pre-K
    themes: {
      'Montessori': ['montessori', 'maria montessori', 'child-led'],
      'Waldorf': ['waldorf', 'steiner', 'anthroposophy'],
      'Reggio Emilia': ['reggio emilia', 'project-based'],
      'Play-Based Learning': ['play-based', 'learning through play'],
      'Academic Prep': ['kindergarten prep', 'academic readiness', 'school prep'],
      'Bilingual Education': ['bilingual', 'dual language', 'spanish', 'french', 'chinese'],
      'Religious Education': ['catholic', 'christian', 'jewish', 'islamic', 'faith-based'],
      'Nature-Based': ['nature', 'outdoor', 'forest', 'garden', 'environmental']
    },
    age_groups: ['toddlers', 'preschool'] as AgeGroup[],
    keywords: ['preschool', 'pre-k', 'montessori', 'waldorf', 'early childhood', 'kindergarten prep']
  },

  after_school_academic: {
    queries: [
      'after school program',
      'tutoring center',
      'homework help',
      'learning center',
      'academic support',
      'test prep',
      'kumon',
      'sylvan learning'
    ],
    foursquare_categories: ['12058', '10032'], // Education, Community Centers
    themes: {
      'Homework Help': ['homework', 'study hall', 'supervised study'],
      'Tutoring': ['tutoring', 'one-on-one', 'small group', 'personalized'],
      'Test Prep': ['test prep', 'SAT', 'ACT', 'standardized test'],
      'Reading Programs': ['reading', 'literacy', 'phonics', 'comprehension'],
      'Math Programs': ['math', 'mathematics', 'algebra', 'geometry', 'calculus']
    },
    age_groups: ['elementary', 'middle_school', 'high_school'] as AgeGroup[],
    keywords: ['tutoring', 'homework', 'academic', 'learning', 'education', 'study']
  },

  after_school_stem: {
    queries: [
      'coding classes',
      'robotics program',
      'STEM program',
      'science classes',
      'engineering for kids',
      'computer programming',
      'maker space'
    ],
    foursquare_categories: ['12058', '10027'], // Education, Tech
    themes: {
      'Coding': ['coding', 'programming', 'python', 'scratch', 'javascript'],
      'Robotics': ['robotics', 'robot', 'lego mindstorms', 'vex', 'arduino'],
      'Science Experiments': ['science', 'experiments', 'chemistry', 'physics', 'biology'],
      'Engineering': ['engineering', 'design thinking', 'problem solving'],
      'Math Enrichment': ['advanced math', 'competition math', 'math olympiad']
    },
    age_groups: ['elementary', 'middle_school', 'high_school'] as AgeGroup[],
    keywords: ['STEM', 'coding', 'robotics', 'science', 'engineering', 'technology', 'programming']
  },

  after_school_arts: {
    queries: [
      'art classes',
      'music lessons',
      'dance studio',
      'theater program',
      'drama classes',
      'creative writing',
      'pottery classes'
    ],
    foursquare_categories: ['10027', '10028'], // Arts & Entertainment
    themes: {
      'Theater': ['theater', 'drama', 'acting', 'musical theater', 'performance'],
      'Music Lessons': ['music', 'piano', 'guitar', 'violin', 'voice', 'band', 'orchestra'],
      'Art Classes': ['art', 'painting', 'drawing', 'sculpture', 'pottery', 'ceramics'],
      'Dance': ['dance', 'ballet', 'jazz', 'hip hop', 'contemporary', 'tap'],
      'Creative Writing': ['writing', 'creative writing', 'storytelling', 'poetry']
    },
    age_groups: ['preschool', 'elementary', 'middle_school', 'high_school'] as AgeGroup[],
    keywords: ['art', 'music', 'dance', 'theater', 'creative', 'lessons', 'classes']
  },

  after_school_sports: {
    queries: [
      'youth sports',
      'kids sports',
      'soccer club',
      'basketball program',
      'swimming lessons',
      'martial arts',
      'gymnastics',
      'tennis lessons'
    ],
    foursquare_categories: ['18021', '18022', '18023'], // Recreation, Sports
    themes: {
      'Soccer': ['soccer', 'football', 'futbol', 'youth soccer'],
      'Basketball': ['basketball', 'hoops', 'youth basketball'],
      'Baseball/Softball': ['baseball', 'softball', 'little league', 'tee ball'],
      'Swimming': ['swimming', 'swim lessons', 'aquatics', 'water safety'],
      'Martial Arts': ['martial arts', 'karate', 'taekwondo', 'judo', 'kung fu'],
      'Gymnastics': ['gymnastics', 'tumbling', 'acrobatics', 'cheerleading'],
      'Tennis': ['tennis', 'racquet sports', 'youth tennis'],
      'Track and Field': ['track', 'field', 'running', 'athletics']
    },
    age_groups: ['preschool', 'elementary', 'middle_school', 'high_school'] as AgeGroup[],
    keywords: ['sports', 'athletics', 'youth', 'kids', 'training', 'lessons', 'club']
  },

  summer_camp_traditional: {
    queries: [
      'summer camp',
      'day camp',
      'youth camp',
      'kids camp',
      'summer program',
      'vacation camp'
    ],
    foursquare_categories: ['10032', '18021'], // Community Centers, Recreation
    themes: {
      'Traditional Camp': ['traditional', 'classic camp', 'general camp'],
      'Day Camp': ['day camp', 'non-residential', 'daily activities'],
      'Adventure Camp': ['adventure', 'outdoor', 'hiking', 'camping'],
      'Nature Camp': ['nature', 'environmental', 'ecology', 'wildlife']
    },
    age_groups: ['preschool', 'elementary', 'middle_school'] as AgeGroup[],
    keywords: ['summer camp', 'day camp', 'youth camp', 'vacation', 'activities']
  },

  summer_camp_sports: {
    queries: [
      'sports camp',
      'soccer camp',
      'basketball camp',
      'swim camp',
      'tennis camp',
      'multi-sport camp'
    ],
    foursquare_categories: ['18021', '18022'], // Recreation, Sports
    themes: {
      'Sports Camp': ['multi-sport', 'athletics', 'sports skills'],
      'Soccer Camp': ['soccer', 'football camp'],
      'Basketball Camp': ['basketball', 'hoops camp'],
      'Swimming Camp': ['swim camp', 'aquatics'],
      'Tennis Camp': ['tennis', 'racquet sports']
    },
    age_groups: ['elementary', 'middle_school', 'high_school'] as AgeGroup[],
    keywords: ['sports camp', 'athletic camp', 'training camp', 'skills camp']
  },

  summer_camp_arts: {
    queries: [
      'art camp',
      'music camp',
      'theater camp',
      'dance camp',
      'creative camp',
      'performing arts camp'
    ],
    foursquare_categories: ['10027', '10028'], // Arts & Entertainment
    themes: {
      'Arts Camp': ['art camp', 'creative arts', 'visual arts'],
      'Music Camp': ['music camp', 'band camp', 'choir camp'],
      'Theater Camp': ['theater camp', 'drama camp', 'acting camp'],
      'Dance Camp': ['dance camp', 'ballet camp', 'movement']
    },
    age_groups: ['preschool', 'elementary', 'middle_school', 'high_school'] as AgeGroup[],
    keywords: ['art camp', 'music camp', 'theater camp', 'creative', 'performing arts']
  },

  summer_camp_stem: {
    queries: [
      'STEM camp',
      'science camp',
      'coding camp',
      'robotics camp',
      'tech camp',
      'engineering camp'
    ],
    foursquare_categories: ['12058', '10027'], // Education, Tech
    themes: {
      'STEM Camp': ['STEM', 'science technology engineering math'],
      'Science Camp': ['science', 'experiments', 'laboratory'],
      'Coding Camp': ['coding', 'programming', 'computer science'],
      'Robotics Camp': ['robotics', 'robot building', 'automation']
    },
    age_groups: ['elementary', 'middle_school', 'high_school'] as AgeGroup[],
    keywords: ['STEM camp', 'science camp', 'coding camp', 'tech camp', 'robotics']
  },

  summer_camp_specialty: {
    queries: [
      'specialty camp',
      'academic camp',
      'enrichment camp',
      'leadership camp',
      'adventure camp'
    ],
    foursquare_categories: ['10032', '18021'], // Community Centers, Recreation
    themes: {
      'Academic Enrichment': ['academic', 'enrichment', 'learning'],
      'Leadership': ['leadership', 'character building', 'life skills'],
      'Adventure': ['adventure', 'outdoor education', 'wilderness'],
      'Special Needs': ['special needs', 'inclusive', 'adaptive']
    },
    age_groups: ['elementary', 'middle_school', 'high_school'] as AgeGroup[],
    keywords: ['specialty camp', 'enrichment', 'leadership', 'academic camp']
  }
}

// City coordinates with enhanced radius for better coverage
export const ENHANCED_CITY_COORDINATES = {
  'New York': { lat: 40.7128, lng: -74.0060, radius: 35000 }, // Increased for metro area
  'Los Angeles': { lat: 34.0522, lng: -118.2437, radius: 40000 },
  'Chicago': { lat: 41.8781, lng: -87.6298, radius: 30000 },
  'Houston': { lat: 29.7604, lng: -95.3698, radius: 30000 },
  'Phoenix': { lat: 33.4484, lng: -112.0740, radius: 25000 },
  'Philadelphia': { lat: 39.9526, lng: -75.1652, radius: 20000 },
  'San Antonio': { lat: 29.4241, lng: -98.4936, radius: 20000 },
  'San Diego': { lat: 32.7157, lng: -117.1611, radius: 25000 },
  'Dallas': { lat: 32.7767, lng: -96.7970, radius: 25000 },
  'Austin': { lat: 30.2672, lng: -97.7431, radius: 20000 },
  'Washington': { lat: 38.9072, lng: -77.0369, radius: 25000 },
  'Jacksonville': { lat: 30.3322, lng: -81.6557, radius: 20000 },
  'Fort Worth': { lat: 32.7555, lng: -97.3308, radius: 20000 },
  'Columbus': { lat: 39.9612, lng: -82.9988, radius: 20000 },
  'Charlotte': { lat: 35.2271, lng: -80.8431, radius: 20000 },
  'San Francisco': { lat: 37.7749, lng: -122.4194, radius: 20000 },
  'Indianapolis': { lat: 39.7684, lng: -86.1581, radius: 20000 },
  'Seattle': { lat: 47.6062, lng: -122.3321, radius: 20000 },
  'Denver': { lat: 39.7392, lng: -104.9903, radius: 20000 },
  'Boston': { lat: 42.3601, lng: -71.0589, radius: 20000 },
  'El Paso': { lat: 31.7619, lng: -106.4850, radius: 20000 },
  'Detroit': { lat: 42.3314, lng: -83.0458, radius: 20000 },
  'Nashville': { lat: 36.1627, lng: -86.7816, radius: 20000 },
  'Portland': { lat: 45.5152, lng: -122.6784, radius: 20000 },
  'Memphis': { lat: 35.1495, lng: -90.0490, radius: 20000 },
  'Oklahoma City': { lat: 35.4676, lng: -97.5164, radius: 20000 }
}

class EnhancedFoursquareAPI {
  private apiKey: string
  private baseUrl = 'https://api.foursquare.com/v3'
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 24 * 60 * 60 * 1000 // 24 hours
  private requestDelay = 200 // 200ms between requests to respect rate limits

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

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, this.requestDelay))

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

  async searchVenuesEnhanced(
    city: string,
    category: keyof typeof ENHANCED_KIDS_CATEGORIES,
    limit: number = 50
  ): Promise<FoursquareVenue[]> {
    const cityCoords = ENHANCED_CITY_COORDINATES[city as keyof typeof ENHANCED_CITY_COORDINATES]
    if (!cityCoords) {
      throw new Error(`City coordinates not found for: ${city}`)
    }

    const categoryConfig = ENHANCED_KIDS_CATEGORIES[category]
    const { lat, lng, radius } = cityCoords
    const allVenues: FoursquareVenue[] = []

    try {
      // Search with multiple queries for better coverage
      for (const query of categoryConfig.queries) {
        const response: FoursquareSearchResponse = await this.makeRequest('/places/search', {
          ll: `${lat},${lng}`,
          radius: radius,
          query: query,
          categories: categoryConfig.foursquare_categories.join(','),
          limit: Math.min(50, Math.ceil(limit / categoryConfig.queries.length)),
          fields: 'fsq_id,name,location,categories,rating,stats,hours,price,website,tel,email,description,features'
        })

        allVenues.push(...response.results)
      }

      // Remove duplicates based on fsq_id
      const uniqueVenues = allVenues.filter((venue, index, self) => 
        index === self.findIndex(v => v.fsq_id === venue.fsq_id)
      )

      // Enhanced filtering for quality and relevance
      const filteredVenues = uniqueVenues.filter(venue => {
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

        // Enhanced keyword matching
        const text = `${venue.name} ${venue.description || ''} ${venue.categories.map(c => c.name).join(' ')}`.toLowerCase()
        
        // Must have relevant keywords
        const hasRelevantKeywords = categoryConfig.keywords.some(keyword => 
          text.includes(keyword.toLowerCase())
        )

        // Must NOT have adult-only keywords
        const adultKeywords = ['bar', 'nightclub', 'casino', 'adult', '21+', 'liquor']
        const hasAdultKeywords = adultKeywords.some(keyword => 
          text.includes(keyword.toLowerCase())
        )

        // Must be kid-friendly based on categories
        const kidFriendlyCategories = [
          'school', 'education', 'childcare', 'daycare', 'preschool', 
          'youth', 'kids', 'children', 'family', 'recreation', 'sports',
          'arts', 'music', 'dance', 'theater', 'camp'
        ]
        const hasKidFriendlyCategory = kidFriendlyCategories.some(keyword =>
          text.includes(keyword.toLowerCase())
        )

        return hasRelevantKeywords && !hasAdultKeywords && hasKidFriendlyCategory
      })

      // Sort by rating and review count for quality
      const sortedVenues = filteredVenues.sort((a, b) => {
        const scoreA = (a.rating || 0) * Math.log(1 + (a.stats?.total_ratings || 0))
        const scoreB = (b.rating || 0) * Math.log(1 + (b.stats?.total_ratings || 0))
        return scoreB - scoreA
      })

      return sortedVenues.slice(0, limit)
    } catch (error) {
      console.error(`Error searching venues for ${city} - ${category}:`, error)
      return []
    }
  }

  // Enhanced theme detection
  detectThemes(venue: FoursquareVenue, category: keyof typeof ENHANCED_KIDS_CATEGORIES): string[] {
    const categoryConfig = ENHANCED_KIDS_CATEGORIES[category]
    const text = `${venue.name} ${venue.description || ''}`.toLowerCase()
    const detectedThemes: string[] = []

    for (const [themeName, keywords] of Object.entries(categoryConfig.themes)) {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        detectedThemes.push(themeName)
      }
    }

    return detectedThemes
  }

  // Enhanced age group detection
  detectAgeGroups(venue: FoursquareVenue, category: keyof typeof ENHANCED_KIDS_CATEGORIES): AgeGroup[] {
    const text = `${venue.name} ${venue.description || ''}`.toLowerCase()
    const detectedAgeGroups: AgeGroup[] = []

    const ageKeywords = {
      infants: ['infant', 'baby', 'newborn', '0-12 months', '0-1 year'],
      toddlers: ['toddler', '1-3 years', '12-36 months', 'early childhood'],
      preschool: ['preschool', 'pre-k', '3-5 years', '4-6 years'],
      elementary: ['elementary', 'k-5', '5-12 years', 'school age'],
      middle_school: ['middle school', '6-8', '11-14 years', 'tween'],
      high_school: ['high school', '9-12', '14-18 years', 'teen', 'teenager'],
      all_ages: ['all ages', 'family', 'multi-age', 'mixed age']
    }

    for (const [ageGroup, keywords] of Object.entries(ageKeywords)) {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        detectedAgeGroups.push(ageGroup as AgeGroup)
      }
    }

    // Default to category's typical age groups if none detected
    if (detectedAgeGroups.length === 0) {
      const categoryConfig = ENHANCED_KIDS_CATEGORIES[category]
      return categoryConfig.age_groups
    }

    return detectedAgeGroups
  }

  // Enhanced language detection
  detectLanguages(venue: FoursquareVenue): string[] {
    const text = `${venue.name} ${venue.description || ''}`.toLowerCase()
    const languages: string[] = ['English'] // Default

    const languageKeywords = {
      'Spanish': ['spanish', 'español', 'bilingual', 'dual language'],
      'French': ['french', 'français', 'francais'],
      'Chinese (Mandarin)': ['chinese', 'mandarin', '中文'],
      'German': ['german', 'deutsch'],
      'Italian': ['italian', 'italiano'],
      'Portuguese': ['portuguese', 'português'],
      'Russian': ['russian', 'русский'],
      'Arabic': ['arabic', 'عربي'],
      'Hebrew': ['hebrew', 'עברית'],
      'Japanese': ['japanese', '日本語'],
      'Korean': ['korean', '한국어']
    }

    for (const [language, keywords] of Object.entries(languageKeywords)) {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        if (!languages.includes(language)) {
          languages.push(language)
        }
      }
    }

    return languages
  }

  // Enhanced religious affiliation detection
  detectReligiousAffiliation(venue: FoursquareVenue): string | null {
    const text = `${venue.name} ${venue.description || ''}`.toLowerCase()

    const religiousKeywords = {
      'Catholic': ['catholic', 'st.', 'saint', 'holy', 'sacred heart'],
      'Protestant': ['baptist', 'methodist', 'presbyterian', 'lutheran', 'episcopal'],
      'Jewish': ['jewish', 'hebrew', 'temple', 'synagogue', 'torah'],
      'Islamic': ['islamic', 'muslim', 'mosque', 'quran'],
      'Hindu': ['hindu', 'vedic', 'sanskrit'],
      'Buddhist': ['buddhist', 'zen', 'dharma'],
      'Non-denominational Christian': ['christian', 'christ', 'gospel', 'faith'],
      'Interfaith': ['interfaith', 'multi-faith', 'ecumenical']
    }

    for (const [affiliation, keywords] of Object.entries(religiousKeywords)) {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        return affiliation
      }
    }

    return null
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

  // Enhanced batch import with better distribution
  async batchImportEnhanced(
    cities: string[],
    categories: (keyof typeof ENHANCED_KIDS_CATEGORIES)[],
    targetPerCity: Record<string, number> = {}
  ): Promise<{
    total: number
    successful: number
    failed: number
    venues: Array<FoursquareVenue & { 
      detected_themes: string[]
      detected_age_groups: AgeGroup[]
      detected_languages: string[]
      detected_religious_affiliation: string | null
      source_category: string
      source_city: string
    }>
    errors: string[]
  }> {
    const results = {
      total: 0,
      successful: 0,
      failed: 0,
      venues: [] as Array<FoursquareVenue & { 
        detected_themes: string[]
        detected_age_groups: AgeGroup[]
        detected_languages: string[]
        detected_religious_affiliation: string | null
        source_category: string
        source_city: string
      }>,
      errors: [] as string[]
    }

    for (const city of cities) {
      const cityTarget = targetPerCity[city] || 100
      const perCategory = Math.ceil(cityTarget / categories.length)

      for (const category of categories) {
        try {
          console.log(`Importing ${category} venues for ${city}... (target: ${perCategory})`)
          const venues = await this.searchVenuesEnhanced(city, category, perCategory)
          
          // Enhance venues with detected attributes
          const enhancedVenues = venues.map(venue => ({
            ...venue,
            detected_themes: this.detectThemes(venue, category),
            detected_age_groups: this.detectAgeGroups(venue, category),
            detected_languages: this.detectLanguages(venue),
            detected_religious_affiliation: this.detectReligiousAffiliation(venue),
            source_category: category,
            source_city: city
          }))
          
          results.total += enhancedVenues.length
          results.successful += enhancedVenues.length
          results.venues.push(...enhancedVenues)
          
          console.log(`✓ Found ${enhancedVenues.length} quality venues for ${category} in ${city}`)
          
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
export const enhancedFoursquareAPI = new EnhancedFoursquareAPI(process.env.FOURSQUARE_API_KEY || '')

// Helper function to convert enhanced Foursquare venue to our Activity type
export function convertEnhancedVenueToActivity(
  venue: FoursquareVenue & { 
    detected_themes: string[]
    detected_age_groups: AgeGroup[]
    detected_languages: string[]
    detected_religious_affiliation: string | null
    source_category: string
    source_city: string
  }, 
  cityId: string
) {
  return {
    name: venue.name,
    description: venue.description || '',
    category: venue.source_category as ActivityCategory,
    subcategory: venue.categories[0]?.name || null,
    themes: venue.detected_themes,
    age_groups: venue.detected_age_groups,
    min_age: getMinAgeFromGroups(venue.detected_age_groups),
    max_age: getMaxAgeFromGroups(venue.detected_age_groups),
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
    amenities: extractAmenities(venue),
    languages: venue.detected_languages,
    religious_affiliation: venue.detected_religious_affiliation,
    accreditation: [], // Will be filled manually or through additional data sources
    capacity: null,
    teacher_student_ratio: null,
    foursquare_id: venue.fsq_id,
    featured: false,
    verified: false
  }
}

function getMinAgeFromGroups(ageGroups: AgeGroup[]): number | null {
  const ageRanges = {
    infants: 0,
    toddlers: 12,
    preschool: 36,
    elementary: 60,
    middle_school: 132,
    high_school: 168,
    all_ages: 0
  }

  if (ageGroups.length === 0) return null
  return Math.min(...ageGroups.map(group => ageRanges[group]))
}

function getMaxAgeFromGroups(ageGroups: AgeGroup[]): number | null {
  const ageRanges = {
    infants: 12,
    toddlers: 36,
    preschool: 60,
    elementary: 132,
    middle_school: 168,
    high_school: 216,
    all_ages: 216
  }

  if (ageGroups.length === 0) return null
  return Math.max(...ageGroups.map(group => ageRanges[group]))
}

function extractAmenities(venue: FoursquareVenue): string[] {
  const amenities: string[] = []
  
  if (venue.features?.amenities?.parking) amenities.push('Parking')
  if (venue.features?.amenities?.wifi) amenities.push('WiFi')
  if (venue.features?.amenities?.restroom) amenities.push('Restroom')
  if (venue.features?.payment?.credit_cards?.accepts_credit_cards) amenities.push('Credit Cards Accepted')
  
  return amenities
}

