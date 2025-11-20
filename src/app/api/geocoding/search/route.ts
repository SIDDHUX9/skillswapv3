import { NextRequest, NextResponse } from 'next/server'

// GET /api/geocoding/search - Search for locations by address
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query is required and must be at least 2 characters' },
        { status: 400 }
      )
    }

    // In a real implementation, you would use a geocoding service like:
    // - Google Maps Geocoding API
    // - Mapbox Geocoding API
    // - OpenStreetMap Nominatim (free)
    // - Here Geocoding API
    
    // For this example, we'll simulate with some common locations
    const mockLocations = [
      {
        lat: 40.7128,
        lng: -74.0060,
        formatted_address: "New York, NY, USA",
        place_id: "chij58si60w5wyrkc2l7yf8g8cq"
      },
      {
        lat: 34.0522,
        lng: -118.2437,
        formatted_address: "Los Angeles, CA, USA",
        place_id: "chijc2vjs0yswt0kre8l7yf8g8cq"
      },
      {
        lat: 41.8781,
        lng: -87.6298,
        formatted_address: "Chicago, IL, USA",
        place_id: "chij7rd00ywsbt0kre8l7yf8g8cq"
      },
      {
        lat: 29.7604,
        lng: -95.3698,
        formatted_address: "Houston, TX, USA",
        place_id: "chij8kew0ywt0kre8l7yf8g8cq"
      },
      {
        lat: 33.4484,
        lng: -112.0740,
        formatted_address: "Phoenix, AZ, USA",
        place_id: "chij9s0ywt0kre8l7yf8g8cq"
      },
      {
        lat: 39.7392,
        lng: -104.9903,
        formatted_address: "Denver, CO, USA",
        place_id: "chij0t1ywt0kre8l7yf8g8cq"
      },
      {
        lat: 47.6062,
        lng: -122.3321,
        formatted_address: "Seattle, WA, USA",
        place_id: "chij1u2ywt0kre8l7yf8g8cq"
      },
      {
        lat: 25.7617,
        lng: -80.1918,
        formatted_address: "Miami, FL, USA",
        place_id: "chij2v3ywt0kre8l7yf8g8cq"
      }
    ]

    // Simple text matching for demo purposes
    const queryLower = query.toLowerCase()
    const filteredLocations = mockLocations.filter(location => 
      location.formatted_address.toLowerCase().includes(queryLower)
    )

    // If no matches found, return a default location based on query
    if (filteredLocations.length === 0) {
      // Generate a pseudo-random location based on query hash
      const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const lat = 25 + (hash % 25) // Between 25 and 50
      const lng = -125 + (hash % 50) // Between -125 and -75
      
      filteredLocations.push({
        lat,
        lng,
        formatted_address: `${query}, USA`,
        place_id: `generated_${hash}`
      })
    }

    return NextResponse.json({
      results: filteredLocations,
      status: "OK"
    })

  } catch (error) {
    console.error('Error searching location:', error)
    return NextResponse.json(
      { error: 'Failed to search location' },
      { status: 500 }
    )
  }
}