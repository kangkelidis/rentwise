'use client'

import { Chip } from '@nextui-org/chip'
import { Avatar, AvatarGroup, AvatarIcon } from '@nextui-org/avatar'
import Image from 'next/image'
import { Link } from '@nextui-org/link'

export default function VehicleDetails({ vehicle }) {

	return (
		<div className='flex gap-3 w-fit'>
			<Avatar
				showFallback
				className='w-16 h-16 text-large'
				src={vehicle.thumb}
				fallback={
					<Image
						src='/assets/bxs-car.svg'
						width={42}
						height={42}
						alt='car-icon'
					/>
				}
			/>
			<div className='flex flex-col gap-1 whitespace-nowrap'>
				<Link href={`/fleet/${vehicle.id}`} underline='hover'>
					{vehicle.make + ' ' + vehicle.model}
				</Link>
				<div className=' border-black border-2 bg-red-400 flex w-fit text-shadow '>
                    <div className='w-2 h-full flex bg-blue'><div className='mt-4 w-2 h-1 bg-yellow-300'></div></div>
                    <p className='px-2 text-black font-bold p-[0.5px] whitespace-nowrap'>
                        {vehicle.registration.slice(0, 3) +
                            ' ' +
                            vehicle.registration.slice(3)}
                    </p>
				</div>
			</div>
		</div>
	)
}
