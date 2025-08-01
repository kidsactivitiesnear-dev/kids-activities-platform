export type UserRole = 'user' | 'admin'

export type AgeGroup = 'infants' | 'toddlers' | 'preschool' | 'elementary' | 'middle_school' | 'high_school' | 'all_ages'

export type ActivityCategory = 
  | 'daycare' 
  | 'preschool' 
  | 'after_school_academic' 
  | 'after_school_sports' 
  | 'after_school_arts' 
  | 'after_school_stem' 
  | 'summer_camp_traditional' 
  | 'summer_camp_sports' 
  | 'summer_camp_arts' 
  | 'summer_camp_stem' 
  | 'summer_camp_specialty' 
  | 'sports_fitness' 
  | 'arts_creative'

export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type RequestType = 'claim' | 'new'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  created_at: string
}

export interface City {
  id: string
  name: string
  state: string
  latitude: number
  longitude: number
  population?: number
  tier: number
  target_activities: number
  created_at: string
}

export interface ActivityTheme {
  id: string
  name: string
  category: ActivityCategory
  description?: string
  created_at: string
}

export interface Activity {
  id: string
  name: string
  description?: string
  category: ActivityCategory
  subcategory?: string
  themes: string[]
  age_groups: AgeGroup[]
  min_age?: number // in months
  max_age?: number // in months
  address: string
  city_id: string
  city?: City
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  website?: string
  rating?: number
  review_count: number
  price_range?: string
  hours?: any
  amenities: string[]
  languages: string[]
  religious_affiliation?: string
  accreditation: string[]
  capacity?: number
  teacher_student_ratio?: string
  foursquare_id?: string
  featured: boolean
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  activity_id: string
  activity?: Activity
  created_at: string
}

export interface BusinessClaimRequest {
  id: string
  request_type: RequestType
  business_name: string
  category: ActivityCategory
  subcategory?: string
  themes: string[]
  age_groups: AgeGroup[]
  min_age?: number
  max_age?: number
  description?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  phone?: string
  email?: string
  website?: string
  hours?: string
  capacity?: string
  pricing?: string
  amenities: string[]
  languages: string[]
  religious_affiliation?: string
  accreditation: string[]
  teacher_student_ratio?: string
  owner_name: string
  owner_email: string
  owner_phone?: string
  relationship?: string
  additional_info?: string
  status: RequestStatus
  created_at: string
  updated_at: string
}

export interface ImportStats {
  id: string
  total_imported: number
  successful: number
  failed: number
  city_breakdown: Record<string, number>
  category_breakdown: Record<string, number>
  theme_breakdown: Record<string, number>
  age_group_breakdown: Record<string, number>
  last_import: string
  created_at: string
}

// Search and filter interfaces
export interface SearchFilters {
  city?: string
  category?: ActivityCategory
  age_group?: AgeGroup
  themes?: string[]
  languages?: string[]
  religious_affiliation?: string
  min_rating?: number
  price_range?: string
  min_age?: number
  max_age?: number
  query?: string
}

export interface SearchResults {
  activities: Activity[]
  total: number
  page: number
  per_page: number
  filters: SearchFilters
}

// Category display configurations
export interface CategoryConfig {
  id: ActivityCategory
  label: string
  description: string
  icon: string
  color: string
  themes: string[]
  typical_age_groups: AgeGroup[]
}

// Age group configurations
export interface AgeGroupConfig {
  id: AgeGroup
  label: string
  description: string
  min_months: number
  max_months: number
  color: string
}

// Religious affiliations
export const RELIGIOUS_AFFILIATIONS = [
  'Catholic',
  'Protestant',
  'Jewish',
  'Islamic',
  'Hindu',
  'Buddhist',
  'Non-denominational Christian',
  'Interfaith',
  'Secular'
] as const

// Common languages
export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Chinese (Mandarin)',
  'Chinese (Cantonese)',
  'Japanese',
  'Korean',
  'Arabic',
  'Hebrew',
  'Hindi',
  'Other'
] as const

// Price ranges
export const PRICE_RANGES = [
  '$',
  '$$',
  '$$$',
  '$$$$'
] as const

// Accreditation types
export const ACCREDITATION_TYPES = [
  'NAEYC (National Association for the Education of Young Children)',
  'State Licensed',
  'Head Start',
  'Montessori Accredited',
  'Waldorf Certified',
  'Reggio Emilia Inspired',
  'AdvancED/Cognia',
  'NAIS (National Association of Independent Schools)',
  'Other'
] as const

export interface BusinessClaimRequest {
  id: string
  request_type: 'claim' | 'new'
  business_name: string
  category: string
  description?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  phone?: string
  email?: string
  website?: string
  hours?: string
  age_range?: string
  capacity?: string
  pricing?: string
  amenities?: string[]
  owner_name: string
  owner_email: string
  owner_phone?: string
  relationship?: string
  additional_info?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface ImportStats {
  total_imported: number
  successful: number
  failed: number
  city_breakdown: Record<string, number>
  category_breakdown: Record<string, number>
  last_import: string
}

