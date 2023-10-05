'use client'

import { getMakes } from '@/lib/carsDB'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { use } from 'react'
import { ScrollArea } from './ui/scroll-area'

const formSchema = z.object({
	make: z.string(),
	model: z.string(),
	category: z.string().array(),
	year: z.number(),
})

export function SelectCarForm() {
	const carMakes = use(getMakes())

	// 1. Define your form.
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			make: '',
			model: '',
			category: [''],
			year: 1,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='make'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel>Make</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant='outline'
											role='combobox'
											className={cn(
												'w-[200px] justify-between',
												!field.value && 'text-muted-foreground'
											)}
										>
											{field.value
												? carMakes.find((make) => make.value === field.value)
														?.label
												: 'Select car make'}
											<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-[200px] p-0'>
									<Command>
										<CommandInput placeholder='Search Make...' />
                                            <CommandEmpty>No Make found.</CommandEmpty>
                                            <CommandGroup className=' overflow-scroll'>
                                                {carMakes.map((make) => (
                                                    <CommandItem
                                                        value={carMakes.label}
                                                        key={carMakes.value}
                                                        onSelect={() => {
                                                            form.setValue('make', make.value)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                make.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                        {make.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>

									</Command>
								</PopoverContent>
							</Popover>
							<FormDescription>
								This is the language that will be used in the dashboard.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>Submit</Button>
			</form>
		</Form>
	)
}
