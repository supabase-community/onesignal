import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const Home: NextPage = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getInitialUser = async () => {
      const initialUser = await supabase.auth.getUser()
      setUser(initialUser?.data.user ?? null)
    }

    getInitialUser()

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => authListener.data.subscription.unsubscribe()
  }, [])

  const sendMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { email } = Object.fromEntries(new FormData(event.currentTarget))
    if (typeof email !== 'string') return

    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email inbox')
    }
  }

  // Create a order with price of $100
  const submitOrder = async () => {
    const { error } = await supabase.from('orders').insert({
      price: 100,
    })
    if (error) {
      alert(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>OneSignal Order Notification App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center min-h-screen">
        {user ? (
          <div>
            <button
              onClick={submitOrder}
              className="py-1 px-4 text-lg bg-blue-400"
            >
              Order
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <form onSubmit={sendMagicLink}>
              <input type="email" name="email" placeholder="Email" />
              <button type="submit" className="py-1 px-4 text-lg bg-blue-400">
                Send Magic Link
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  )
}

export default Home
