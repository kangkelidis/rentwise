'use client'

import {Chip} from "@nextui-org/chip";
import {Avatar, AvatarGroup, AvatarIcon} from "@nextui-org/avatar";
import Image from "next/image";
import { Link } from "@nextui-org/link";

export default function VehicleDetails({ vehicle }) {
    console.log(vehicle);

    return (
        <div className="flex gap-3">
            <Avatar showFallback className="w-16 h-16 text-large" src={vehicle.thumb} fallback={
                <Image src='/assets/bxs-car.svg' width={42} height={42} alt="car-icon" />
            } />
            <div className="flex flex-col gap-1">
                <Link href={`/fleet/${vehicle.id}`} underline="hover">{vehicle.model + ' ' + vehicle.make}</Link>
                <Chip radius="none" variant='bordered' size="sm" className="">{vehicle.registration.slice(0,3) + ' ' + vehicle.registration.slice(3)}</Chip>

            </div>
        </div>
    )
}
