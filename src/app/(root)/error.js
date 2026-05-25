'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@nextui-org/button'

export default function Error({ error, reset }) {
	const pathname = usePathname()

	useEffect(() => {
		console.error('Route error', {
			pathname,
			message: error?.message,
			digest: error?.digest,
			stack: error?.stack,
		})
	}, [error, pathname])

	return (
		<div className='rounded-lg border border-red-500/60 bg-red-500/10 p-5 text-sm'>
			<h2 className='mb-2 text-heading2-bold text-red-300'>
				Something went wrong
			</h2>
			<p className='mb-4 text-gray-300'>
				The page failed while rendering. The route and error details are shown
				below so the failing component or data can be traced quickly.
			</p>
			<div className='mb-4 space-y-2 rounded-md bg-black/20 p-3 font-mono text-xs'>
				<p>Route: {pathname}</p>
				<p>Message: {error?.message || 'Unknown error'}</p>
				{error?.digest && <p>Digest: {error.digest}</p>}
			</div>
			<Button color='danger' onPress={reset}>
				Try again
			</Button>
		</div>
	)
}
