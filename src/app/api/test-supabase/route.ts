import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    console.log('Environment variables:')
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing')
    console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
    console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing')
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').single()
    
    if (error) {
      console.error('Supabase connection error:', error.message)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'The users table does not exist. Please run the database schema setup first.',
        env: {
          url: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
          anonKey: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
          serviceKey: process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing',
        },
        setupInstructions: {
          step1: 'Go to your Supabase project dashboard',
          step2: 'Click on "SQL Editor" in the left sidebar',
          step3: 'Copy and paste the entire contents of supabase-schema.sql',
          step4: 'Click "Run" to execute the schema',
          step5: 'Test this endpoint again'
        }
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful!',
      data: data,
      env: {
        url: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
        anonKey: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
        serviceKey: process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing',
      },
      nextSteps: [
        'Database is properly set up',
        'You can now test user registration and booking functionality',
        'Visit http://localhost:3000 to test the application'
      ]
    })
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      env: {
        url: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
        anonKey: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
        serviceKey: process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing',
      }
    })
  }
}