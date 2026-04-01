'use client'

import { useLocale } from '@/contexts/LocaleContext'

export function PageHeader({ titleKey, fallbackTitle }) {
  const { t } = useLocale()

  return (
    <h2 className="head-text">
      {titleKey ? t(titleKey) : fallbackTitle}
    </h2>
  )
}
