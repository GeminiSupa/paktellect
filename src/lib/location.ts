import { supabase } from "./supabase"

export interface UserLocation {
  city: string | null
  country: string | null
}

/**
 * Detects the user's location via browser Geolocation or falls back to profile data.
 * In a real production app, you might use an IP-based service like ipapi.co or Cloudflare headers.
 */
export async function detectLocation(userId?: string): Promise<UserLocation> {
  // 1. Try browser geolocation first (highest accuracy)
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
    })
    
    // Reverse geocoding would happen here with a service like Google Maps or OpenStreetMap.
    // For MVP, we'll try to fetch from profile if geolocation is granted.
    console.log("Geolocation granted:", pos.coords.latitude, pos.coords.longitude)
  } catch (err) {
    console.warn("Geolocation denied or timed out")
  }

  // 2. Fallback to profile data if userId is provided
  if (userId) {
    const { data } = await supabase
      .from("profiles")
      .select("city, country")
      .eq("id", userId)
      .single()
    
    if (data?.city || data?.country) {
      return { city: data.city, country: data.country }
    }
  }

  // 3. Fallback to IP-based lookup (Mock for MVP)
  // In production: fetch('https://ipapi.co/json/').then(res => res.json())
  return { city: null, country: "Pakistan" } // Defaulting to Pakistan for this MVP context
}

/**
 * Sorts experts based on proximity to the user's detected location.
 */
export function sortExpertsByRelevance(experts: any[], userLoc: UserLocation) {
  if (!userLoc.city && !userLoc.country) return experts

  return [...experts].sort((a, b) => {
    // Exact city match gets top priority
    if (a.locationLabel?.includes(userLoc.city) && !b.locationLabel?.includes(userLoc.city)) return -1
    if (!a.locationLabel?.includes(userLoc.city) && b.locationLabel?.includes(userLoc.city)) return 1

    // Country match gets second priority
    if (a.locationLabel?.includes(userLoc.country) && !b.locationLabel?.includes(userLoc.country)) return -1
    if (!a.locationLabel?.includes(userLoc.country) && b.locationLabel?.includes(userLoc.country)) return 1

    return 0
  })
}
