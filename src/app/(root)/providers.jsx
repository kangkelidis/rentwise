'use client'

import {NextUIProvider} from '@nextui-org/react'
import { LocaleProvider } from '@/contexts/LocaleContext'

export function Providers({children}) {
  return (
    <NextUIProvider>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </NextUIProvider>
  )
}
