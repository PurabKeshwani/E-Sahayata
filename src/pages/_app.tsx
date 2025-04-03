import { AppProps } from 'next/app'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        // Handle auth state changes
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user)
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
