'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface LocationState {
  country: string
  city: string | null
}

interface LocationContextType {
  selectedCountry: string
  selectedCity: string | null
  setLocation: (country: string, city?: string | null) => void
  clearLocation: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const STORAGE_KEY = 'kanash-location'
const DEFAULT_COUNTRY = 'IL'

function loadLocation(): LocationState {
  if (typeof window === 'undefined') {
    return { country: DEFAULT_COUNTRY, city: null }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        country: parsed.country || DEFAULT_COUNTRY,
        city: parsed.city || null,
      }
    }
  } catch (e) {
    // ignore
  }
  
  return { country: DEFAULT_COUNTRY, city: null }
}

function saveLocation(state: LocationState) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    // Also set as cookie for server-side access
    document.cookie = `kanash-country=${state.country};path=/;max-age=${60 * 60 * 24 * 365}`
    if (state.city) {
      document.cookie = `kanash-city=${encodeURIComponent(state.city)};path=/;max-age=${60 * 60 * 24 * 365}`
    } else {
      document.cookie = 'kanash-city=;path=/;max-age=0'
    }
  } catch (e) {
    // ignore
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationState>({ country: DEFAULT_COUNTRY, city: null })
  
  useEffect(() => {
    setLocationState(loadLocation())
  }, [])

  const setLocation = useCallback((country: string, city?: string | null) => {
    const newState: LocationState = { country, city: city ?? null }
    setLocationState(newState)
    saveLocation(newState)
  }, [])

  const clearLocation = useCallback(() => {
    const newState: LocationState = { country: DEFAULT_COUNTRY, city: null }
    setLocationState(newState)
    saveLocation(newState)
  }, [])

  return (
    <LocationContext.Provider value={{
      selectedCountry: location.country,
      selectedCity: location.city,
      setLocation,
      clearLocation,
    }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
