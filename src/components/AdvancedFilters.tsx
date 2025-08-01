'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Globe, 
  Heart,
  GraduationCap,
  Palette,
  Zap,
  Trophy
} from 'lucide-react'
import { 
  ActivityCategory, 
  AgeGroup, 
  SearchFilters,
  RELIGIOUS_AFFILIATIONS,
  LANGUAGES,
  PRICE_RANGES,
  ACCREDITATION_TYPES
} from '@/types'

interface AdvancedFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  isLoading?: boolean
}

const CATEGORY_CONFIGS = {
  daycare: {
    label: 'Daycare Centers',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    themes: ['Infant Care', 'Toddler Care', 'Drop-in Care', 'Extended Hours']
  },
  preschool: {
    label: 'Preschools',
    icon: GraduationCap,
    color: 'bg-green-100 text-green-800',
    themes: ['Montessori', 'Waldorf', 'Reggio Emilia', 'Play-Based Learning', 'Academic Prep', 'Bilingual Education', 'Religious Education', 'Nature-Based']
  },
  after_school_academic: {
    label: 'After-School Academic',
    icon: GraduationCap,
    color: 'bg-purple-100 text-purple-800',
    themes: ['Homework Help', 'Tutoring', 'Test Prep', 'Reading Programs', 'Math Programs']
  },
  after_school_stem: {
    label: 'After-School STEM',
    icon: Zap,
    color: 'bg-orange-100 text-orange-800',
    themes: ['Coding', 'Robotics', 'Science Experiments', 'Engineering', 'Math Enrichment']
  },
  after_school_arts: {
    label: 'After-School Arts',
    icon: Palette,
    color: 'bg-pink-100 text-pink-800',
    themes: ['Theater', 'Music Lessons', 'Art Classes', 'Dance', 'Creative Writing']
  },
  after_school_sports: {
    label: 'After-School Sports',
    icon: Trophy,
    color: 'bg-red-100 text-red-800',
    themes: ['Soccer', 'Basketball', 'Baseball/Softball', 'Swimming', 'Martial Arts', 'Gymnastics', 'Tennis', 'Track and Field']
  },
  summer_camp_traditional: {
    label: 'Traditional Summer Camps',
    icon: Calendar,
    color: 'bg-yellow-100 text-yellow-800',
    themes: ['Traditional Camp', 'Day Camp', 'Adventure Camp', 'Nature Camp']
  },
  summer_camp_sports: {
    label: 'Sports Summer Camps',
    icon: Trophy,
    color: 'bg-red-100 text-red-800',
    themes: ['Sports Camp', 'Soccer Camp', 'Basketball Camp', 'Swimming Camp', 'Tennis Camp']
  },
  summer_camp_arts: {
    label: 'Arts Summer Camps',
    icon: Palette,
    color: 'bg-pink-100 text-pink-800',
    themes: ['Arts Camp', 'Music Camp', 'Theater Camp', 'Dance Camp']
  },
  summer_camp_stem: {
    label: 'STEM Summer Camps',
    icon: Zap,
    color: 'bg-orange-100 text-orange-800',
    themes: ['STEM Camp', 'Science Camp', 'Coding Camp', 'Robotics Camp']
  },
  summer_camp_specialty: {
    label: 'Specialty Summer Camps',
    icon: Star,
    color: 'bg-indigo-100 text-indigo-800',
    themes: ['Academic Enrichment', 'Leadership', 'Adventure', 'Special Needs']
  }
}

const AGE_GROUP_CONFIGS = {
  infants: { label: 'Infants (0-12 months)', color: 'bg-blue-100 text-blue-800' },
  toddlers: { label: 'Toddlers (1-3 years)', color: 'bg-green-100 text-green-800' },
  preschool: { label: 'Preschool (3-5 years)', color: 'bg-yellow-100 text-yellow-800' },
  elementary: { label: 'Elementary (5-11 years)', color: 'bg-orange-100 text-orange-800' },
  middle_school: { label: 'Middle School (11-14 years)', color: 'bg-purple-100 text-purple-800' },
  high_school: { label: 'High School (14-18 years)', color: 'bg-red-100 text-red-800' },
  all_ages: { label: 'All Ages', color: 'bg-gray-100 text-gray-800' }
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isLoading = false
}: AdvancedFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    age: true,
    themes: false,
    location: false,
    quality: false,
    languages: false,
    religious: false,
    pricing: false
  })

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleTheme = (theme: string) => {
    const currentThemes = filters.themes || []
    const newThemes = currentThemes.includes(theme)
      ? currentThemes.filter(t => t !== theme)
      : [...currentThemes, theme]
    updateFilter('themes', newThemes)
  }

  const toggleLanguage = (language: string) => {
    const currentLanguages = filters.languages || []
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language]
    updateFilter('languages', newLanguages)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.age_group) count++
    if (filters.themes && filters.themes.length > 0) count++
    if (filters.languages && filters.languages.length > 0) count++
    if (filters.religious_affiliation) count++
    if (filters.min_rating && filters.min_rating > 0) count++
    if (filters.price_range) count++
    if (filters.min_age || filters.max_age) count++
    return count
  }

  const getAvailableThemes = () => {
    if (!filters.category) return []
    return CATEGORY_CONFIGS[filters.category as keyof typeof CATEGORY_CONFIGS]?.themes || []
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
            <Button size="sm" onClick={onApplyFilters} disabled={isLoading}>
              {isLoading ? 'Applying...' : 'Apply Filters'}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Find exactly what you're looking for with detailed filtering options
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <Collapsible open={openSections.category} onOpenChange={() => toggleSection('category')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span className="font-medium">Category</span>
            </div>
            {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(CATEGORY_CONFIGS).map(([key, config]) => {
                const IconComponent = config.icon
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={filters.category === key}
                      onCheckedChange={(checked) => 
                        updateFilter('category', checked ? key as ActivityCategory : undefined)
                      }
                    />
                    <Label htmlFor={key} className="flex items-center space-x-2 cursor-pointer">
                      <IconComponent className="h-4 w-4" />
                      <span>{config.label}</span>
                    </Label>
                  </div>
                )
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Age Group Filter */}
        <Collapsible open={openSections.age} onOpenChange={() => toggleSection('age')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Age Group</span>
            </div>
            {openSections.age ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(AGE_GROUP_CONFIGS).map(([key, config]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`age-${key}`}
                    checked={filters.age_group === key}
                    onCheckedChange={(checked) => 
                      updateFilter('age_group', checked ? key as AgeGroup : undefined)
                    }
                  />
                  <Label htmlFor={`age-${key}`} className="cursor-pointer">
                    <Badge variant="outline" className={config.color}>
                      {config.label}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Themes Filter */}
        {filters.category && (
          <>
            <Collapsible open={openSections.themes} onOpenChange={() => toggleSection('themes')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span className="font-medium">Themes & Specializations</span>
                </div>
                {openSections.themes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableThemes().map((theme) => (
                    <div key={theme} className="flex items-center space-x-2">
                      <Checkbox
                        id={`theme-${theme}`}
                        checked={filters.themes?.includes(theme) || false}
                        onCheckedChange={() => toggleTheme(theme)}
                      />
                      <Label htmlFor={`theme-${theme}`} className="text-sm cursor-pointer">
                        {theme}
                      </Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator />
          </>
        )}

        {/* Quality Rating Filter */}
        <Collapsible open={openSections.quality} onOpenChange={() => toggleSection('quality')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span className="font-medium">Quality & Rating</span>
            </div>
            {openSections.quality ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-4">
            <div>
              <Label className="text-sm font-medium">
                Minimum Rating: {filters.min_rating || 0} stars
              </Label>
              <Slider
                value={[filters.min_rating || 0]}
                onValueChange={(value) => updateFilter('min_rating', value[0])}
                max={5}
                min={0}
                step={0.5}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Price Range</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {PRICE_RANGES.map((range) => (
                  <div key={range} className="flex items-center space-x-2">
                    <Checkbox
                      id={`price-${range}`}
                      checked={filters.price_range === range}
                      onCheckedChange={(checked) => 
                        updateFilter('price_range', checked ? range : undefined)
                      }
                    />
                    <Label htmlFor={`price-${range}`} className="cursor-pointer">
                      {range}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Languages Filter */}
        <Collapsible open={openSections.languages} onOpenChange={() => toggleSection('languages')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="font-medium">Languages Offered</span>
            </div>
            {openSections.languages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.slice(0, 10).map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang-${language}`}
                    checked={filters.languages?.includes(language) || false}
                    onCheckedChange={() => toggleLanguage(language)}
                  />
                  <Label htmlFor={`lang-${language}`} className="text-sm cursor-pointer">
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Religious Affiliation Filter */}
        <Collapsible open={openSections.religious} onOpenChange={() => toggleSection('religious')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="font-medium">Religious Affiliation</span>
            </div>
            {openSections.religious ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-1 gap-2">
              {RELIGIOUS_AFFILIATIONS.map((affiliation) => (
                <div key={affiliation} className="flex items-center space-x-2">
                  <Checkbox
                    id={`religion-${affiliation}`}
                    checked={filters.religious_affiliation === affiliation}
                    onCheckedChange={(checked) => 
                      updateFilter('religious_affiliation', checked ? affiliation : undefined)
                    }
                  />
                  <Label htmlFor={`religion-${affiliation}`} className="text-sm cursor-pointer">
                    {affiliation}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Age Range Slider */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Custom Age Range (in years)</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Label className="text-xs">Min Age:</Label>
              <Slider
                value={[filters.min_age ? Math.floor(filters.min_age / 12) : 0]}
                onValueChange={(value) => updateFilter('min_age', value[0] * 12)}
                max={18}
                min={0}
                step={1}
                className="flex-1"
              />
              <span className="text-xs w-8">{filters.min_age ? Math.floor(filters.min_age / 12) : 0}y</span>
            </div>
            <div className="flex items-center space-x-4">
              <Label className="text-xs">Max Age:</Label>
              <Slider
                value={[filters.max_age ? Math.floor(filters.max_age / 12) : 18]}
                onValueChange={(value) => updateFilter('max_age', value[0] * 12)}
                max={18}
                min={0}
                step={1}
                className="flex-1"
              />
              <span className="text-xs w-8">{filters.max_age ? Math.floor(filters.max_age / 12) : 18}y</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

