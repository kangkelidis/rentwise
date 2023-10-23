'use client'

import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	getKeyValue,
	Spinner,
	Pagination,
} from '@nextui-org/react'
import useSWR from 'swr'

import { Button } from '@nextui-org/button'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAsyncList } from '@react-stately/data'
import { useCallback, useState, useMemo } from 'react'
import VehicleDetails from '../elements/vehicle-details'
import { DEFAULT_LIMIT } from '@/constants'
import { Link } from '@nextui-org/link'

export default function TableUI({ columns, data, selectionMode = 'single' }) {
	data = JSON.parse(data)
	const count = data.count
	const items = data.items
	const [isLoading, setIsLoading] = useState(true)
	const [selectedKeys, setSelectedKeys] = useState(new Set([]))

	const [page, setPage] = useState(1)

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const rowsPerPage = DEFAULT_LIMIT
	const pages = count ? Math.ceil(count / rowsPerPage) : 0

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createQueryString = useCallback(
		(name, value) => {
			const params = new URLSearchParams(searchParams)
			params.set(name, value)

			return params.toString()
		},
		[searchParams]
	)

	function onChangePage(page) {
		router.push(pathname + '?' + createQueryString('page', page))
		setPage(page)
	}

	const bottomContent = useMemo(() => {
		return (
			<div className='py-2 px-2 flex justify-between items-center'>
				{selectionMode === 'multiple' && (
					<span className='w-[30%] text-small text-default-400'>
						{selectedKeys === 'all'
							? 'All items selected'
							: `${selectedKeys.size} of ${count.length} selected`}
					</span>
				)}
				<Pagination
					isCompact
					showControls
					showShadow
					color='primary'
					page={page}
					total={pages}
					onChange={(page) => onChangePage(page)}
				/>
			</div>
		)
	}, [selectedKeys, page, pages])

	// find a way to make this work for all
	const renderCell = useCallback((item, columnKey) => {
		const cellValue = item[columnKey]

		switch (columnKey) {
			case 'number':
				return <Link href={`${pathname}/${item._id}`} underline='hover'>
				{cellValue}
			</Link>
			case 'vehicle':
				return <VehicleDetails vehicle={item}></VehicleDetails>

			case 'vehicle_id':
				return <VehicleDetails vehicle={item.vehicle_id}></VehicleDetails>
			case 'client_id':
				return <p>{item.client_id?.full_name}</p>
			case 'owner':
				return <p>{item.owner?.name}</p>
			default:
				return cellValue
		}
	}, [])

	return (
		<Table
			isStriped
			selectionMode={selectionMode}
			aria-label='Table with data'
			bottomContent={bottomContent}
			bottomContentPlacement='outside'
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn allowsSorting key={column.key}>
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody emptyContent={'No rows to display.'} items={items}>
				{(item) => (
					<TableRow key={item.key}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}
