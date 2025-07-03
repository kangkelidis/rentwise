'use client'

import Image from 'next/image'
import { CldImage } from 'next-cloudinary'
import { Link } from '@nextui-org/link'

export default function VehicleDetails({ vehicle, size = 4, showRegistrationText = false }) {
    if (!vehicle) {
        return (
            <div className={`flex gap-3 w-full`}>
                <div style={{width: size + 'rem', height: size + 'rem'}} className='rounded-full bg-zinc-700 flex items-center justify-center'>
                    <Image
                        src='/assets/bxs-car.svg'
                        width={42/4 * size}
                        height={42/4 * size}
                        alt='car-icon'
                    />
                </div>
                <div className='flex flex-col gap-1 whitespace-nowrap'>
                    <p className='text-gray-500'>No vehicle data</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`flex gap-3 w-full ${vehicle.unavailable && 'bg-red-500'}`}>
            <div style={{width: size + 'rem', height: size + 'rem'}} className='rounded-full bg-zinc-700 flex items-center justify-center'>
                {vehicle?.photos?.length && vehicle.photos[0] ? (
                    <CldImage
                        className='rounded-full'
                        style={{width: size + 'rem', height: size + 'rem'}}
                        width={30/4 * size}
                        height={30/4 * size}
                        src={vehicle.photos[0]}
                    />
                ) : (
                    <Image
                        src='/assets/bxs-car.svg'
                        width={42/4 * size}
                        height={42/4 * size}
                        alt='car-icon'
                    />
                )}
            </div>

            <div className='flex flex-col gap-1 whitespace-nowrap'>
                <Link href={`/fleet/${vehicle?.id}`} underline='hover'>
                    {vehicle?.make + ' ' + vehicle?.model}
                </Link>
                {/* Logic for the fancy plate (large view) */}
                {size === 4 && vehicle?.registration && (
                    <div className=' border-black border-2 bg-red-300 flex w-fit text-shadow '>
                        <div className='w-2 h-full flex bg-blue'>
                        </div>
                        <p className='px-2 text-black font-bold p-[0.5px] whitespace-nowrap'>
                            {vehicle.registration.slice(0, 3) +
                                ' ' +
                                vehicle.registration.slice(3)}
                        </p>
                    </div>
                )}
                {/* New logic for simple text (table view) */}
                {showRegistrationText && (vehicle?.registration_number || vehicle?.registration) && (
                    <span className="text-xs text-gray-500">
                        {vehicle.registration_number || vehicle.registration}
                    </span>
                )}
            </div>
        </div>
    )
}
