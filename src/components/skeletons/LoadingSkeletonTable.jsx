'use client'

import { Card } from '@nextui-org/card'
import { Skeleton } from '@nextui-org/skeleton'

export default function LoadingSkeletonTable(props) {
	return (
		<div className='space-y-9 mt-4 '>
			<div className='flex justify-between'>
				<Skeleton className='rounded-lg w-28'>
					<div className='h-10 rounded-lg bg-default-300'></div>
				</Skeleton>
				<Skeleton className='rounded-lg w-28'>
					<div className='h-10 rounded-lg bg-default-300'></div>
				</Skeleton>
			</div>
			<Card className='p-4 space-y-4' radius=''>
				<Skeleton className='rounded-lg'>
					<div className='h-10 rounded-lg bg-default-300'></div>
				</Skeleton>
				<div className='space-y-1'>
					{new Array(3).fill(0).map((_) => (
						<div className='space-y-1'>
							<Skeleton className='rounded-lg'>
								<div className='h-20 rounded-lg bg-default-300'></div>
							</Skeleton>
							<div className='h-20 rounded-lg'></div>
						</div>
					))}
				</div>
				<Skeleton className='rounded-lg w-28'>
					<div className='h-8 rounded-lg bg-default-300'></div>
				</Skeleton>
			</Card>
		</div>
	)
}
