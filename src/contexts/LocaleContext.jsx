'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { getMessage, defaultLocale, supportedLocales } from '@/lib/i18n'

const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(defaultLocale)

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && supportedLocales.includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }, [])

  const changeLocale = (newLocale) => {
    if (supportedLocales.includes(newLocale)) {
      setLocale(newLocale)
      localStorage.setItem('locale', newLocale)
    }
  }

  const t = (key) => getMessage(key, locale)

  return (
    <LocaleContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
