'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import AdvancedFilters from '@/components/AdvancedFilters'
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Clock, 
  Users, 
  Heart,
  Filter,
  SlidersHorizontal
} from 'lucide-react'
import { SearchFilters, Activity, AgeGroup, ActivityCategory } from '@/types'

// Mock data for demonstration
const mockActivities: Activity[] = [
  {
    id: '1',
    name: 'Little Scholars Montessori Preschool',
    description: 'A nurturing Montessori environment for children ages 2-6, focusing on independence and love of learning.',
    category: 'preschool' as ActivityCategory,
    subcategory: 'Montessori School',
    themes: ['Montessori', 'Bilingual Education'],
    age_groups: ['toddlers', 'preschool'] as AgeGroup[],
    min_age: 24,
    max_age: 72,
    address: '123 Education St, New York, NY 10001',
    city_id: '1',
    latitude: 40.7589,
    longitude: -73.9851,
    phone: '(212) 555-0123',
    email: 'info@littlescholars.com',
    website: 'https://littlescholars.com',
    rating: 4.8,
    review_count: 127,
    price_range: '$$$',
    hours: null,
    amenities: ['Parking', 'WiFi', 'Outdoor Playground'],
    languages: ['English', 'Spanish'],
    religious_affiliation: null,
    accreditation: ['NAEYC (National Association for the Education of Young Children)', 'State Licensed'],
    capacity: 60,
    teacher_student_ratio: '1:8',
    foursquare_id: 'fsq_123',
    featured: true,
    verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'CodeKids STEM Academy',
    description: 'After-school coding and robotics programs for kids ages 6-16. Learn programming through fun projects.',
    category: 'after_school_stem' as ActivityCategory,
    subcategory: 'Coding School',
    themes: ['Coding', 'Robotics'],
    age_groups: ['elementary', 'middle_school', 'high_school'] as AgeGroup[],
    min_age: 72,
    max_age: 192,
    address: '456 Tech Ave, New York, NY 10002',
    city_id: '1',
    latitude: 40.7505,
    longitude: -73.9934,
    phone: '(212) 555-0456',
    email: 'hello@codekids.com',
    website: 'https://codekids.com',
    rating: 4.6,
    review_count: 89,
    price_range: '$$',
    hours: null,
    amenities: ['WiFi', 'Computer Lab', 'Parking'],
    languages: ['English'],
    religious_affiliation: null,
    accreditation: ['State Licensed'],
    capacity: 40,
    teacher_student_ratio: '1:6',
    foursquare_id: 'fsq_456',
    featured: false,
    verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'St. Mary\'s Catholic Daycare',
    description: 'Faith-based childcare for infants and toddlers with loving, experienced caregivers.',
    category: 'daycare' as ActivityCategory,
    subcategory: 'Religious Daycare',
    themes: ['Infant Care', 'Religious Education'],
    age_groups: ['infants', 'toddlers'] as AgeGroup[],
    min_age: 0,
    max_age: 36,
    address: '789 Faith Blvd, New York, NY 10003',
    city_id: '1',
    latitude: 40.7282,
    longitude: -73.9942,
    phone: '(212) 555-0789',
    email: 'care@stmarys.org',
    website: 'https://stmarysdaycare.org',
    rating: 4.9,
    review_count: 156,
    price_range: '$$',
    hours: null,
    amenities: ['Parking', 'Chapel', 'Outdoor Play Area'],
    languages: ['English'],
    religious_affiliation: 'Catholic',
    accreditation: ['State Licensed', 'Catholic Schools Office'],
    capacity: 30,
    teacher_student_ratio: '1:4',
    foursquare_id: 'fsq_789',
    featured: false,
    verified: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export default function EnhancedSearchPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<SearchFilters>({})
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Initialize filters from URL params
    const initialFilters: SearchFilters = {}
    if (searchParams.get('city')) initialFilters.city = searchParams.get('city')!
    if (searchParams.get('category')) initialFilters.category = searchParams.get('category') as ActivityCategory
    if (searchParams.get('q')) {
      initialFilters.query = searchParams.get('q')!
      setSearchQuery(searchParams.get('q')!)
    }
    setFilters(initialFilters)
  }, [searchParams])

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Apply filters to mock data
    let filteredActivities = mockActivities

    if (filters.category) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.category === filters.category
      )
    }

    if (filters.age_group) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.age_groups.includes(filters.age_group!)
      )
    }

    if (filters.themes && filters.themes.length > 0) {
      filteredActivities = filteredActivities.filter(activity => 
        filters.themes!.some(theme => activity.themes.includes(theme))
      )
    }

    if (filters.languages && filters.languages.length > 0) {
      filteredActivities = filteredActivities.filter(activity => 
        filters.languages!.some(lang => activity.languages.includes(lang))
      )
    }

    if (filters.religious_affiliation) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.religious_affiliation === filters.religious_affiliation
      )
    }

    if (filters.min_rating) {
      filteredActivities = filteredActivities.filter(activity => 
        (activity.rating || 0) >= filters.min_rating!
      )
    }

    if (filters.query) {
      const query = filters.query.toLowerCase()
      filteredActivities = filteredActivities.filter(activity => 
        activity.name.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.themes.some(theme => theme.toLowerCase().includes(query))
      )
    }

    setActivities(filteredActivities)
    setIsLoading(false)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setActivities(mockActivities)
  }

  const handleSearch = () => {
    const newFilters = { ...filters, query: searchQuery }
    setFilters(newFilters)
    handleApplyFilters()
  }

  const getAgeRangeDisplay = (activity: Activity) => {
    if (activity.min_age && activity.max_age) {
      const minYears = Math.floor(activity.min_age / 12)
      const maxYears = Math.floor(activity.max_age / 12)
      return `${minYears}-${maxYears} years`
    }
    return activity.age_groups.map(group => {
      const config = {
        infants: 'Infants',
        toddlers: 'Toddlers', 
        preschool: 'Preschool',
        elementary: 'Elementary',
        middle_school: 'Middle School',
        high_school: 'High School',
        all_ages: 'All Ages'
      }
      return config[group]
    }).join(', ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Kids Activities Search
              </h1>
              <p className="text-gray-600 mt-1">
                Found {activities.length} activities matching your criteria
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                Search
              </Button>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary">
                  Category: {filters.category}
                </Badge>
              )}
              {filters.age_group && (
                <Badge variant="secondary">
                  Age: {filters.age_group}
                </Badge>
              )}
              {filters.themes && filters.themes.length > 0 && (
                <Badge variant="secondary">
                  Themes: {filters.themes.length}
                </Badge>
              )}
              {filters.religious_affiliation && (
                <Badge variant="secondary">
                  Religious: {filters.religious_affiliation}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching activities...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activities.map((activity) => (
                  <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            {activity.name}
                            {activity.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Featured
                              </Badge>
                            )}
                            {activity.verified && (
                              <Badge className="bg-green-100 text-green-800">
                                Verified
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {activity.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{activity.rating}</span>
                          <span className="text-gray-500">({activity.review_count})</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Category and Themes */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {activity.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        {activity.themes.map((theme) => (
                          <Badge key={theme} variant="outline" className="bg-purple-50 text-purple-700">
                            {theme}
                          </Badge>
                        ))}
                      </div>

                      {/* Age Groups */}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Ages: {getAgeRangeDisplay(activity)}
                        </span>
                        {activity.teacher_student_ratio && (
                          <span className="text-sm text-gray-500">
                            • Ratio: {activity.teacher_student_ratio}
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{activity.address}</span>
                      </div>

                      {/* Languages and Religious Affiliation */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {activity.languages.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>Languages: {activity.languages.join(', ')}</span>
                          </div>
                        )}
                        {activity.religious_affiliation && (
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>Religious: {activity.religious_affiliation}</span>
                          </div>
                        )}
                      </div>

                      {/* Contact and Actions */}
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          {activity.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{activity.phone}</span>
                            </div>
                          )}
                          {activity.price_range && (
                            <Badge variant="outline">
                              {activity.price_range}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {activities.length === 0 && (
                  <div className="text-center py-12">
                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No activities found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

