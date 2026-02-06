'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocation } from '@/lib/context/location-context'
import { LOCATIONS, getCountryName, getCitiesForCountry } from '@/lib/locations'

export function LocationSelector() {
  const locale = useLocale()
  const t = useTranslations('location')
  const tCountries = useTranslations('countries')
  const { selectedCountry, selectedCity, setLocation } = useLocation()
  const [showCities, setShowCities] = useState(false)
  const [selectedCountryForCities, setSelectedCountryForCities] = useState<string | null>(null)

  const currentCountry = LOCATIONS.find(c => c.code === selectedCountry)
  const displayLocation = selectedCity 
    ? selectedCity 
    : (currentCountry ? (locale === 'he' ? currentCountry.nameHe : currentCountry.name) : t('selectLocation'))

  function handleCountrySelect(code: string) {
    if (code === selectedCountry && !selectedCity) {
      // Already selected this country with no city filter
      return
    }
    
    // If the country has regions/cities, show city selection
    const country = LOCATIONS.find(c => c.code === code)
    if (country && country.regions.length > 0) {
      setSelectedCountryForCities(code)
      setShowCities(true)
      // Set country immediately, city can be refined
      setLocation(code, null)
    } else {
      setLocation(code, null)
    }
  }

  function handleCitySelect(city: string) {
    setLocation(selectedCountryForCities || selectedCountry, city)
    setShowCities(false)
    setSelectedCountryForCities(null)
  }

  function handleAllCities() {
    setLocation(selectedCountryForCities || selectedCountry, null)
    setShowCities(false)
    setSelectedCountryForCities(null)
  }

  if (showCities && selectedCountryForCities) {
    const country = LOCATIONS.find(c => c.code === selectedCountryForCities)
    if (!country) return null

    return (
      <DropdownMenu open onOpenChange={(open) => { if (!open) { setShowCities(false); setSelectedCountryForCities(null) } }}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 px-2 max-w-[180px]">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="text-sm truncate">{displayLocation}</span>
            <ChevronDown className="h-3 w-3 flex-shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-[400px] overflow-y-auto min-w-[200px]">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {locale === 'he' ? country.nameHe : country.name} {country.flag}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAllCities} className="cursor-pointer">
            <span className="font-medium">{locale === 'he' ? 'כל הערים' : 'All Cities'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {country.regions.map((region) => (
            <div key={region.name}>
              <DropdownMenuLabel className="text-xs text-muted-foreground py-1">
                {locale === 'he' ? region.nameHe : region.name}
              </DropdownMenuLabel>
              {region.cities.map((city) => {
                const cityDisplayName = locale === 'he' ? city.nameHe : city.name
                return (
                  <DropdownMenuItem
                    key={city.name}
                    onClick={() => handleCitySelect(cityDisplayName)}
                    className="cursor-pointer gap-2"
                  >
                    {selectedCity === cityDisplayName && <Check className="h-3 w-3" />}
                    <span>{cityDisplayName}</span>
                  </DropdownMenuItem>
                )
              })}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2 max-w-[180px]">
          <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
          <span className="text-sm truncate">{displayLocation}</span>
          <ChevronDown className="h-3 w-3 flex-shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t('selectLocation')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCATIONS.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountrySelect(country.code)}
            className={`cursor-pointer gap-2 ${selectedCountry === country.code ? 'bg-primary/5 font-medium' : ''}`}
          >
            <span>{country.flag}</span>
            <span>{locale === 'he' ? country.nameHe : country.name}</span>
            {selectedCountry === country.code && <Check className="h-3 w-3 ms-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
