'use client'

import { Avatar, AvatarGroup, AvatarIcon } from '@nextui-org/avatar'
import Image from 'next/image'
import { CldImage } from 'next-cloudinary'

import { Link } from '@nextui-org/link'

export default function VehicleDetails({ vehicle }) {
	return (
		<div className='flex gap-3 w-fit'>
            <div className='rounded-full w-16 h-16 bg-zinc-700 flex items-center  justify-center'>
                {vehicle?.photos?.length && vehicle.photos[0] ? (
                    <CldImage
                        className='rounded-full w-16 h-16'
                        width={30}
                        height={30}
                        src={vehicle.photos[0]}
                        crop='thumb'
                    />
                ) : (
                    <Image
                        src='/assets/bxs-car.svg'
                        width={42}
                        height={42}
                        alt='car-icon'
                    />
                )}
            </div>

			<div className='flex flex-col gap-1 whitespace-nowrap'>
				<Link href={`/fleet/${vehicle.id}`} underline='hover'>
					{vehicle.make + ' ' + vehicle.model}
				</Link>
				<div className=' border-black border-2 bg-red-300 flex w-fit text-shadow '>
					<div className='w-2 h-full flex bg-blue'>
						<div className='mt-4 w-2 h-1 py-1 bg-yellow-300'></div>
					</div>
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
