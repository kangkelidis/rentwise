'use client'

import { Button } from '@/components/ui/button'
import { useLocale } from '@/contexts/LocaleContext'

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useLocale()

  const languages = [
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'ru', name: 'RU', flag: '🇷🇺' }
  ]

  const currentLang = languages.find(lang => lang.code === locale)
  const otherLang = languages.find(lang => lang.code !== locale)

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => changeLocale(otherLang.code)}
      className="flex items-center gap-1 h-8 px-2 text-light-1 hover:bg-dark-3"
    >
      <span className="text-xs">{currentLang.flag}</span>
      <span className="text-xs font-medium">{currentLang.name}</span>
    </Button>
  )
}
