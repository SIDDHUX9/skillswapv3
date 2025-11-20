'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  Globe,
  Users,
  Star,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react'

interface Location {
  lat: number
  lng: number
  address?: string
}

interface GeoLocationFilterProps {
  onLocationChange: (location: Location) => void
  onRadiusChange: (radius: number) => void
  onFiltersChange: (filters: any) => void
  className?: string
}

export function GeoLocationFilter({ 
  onLocationChange, 
  onRadiusChange, 
  onFiltersChange,
  className 
}: GeoLocationFilterProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [searchLocation, setSearchLocation] = useState('')
  const [radius, setRadius] = useState([5]) // Default 5km radius
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    minRating: 0,
    maxPrice: 100,
    availability: 'all',
    sortBy: 'distance'
  })

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser')
      return
    }

    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCurrentLocation(location)
        onLocationChange(location)
        setIsLoadingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        setIsLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }, [onLocationChange])

  // Search for location by address
  const searchLocationByAddress = async (address: string) => {
    if (!address.trim()) return

    try {
      // This would use a geocoding service like Google Maps API
      // For now, we'll simulate with a simple lookup
      const response = await fetch(`/api/geocoding/search?q=${encodeURIComponent(address)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          const location = {
            lat: data.results[0].lat,
            lng: data.results[0].lng,
            address: data.results[0].formatted_address
          }
          setCurrentLocation(location)
          onLocationChange(location)
        }
      }
    } catch (error) {
      console.error('Error searching location:', error)
    }
  }

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Handle radius change
  const handleRadiusChange = (value: number[]) => {
    setRadius(value)
    onRadiusChange(value[0])
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  // Get location on mount if user wants to use current location
  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation()
    }
  }, [useCurrentLocation, getCurrentLocation])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location-Based Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-current-location"
              checked={useCurrentLocation}
              onCheckedChange={setUseCurrentLocation}
            />
            <Label htmlFor="use-current-location" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Use my current location
            </Label>
          </div>

          {useCurrentLocation && (
            <Button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              variant="outline"
              className="w-full"
            >
              {isLoadingLocation ? (
                'Getting location...'
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Current Location
                </>
              )}
            </Button>
          )}

          {!useCurrentLocation && (
            <div className="space-y-2">
              <Label htmlFor="location-search">Search Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location-search"
                  placeholder="Enter address, city, or zip code..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      searchLocationByAddress(searchLocation)
                    }
                  }}
                />
                <Button
                  onClick={() => searchLocationByAddress(searchLocation)}
                  disabled={!searchLocation.trim()}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentLocation && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-green-600" />
                <span>
                  {currentLocation.address || 
                   `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Radius Selection */}
        <div className="space-y-2">
          <Label>Search Radius: {radius[0]} km</Label>
          <Slider
            value={radius}
            onValueChange={handleRadiusChange}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Additional Filters
          </h4>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ACADEMIC">Academic</SelectItem>
                <SelectItem value="ARTS">Arts</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="COOKING">Cooking</SelectItem>
                <SelectItem value="FITNESS">Fitness</SelectItem>
                <SelectItem value="LANGUAGE">Language</SelectItem>
                <SelectItem value="MUSIC">Music</SelectItem>
                <SelectItem value="TECH">Technology</SelectItem>
                <SelectItem value="TRADES">Trades</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label>Minimum Rating: {filters.minRating}+ stars</Label>
            <Slider
              value={[filters.minRating]}
              onValueChange={(value) => handleFilterChange('minRating', value[0])}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <Label>Maximum Price: {filters.maxPrice} credits</Label>
            <Slider
              value={[filters.maxPrice]}
              onValueChange={(value) => handleFilterChange('maxPrice', value[0])}
              max={200}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          {/* Availability Filter */}
          <div className="space-y-2">
            <Label>Availability</Label>
            <Select
              value={filters.availability}
              onValueChange={(value) => handleFilterChange('availability', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="weekend">Weekend</SelectItem>
                <SelectItem value="evening">Evenings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price_low">Price (Low to High)</SelectItem>
                <SelectItem value="price_high">Price (High to Low)</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <Label>Quick Filters</Label>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleFilterChange('sortBy', 'distance')}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Nearest
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleFilterChange('minRating', 4)}
            >
              <Star className="h-3 w-3 mr-1" />
              Top Rated
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleFilterChange('maxPrice', 25)}
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Budget Friendly
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleFilterChange('availability', 'today')}
            >
              <Clock className="h-3 w-3 mr-1" />
              Available Today
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleFilterChange('sortBy', 'popular')}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}