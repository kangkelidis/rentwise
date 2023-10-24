import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import {Providers} from "./providers";

import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Bottombar from '@/components/shared/Bottombar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Rentwise',
	description: 'Car rental management',
}

export default function RootLayout({ children }) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark,
			}}
		>
			<html lang='en' className='dark'>
				<body className={`${inter.className}`}>
					<Providers>
					<Topbar />
					<main className='flex flex-row'>
						<LeftSidebar />
						<section className='main-container w-full'>
							<div className='w-full max-w-7xl'>{children}</div>
						</section>
					</main>
					<Bottombar />
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	)
}
