import React from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import '@/styles/globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Auth',
  description: 'Login',
}

export default function RootLayout({ children }) {
 return (
  <ClerkProvider
  appearance={{
    baseTheme: dark,
    elements: {
      footer: 'hidden'
    }
  }}
  >
      <html lang='en'>
        <body className={`${inter.className}`}>{children}</body>
      </html>
  </ClerkProvider>
  )
}