import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const Home: NextPage = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const initialize = async () => {
      const initialUser = await supabase.auth.getUser()
      setUser(initialUser?.data.user ?? null)

      await OneSignal.init({
        appId: oneSignalAppId,
        notifyButton: {
          enable: true,
        },

        allowLocalhostAsSecureOrigin: true,
      })
    }

    initialize()

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.data.subscription.unsubscribe()
    }
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
              className="py-1 px-4 text-lg bg-green-400 rounded"
            >
              Place Order
            </button>
          </div>
        ) : (
          <form className="flex flex-col space-y-2" onSubmit={sendMagicLink}>
            <input
              className="border-green-300 border rounded p-2"
              type="email"
              name="email"
              placeholder="Email"
            />
            <button
              type="submit"
              className="py-1 px-4 text-lg bg-green-400 rounded"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </main>
    </>
  )
}

export default Home
