'use client'

import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'

export default function UsePopover({ children }) {
	const [isMobile, setIsMobile] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	//choose the screen size
	const handleResize = () => {
		if (window.innerWidth < 768) {
			setIsMobile(true)
		} else {
			setIsMobile(false)
		}
	}

	// create an event listener
	useEffect(() => {
		window.addEventListener('resize', handleResize)
	})

	return (
        <div className='max-md:absolute max-md:-right-6 max-md:top-[6rem] max-md:-rotate-90 z-30'>
		<Popover
			// isOpen={!isMobile || isOpen}
			// onOpenChange={(open) => setIsOpen(open)}
			placement='max-md:top-start max-md:absolute'
		>
			<PopoverTrigger className='md:hidden'>
				<Button variant='solid' color='secondary' className=''>
					Summary
				</Button>
			</PopoverTrigger>
			<PopoverContent className='p-0 items-stretch'>

			<div className='w-[calc(90vw)]'>{children}</div>

            </PopoverContent>
		</Popover>

        </div>

	)
}

