import { createClient, User } from '@supabase/supabase-js'
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

  const [oneSignalInitialized, setOneSignalInitialized] =
    useState<boolean>(false)

  /**
   * Initializes OneSignal SDK for a given Supabase User ID
   * @param uid Supabase User ID
   */
  const initializeOneSignal = async (uid: string) => {
    if (oneSignalInitialized) {
      return
    }
    setOneSignalInitialized(true)
    await OneSignal.init({
      appId: oneSignalAppId,
      notifyButton: {
        enable: true,
      },

      allowLocalhostAsSecureOrigin: true,
    })

    await OneSignal.setExternalUserId(uid)
  }

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

  // Place a order with the selected price
  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { price } = Object.fromEntries(new FormData(event.currentTarget))
    if (typeof price !== 'string') return

    const { error } = await supabase
      .from('orders')
      .insert({ price: Number(price) })
    if (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      const initialUser = (await supabase.auth.getUser())?.data.user
      setUser(initialUser ?? null)
      if (initialUser) {
        initializeOneSignal(initialUser.id)
      }
    }

    initialize()

    const authListener = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null
        setUser(user)
        if (user) {
          initializeOneSignal(user.id)
        }
      }
    )

    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <Head>
        <title>OneSignal Order Notification App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center min-h-screen bg-black">
        {user ? (
          <form className="flex flex-col space-y-2" onSubmit={submitOrder}>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block p-2"
              name="price"
            >
              <option value="100">$100</option>
              <option value="200">$200</option>
              <option value="300">$300</option>
            </select>
            <button
              type="submit"
              className="py-1 px-4 text-lg bg-green-400 rounded"
            >
              Place an Order
            </button>
          </form>
        ) : (
          <form className="flex flex-col space-y-2" onSubmit={sendMagicLink}>
            <input
              className="border-green-300 border rounded p-2 bg-transparent text-white"
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
