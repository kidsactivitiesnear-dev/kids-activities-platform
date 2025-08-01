'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Play, AlertCircle, CheckCircle, Clock, MapPin } from 'lucide-react'

const AVAILABLE_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'Austin', 'Jacksonville', 'Fort Worth',
  'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver',
  'Boston', 'El Paso', 'Detroit', 'Nashville', 'Portland', 'Memphis', 'Oklahoma City'
]

const AVAILABLE_CATEGORIES = [
  { id: 'preschools', label: 'Preschools', description: 'Early childhood education and daycare' },
  { id: 'after-school', label: 'After School Programs', description: 'Youth programs and tutoring' },
  { id: 'summer-camps', label: 'Summer Camps', description: 'Day camps and vacation programs' },
  { id: 'sports-fitness', label: 'Sports & Fitness', description: 'Youth sports and physical activities' },
  { id: 'arts-crafts', label: 'Arts & Crafts', description: 'Creative classes and lessons' }
]

const CITY_TARGETS = {
  'New York': 350, 'Los Angeles': 280, 'Chicago': 250, 'Houston': 200,
  'Phoenix': 180, 'Philadelphia': 170, 'San Antonio': 160, 'San Diego': 150,
  'Dallas': 150, 'Austin': 140, 'Jacksonville': 130, 'Fort Worth': 120,
  'Columbus': 120, 'Charlotte': 110, 'San Francisco': 200, 'Indianapolis': 110,
  'Seattle': 180, 'Denver': 160, 'Boston': 170, 'El Paso': 100,
  'Detroit': 110, 'Nashville': 120, 'Portland': 130, 'Memphis': 100,
  'Oklahoma City': 100
}

interface ImportResult {
  success: boolean
  foursquare_results: {
    total_found: number
    successful_fetches: number
    failed_fetches: number
    fetch_errors: string[]
  }
  database_results: {
    activities_processed: number
    activities_inserted: number
    insert_errors: string[]
  }
  summary: {
    cities_processed: number
    categories_processed: number
    total_activities_added: number
  }
}

export default function ImportPage() {
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [maxPerCategory, setMaxPerCategory] = useState(50)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCityToggle = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    )
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const selectAllCities = () => {
    setSelectedCities(AVAILABLE_CITIES)
  }

  const selectTopCities = () => {
    setSelectedCities(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'])
  }

  const selectAllCategories = () => {
    setSelectedCategories(AVAILABLE_CATEGORIES.map(c => c.id))
  }

  const startImport = async () => {
    if (selectedCities.length === 0 || selectedCategories.length === 0) {
      setError('Please select at least one city and one category')
      return
    }

    setImporting(true)
    setProgress(0)
    setError(null)
    setResults(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      const response = await fetch('/api/import/foursquare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cities: selectedCities,
          categories: selectedCategories,
          maxPerCategory
        })
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Import failed')
      }

      const result = await response.json()
      setResults(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const totalTargetActivities = selectedCities.reduce((sum, city) => 
    sum + (CITY_TARGETS[city as keyof typeof CITY_TARGETS] || 100), 0
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Foursquare Data Import
        </h1>
        <p className="text-gray-600">
          Import high-quality kids activities from Foursquare Places API
        </p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="strategy">Import Strategy</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          {/* City Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Select Cities</span>
              </CardTitle>
              <CardDescription>
                Choose which cities to import activities from
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={selectAllCities}>
                  Select All ({AVAILABLE_CITIES.length})
                </Button>
                <Button variant="outline" size="sm" onClick={selectTopCities}>
                  Top 5 Cities
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedCities([])}>
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {AVAILABLE_CITIES.map(city => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={city}
                      checked={selectedCities.includes(city)}
                      onCheckedChange={() => handleCityToggle(city)}
                    />
                    <Label htmlFor={city} className="text-sm font-medium">
                      {city}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {CITY_TARGETS[city as keyof typeof CITY_TARGETS]}
                    </Badge>
                  </div>
                ))}
              </div>
              
              {selectedCities.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Selected {selectedCities.length} cities with target of {totalTargetActivities} activities
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Categories</CardTitle>
              <CardDescription>
                Choose which types of activities to import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={selectAllCategories}>
                  Select All Categories
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedCategories([])}>
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_CATEGORIES.map(category => (
                  <div key={category.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={category.id} className="font-medium">
                        {category.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Import Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Import Settings</CardTitle>
              <CardDescription>
                Configure import parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxPerCategory">Max venues per category per city</Label>
                <Input
                  id="maxPerCategory"
                  type="number"
                  value={maxPerCategory}
                  onChange={(e) => setMaxPerCategory(Number(e.target.value))}
                  min={10}
                  max={100}
                  className="w-32"
                />
                <p className="text-sm text-gray-600">
                  Higher values may take longer but provide more comprehensive results
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Import Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Start Import</CardTitle>
              <CardDescription>
                Begin importing activities from Foursquare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {importing && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Importing activities...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={startImport} 
                disabled={importing || selectedCities.length === 0 || selectedCategories.length === 0}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {importing ? 'Importing...' : 'Start Import'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Strategy Overview</CardTitle>
              <CardDescription>
                Quality-focused approach to building a comprehensive activities database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4,000</div>
                  <div className="text-sm text-gray-600">Target Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">4.0+</div>
                  <div className="text-sm text-gray-600">Minimum Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                  <div className="text-sm text-gray-600">Minimum Reviews</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quality Filters</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Only venues with 4+ star ratings</li>
                  <li>• Minimum 10 reviews for reliability</li>
                  <li>• Within city boundaries only</li>
                  <li>• Relevant keywords in name/description</li>
                  <li>• Active venues with current information</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Categories Covered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_CATEGORIES.map(category => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Badge variant="outline">{category.label}</Badge>
                      <span className="text-sm text-gray-600">{category.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {results ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Import Completed Successfully</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {results.summary.total_activities_added}
                      </div>
                      <div className="text-sm text-gray-600">Activities Added</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {results.summary.cities_processed}
                      </div>
                      <div className="text-sm text-gray-600">Cities Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {results.summary.categories_processed}
                      </div>
                      <div className="text-sm text-gray-600">Categories Processed</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Foursquare API Results</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Total Found: {results.foursquare_results.total_found}</div>
                      <div>Successfully Fetched: {results.foursquare_results.successful_fetches}</div>
                      <div>Failed Fetches: {results.foursquare_results.failed_fetches}</div>
                      <div>Processed: {results.database_results.activities_processed}</div>
                    </div>
                  </div>

                  {results.foursquare_results.fetch_errors.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-red-600">Errors</h3>
                      <div className="space-y-1">
                        {results.foursquare_results.fetch_errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Import Results Yet
                </h3>
                <p className="text-gray-600">
                  Run an import to see detailed results here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

