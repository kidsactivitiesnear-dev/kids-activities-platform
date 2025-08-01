'use client'

import Link from 'next/link'
import { MapPin, Users, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const featuredCities = [
  {
    id: '1',
    name: 'New York',
    state: 'NY',
    activities: 350,
    rating: 4.8,
    image: '/api/placeholder/400/300',
    description: 'The city that never sleeps offers endless opportunities for kids'
  },
  {
    id: '2',
    name: 'Los Angeles',
    state: 'CA',
    activities: 280,
    rating: 4.7,
    image: '/api/placeholder/400/300',
    description: 'Sunny California with amazing outdoor and creative activities'
  },
  {
    id: '3',
    name: 'Chicago',
    state: 'IL',
    activities: 250,
    rating: 4.6,
    image: '/api/placeholder/400/300',
    description: 'The Windy City with rich culture and family-friendly attractions'
  },
  {
    id: '4',
    name: 'Houston',
    state: 'TX',
    activities: 200,
    rating: 4.5,
    image: '/api/placeholder/400/300',
    description: 'Space City with STEM programs and outdoor adventures'
  },
  {
    id: '5',
    name: 'Phoenix',
    state: 'AZ',
    activities: 180,
    rating: 4.5,
    image: '/api/placeholder/400/300',
    description: 'Desert activities and year-round outdoor fun'
  },
  {
    id: '6',
    name: 'Philadelphia',
    state: 'PA',
    activities: 170,
    rating: 4.4,
    image: '/api/placeholder/400/300',
    description: 'Historic city with educational and cultural programs'
  }
]

const allCities = [
  'Arlington', 'Atlanta', 'Austin', 'Boston', 'Charlotte', 'Columbus',
  'Dallas', 'Denver', 'Detroit', 'El Paso', 'Fort Worth', 'Indianapolis',
  'Jacksonville', 'Memphis', 'Nashville', 'Oklahoma City', 'Portland',
  'San Antonio', 'San Diego', 'San Francisco', 'Seattle'
]

export default function CityBrowseSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by City:
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore activities in the top 25 US cities. Each city offers unique 
            opportunities for your children to learn, play, and grow.
          </p>
        </div>

        {/* Featured Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredCities.map((city) => (
            <Link key={city.id} href={`/search?city=${city.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {city.activities} activities
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{city.name}</h3>
                    <p className="text-white/90">{city.state}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{city.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{city.rating}</span>
                      <span className="text-sm text-gray-500">rating</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">Explore</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* All Cities List */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            More Cities Available
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allCities.map((city) => (
              <Link
                key={city}
                href={`/search?city=${city.toLowerCase().replace(' ', '-')}`}
                className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {city}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-blue-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Don't see your city?
            </h3>
            <p className="text-blue-100 mb-6">
              We're constantly expanding to new cities. Let us know where you'd like 
              to see KidsActivitiesNear next!
            </p>
            <Link href="/contact" className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              <span>Request Your City</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

