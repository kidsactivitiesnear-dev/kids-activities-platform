'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const cities = [
  { id: '1', name: 'New York, NY' },
  { id: '2', name: 'Los Angeles, CA' },
  { id: '3', name: 'Chicago, IL' },
  { id: '4', name: 'Houston, TX' },
  { id: '5', name: 'Phoenix, AZ' },
  { id: '6', name: 'Philadelphia, PA' },
  { id: '7', name: 'San Antonio, TX' },
  { id: '8', name: 'San Diego, CA' },
  { id: '9', name: 'Dallas, TX' },
  { id: '10', name: 'Austin, TX' },
  { id: '11', name: 'Washington, DC' },
  { id: '12', name: 'Jacksonville, FL' },
  { id: '13', name: 'Fort Worth, TX' },
  { id: '14', name: 'Columbus, OH' },
  { id: '15', name: 'Charlotte, NC' },
  { id: '16', name: 'San Francisco, CA' },
  { id: '17', name: 'Indianapolis, IN' },
  { id: '18', name: 'Seattle, WA' },
  { id: '19', name: 'Denver, CO' },
  { id: '20', name: 'Boston, MA' },
  { id: '21', name: 'El Paso, TX' },
  { id: '22', name: 'Detroit, MI' },
  { id: '23', name: 'Nashville, TN' },
  { id: '24', name: 'Portland, OR' },
  { id: '25', name: 'Memphis, TN' },
  { id: '26', name: 'Oklahoma City, OK' }
]

const categories = [
  { value: 'daycare', label: 'Daycare Centers' },
  { value: 'preschool', label: 'Preschools' },
  { value: 'after_school_academic', label: 'After-School Academic' },
  { value: 'after_school_stem', label: 'After-School STEM' },
  { value: 'after_school_arts', label: 'After-School Arts' },
  { value: 'after_school_sports', label: 'After-School Sports' },
  { value: 'summer_camp_traditional', label: 'Traditional Summer Camps' },
  { value: 'summer_camp_sports', label: 'Sports Summer Camps' },
  { value: 'summer_camp_arts', label: 'Arts Summer Camps' },
  { value: 'summer_camp_stem', label: 'STEM Summer Camps' },
  { value: 'summer_camp_specialty', label: 'Specialty Summer Camps' }
]

export default function HeroSection() {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCity) params.set('city', selectedCity)
    if (selectedCategory) params.set('category', selectedCategory)
    if (searchQuery) params.set('q', searchQuery)
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        {/* Hero Text */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Amazing Activities
            <br />
            <span className="text-blue-600">For Your Kids</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exciting activities, classes, and experiences in your city. From 
            fitness to arts, we help you find what your children will love.
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              What are you looking for?
            </h2>
            <p className="text-gray-600">
              Search for activities by city and category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* City Selector */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 opacity-0">
                Search
              </Label>
              <Button 
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Text Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Or search by activity name, location, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  )
}

