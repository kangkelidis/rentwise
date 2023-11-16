'use client'

import { useRouter } from 'next/navigation'
import { SignOutButton, SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

export default function SignOutCard(props) {
	const router = useRouter()
	const { isSignedIn, user, isLoaded } = useUser()

	return (
		<>
			<SignOutButton
				signOutCallback={async () => {
					router.push('/sign-in')
				}}
			>
				<div className='flex cursor-pointer gap-4 p-4'>
					<Image src='/assets/logout.svg' alt='logout' width={24} height={24} />

					<div>
						<p>{user?.username}</p>
						<p className='text-light-2 max-lg:hidden'>Logout</p>
					</div>
				</div>
			</SignOutButton>
		</>
	)
}
