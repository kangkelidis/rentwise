'use client'

import OrderCard from '@/components/elements/OrderCard'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
    Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Card } from '@nextui-org/react'

export default function DailyPlan({ data }) {
    
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    const selectedDate = searchParams.get('date') || new Date()
    function handleDateChange(e) {
        const params = new URLSearchParams(searchParams)
		params.set('date', e)
		router.push(pathname + '?' + params.toString())
    }

	try {
		data = JSON.parse(data)
	} catch (error) {}

	return (
		<div className=''>
            <h2 className='text-heading2-bold my-5'>Daily Plan</h2>
            <div className=''>
            <span>Select Date </span>
			<Popover>
				<PopoverTrigger asChild>
					
						<Button
							variant={'outline'}
							className={`w-[240px] pl-3 text-left font-normal ${
								!selectedDate && 'text-muted-foreground'
							}`}
						>
							{selectedDate ? (
								format(new Date(selectedDate), 'PPP')
							) : (
								<span>Pick a date</span>
							)}
							<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
						</Button>
				
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						mode='single'
						selected={new Date(selectedDate)}
						onSelect={handleDateChange}
						disabled={(date) => date < new Date('1900-01-01')}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
            </div>

			<div className=' bg-content1 rounded-xl shadow-lg p-4 mt-3 '>
				{data?.orders?.map((order) => {
					return (
						<div key={order.id} className='my-3'>
							<OrderCard
								order={order.data}
								type={order.type}
								settings={data.settings}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}
