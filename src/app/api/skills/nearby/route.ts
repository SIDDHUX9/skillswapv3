import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

// GET /api/skills/nearby - Get skills within a certain radius
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseFloat(searchParams.get('radius') || '5') // Default 5km
    const category = searchParams.get('category') || ''
    const minRating = parseFloat(searchParams.get('minRating') || '0')
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999')
    const availability = searchParams.get('availability') || 'all'
    const sortBy = searchParams.get('sortBy') || 'distance'

    if (lat === 0 || lng === 0) {
      return NextResponse.json(
        { error: 'Valid latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Get skills with basic filtering
    const skills = await DatabaseService.getSkills({
      category: category === 'all' ? undefined : category,
      lat,
      lng,
      radius,
      limit: 50
    })

    // Filter by rating and price
    let filteredSkills = skills.filter(skill => 
      skill.avgRating >= minRating && 
      skill.priceCredits <= maxPrice
    )

    // Calculate distance and filter by radius
    filteredSkills = filteredSkills.map(skill => {
      const distance = calculateDistance(lat, lng, skill.lat, skill.lng)
      return { ...skill, distance }
    }).filter(skill => skill.distance <= radius)

    // Sort results
    switch (sortBy) {
      case 'distance':
        filteredSkills.sort((a, b) => a.distance - b.distance)
        break
      case 'rating':
        filteredSkills.sort((a, b) => b.avgRating - a.avgRating)
        break
      case 'price_low':
        filteredSkills.sort((a, b) => a.priceCredits - b.priceCredits)
        break
      case 'price_high':
        filteredSkills.sort((a, b) => b.priceCredits - a.priceCredits)
        break
      case 'newest':
        filteredSkills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        filteredSkills.sort((a, b) => a.distance - b.distance)
    }

    return NextResponse.json(filteredSkills)
  } catch (error) {
    console.error('Error fetching nearby skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nearby skills' },
      { status: 500 }
    )
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}