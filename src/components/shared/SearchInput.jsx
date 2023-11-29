'use client'

import { SearchIcon } from 'lucide-react'
import { Input } from '@nextui-org/input'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function SearchInput(props) {
    const router = useRouter()
    const pathname = usePathname()
	const searchParams = useSearchParams()

	function handleChange(value) {
        const params = new URLSearchParams(searchParams)
        params.set('search', value)
        router.push(pathname + '?' + params.toString())
    }

	return (
		<>
			<Input
				classNames={{
					base: 'max-w-full sm:max-w-[15rem] h-10 my-4',
					mainWrapper: 'h-full',
					input: 'text-small',
					inputWrapper:
						'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
				}}
				placeholder='Type to search...'
				size='sm'
				startContent={<SearchIcon size={18} />}
				type='search'
				onChange={(e) => handleChange(e.target.value)}
			/>
		</>
	)
}
