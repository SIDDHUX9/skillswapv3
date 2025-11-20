import { NextResponse } from 'next/server'

export async function GET() {
  // Log all environment variables (without exposing secrets)
  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
  }
  
  return NextResponse.json({
    message: 'Environment variable test',
    environment: process.env.NODE_ENV,
    variables: envVars,
    timestamp: new Date().toISOString()
  })
}