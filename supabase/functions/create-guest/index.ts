import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

interface GuestUsage {
  scans: number
  history: number
  favorites: number
  createdAt: number
  lastActive: number
}

interface GuestLimits {
  maxScans: number
  maxHistory: number
  maxFavorites: number
  sessionLifetime: number // in ms
  cleanupInterval: number // in ms
}

interface GuestResponse {
  guestId: string
  limits: Omit<GuestLimits, 'sessionLifetime' | 'cleanupInterval'>
  usage: {
    scans: number
    history: number
    favorites: number
    hasReachedLimit: boolean
    remainingScans: number
    remainingHistory: number
    remainingFavorites: number
    expiresAt: number
  }
}

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
}

// Guest usage limits and configuration
const GUEST_CONFIG: GuestLimits = {
  maxScans: 5,
  maxHistory: 5,
  maxFavorites: 5,
  sessionLifetime: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  cleanupInterval: 60 * 60 * 1000 // 1 hour in ms
}

// In-memory store for guest usage (in production, use a database like Supabase)
const guestUsage = new Map<string, GuestUsage>()

// Clean up old guest sessions
const cleanupOldSessions = (): void => {
  const now = Date.now()
  
  for (const [guestId, data] of guestUsage.entries()) {
    if (now - data.lastActive > GUEST_CONFIG.sessionLifetime) {
      guestUsage.delete(guestId)
    }
  }
}

// Run cleanup on startup and at configured interval
cleanupOldSessions()
setInterval(cleanupOldSessions, GUEST_CONFIG.cleanupInterval)

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    let guestId: string
    try {
      const body = await req.json()
      guestId = body?.guestId?.toString().trim()
    } catch (e) {
      throw new Error('Invalid request body')
    }
    
    if (!guestId || guestId.length > 100) {
      throw new Error('Valid guestId is required (max 100 characters)')
    }

    // Initialize or get guest usage
    const now = Date.now()
    let usage = guestUsage.get(guestId)
    
    if (!usage) {
      usage = {
        scans: 0,
        history: 0,
        favorites: 0,
        createdAt: now,
        lastActive: now
      }
      guestUsage.set(guestId, usage)
    } else {
      // Update last active time
      usage.lastActive = now
    }
    
    // Check if guest has reached any limits
    const hasReachedLimit = 
      usage.scans >= GUEST_CONFIG.maxScans ||
      usage.history >= GUEST_CONFIG.maxHistory ||
      usage.favorites >= GUEST_CONFIG.maxFavorites
    
    // Prepare response data
    const response: GuestResponse = {
      guestId,
      limits: {
        maxScans: GUEST_CONFIG.maxScans,
        maxHistory: GUEST_CONFIG.maxHistory,
        maxFavorites: GUEST_CONFIG.maxFavorites
      },
      usage: {
        scans: usage.scans,
        history: usage.history,
        favorites: usage.favorites,
        hasReachedLimit,
        remainingScans: Math.max(0, GUEST_CONFIG.maxScans - usage.scans),
        remainingHistory: Math.max(0, GUEST_CONFIG.maxHistory - usage.history),
        remainingFavorites: Math.max(0, GUEST_CONFIG.maxFavorites - usage.favorites),
        expiresAt: usage.lastActive + GUEST_CONFIG.sessionLifetime
      }
    }
    
    // Return guest usage data
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process guest request' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 500
      }
    )
  }
})
