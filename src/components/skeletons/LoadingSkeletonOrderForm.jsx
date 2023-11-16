'use client'

import { Card } from '@nextui-org/card'
import { Skeleton } from '@nextui-org/skeleton'

export default function LoadingSkeletonOrderForm(props) {
	return (
		<div className='space-y-5'>
			<Skeleton className='rounded-lg w-48'>
				<div className='h-10 rounded-lg bg-default-300'></div>
			</Skeleton>
			<div className='flex gap-4'>
				<Card className='p-4 w-full space-y-5'>
					<Skeleton className='w-[8rem]'>
						<div className='h-6 rounded-lg bg-default-300'></div>
					</Skeleton>
					<div className='p-4'>
						<Skeleton className='rounded-lg'>
							<div className='h-[150px] rounded-lg bg-default-300'></div>
						</Skeleton>
					</div>
					<div className='p-4'>
						<Skeleton className='rounded-lg'>
							<div className='h-[150px] rounded-lg bg-default-300'></div>
						</Skeleton>
					</div>
					<div className='p-4'>
						<Skeleton className='rounded-lg'>
							<div className='h-[150px] rounded-lg bg-default-300'></div>
						</Skeleton>
					</div>
					<div className='p-4'>
						<Skeleton className='rounded-lg'>
							<div className='h-[150px] rounded-lg bg-default-300'></div>
						</Skeleton>
					</div>
				</Card>
				<Skeleton className='w-[48%] rounded-lg'>
					<div className='h-10 rounded-lg bg-default-300'></div>
				</Skeleton>
			</div>
		</div>
	)
}
