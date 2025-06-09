import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fhkypiqhdfpmcuwjkoqb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  console.error('Missing Supabase API key. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to verify Supabase connection
export async function testSupabaseConnection() {
  try {
    // First, check if we can get the auth configuration
    const { data: authConfig, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Supabase auth configuration test failed:', authError.message)
      return false
    }

    console.log('Supabase auth configuration test successful')
    return true
  } catch (err) {
    console.error('Supabase connection test error:', err)
    return false
  }
} 