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
	Card,
	CardBody,
} from '@nextui-org/react'
import useSWR from 'swr'

import { Button } from '@nextui-org/button'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState, useMemo } from 'react'
import VehicleDetails from '../elements/vehicle-details'
import { DEFAULT_LIMIT } from '@/constants'
import { Link } from '@nextui-org/link'
import { toCurrency, zeroPad } from '@/lib/utils'
import DateDisplay from '../shared/DateDisplay'
import { deleteExtra } from '@/lib/actions/extras.actions'
import { deleteGroup } from '@/lib/actions/group.actions'
import { fetchVehiclesInGroup } from '@/lib/actions/vehicle.actions'
import { getTotalPrice } from '@/lib/price/rates'
import StatusChip from '../elements/StatusChip'
import { deleteOrder } from '@/lib/actions/order.actions'

export default function TableUI({ columns, data, selectionMode = 'single' }) {
	try {
		data = JSON.parse(data)
	} catch (error) {}
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
				{count && (
					<Pagination
						isCompact
						showControls
						showShadow
						color='primary'
						page={page}
						total={pages}
						onChange={(page) => onChangePage(page)}
					/>
				)}
			</div>
		)
	}, [selectedKeys, page, pages])

	// find a way to make this work for all
	const renderCell = useCallback((item, columnKey) => {
		const cellValue = item[columnKey]
		switch (columnKey) {
			case 'number':
				return (
					<Link href={`${pathname}/${item._id}`} underline='hover'>
						{zeroPad(cellValue, 3)}
					</Link>
				)
			case 'status': {
				return <StatusChip status={cellValue} />
			}
			case 'vehicle':
				return (
					<VehicleDetails
						vehicle={item.vehicle ? item.vehicle : item}
					></VehicleDetails>
				)
			case 'client':
				return (
					<Link href={`/clients/${item.client._id}`}>
						<p>{item.client?.full_name}</p>
					</Link>
				)

			case 'owner':
				return <p>{item.owner?.name}</p>
			case 'pick_up_date':
			case 'drop_off_date':
				return (
					<div className='flex gap-3'>
						<DateDisplay date={item[columnKey]} />
						<p>
							{
								item[
									columnKey === 'pick_up_date'
										? 'pick_up_location'
										: 'drop_off_location'
								]
							}
						</p>
					</div>
				)

			case 'prices':
				if (!cellValue) return
				return (
					<div>
						<p className='text-subtle-medium text-gray-500'>Vehicle</p>
						<p>
							{toCurrency(cellValue.vehicle.custom || cellValue.vehicle.total)}
						</p>
						<p className='text-subtle-medium text-gray-500'>Total</p>
						<p>{toCurrency(getTotalPrice(cellValue))}</p>
					</div>
				)

			case 'deposit_amount':
			case 'deposit_excess':
			case 'price_per_day':
				return toCurrency(cellValue)
			// groups
			case 'vehicles':
				return (
					<div className='flex flex-wrap gap-1'>
						{item.vehicles.map((v) => (
							<div
								key={v.id}
								className='bg-slate-700 px-2 text-tiny-medium rounded-md'
							>
								{v.make} {v.model}
							</div>
						))}
					</div>
				)
			case 'actions':
				return (
					<div>
						<Button
							isIconOnly
							size='sm'
							className='bg-transparent'
							onPress={() => {
								router.push(pathname + '?' + createQueryString('id', item.id))
							}}
						>
							<img src='/assets/edit.svg'></img>
						</Button>

						<Button
							isIconOnly
							size='sm'
							className='bg-transparent'
							onPress={async () => {
								// TODO: add confirmation
								if (item.category) {
									await deleteExtra(item._id, pathname)
								} else {
									await deleteGroup(item._id, pathname)
								}
							}}
						>
							<img src='/assets/delete.svg'></img>
						</Button>
					</div>
				)
				case 'actions_order':
					return (
						<div>
							<Button
								isIconOnly
								size='sm'
								className='bg-transparent'
								onPress={() => {
									router.push(pathname + '/' + item.id)
								}}
							>
								<img src='/assets/edit.svg'></img>
							</Button>
	
							<Button
								isIconOnly
								size='sm'
								className='bg-transparent'
								onPress={async () => {
									// TODO: add confirmation
									await deleteOrder(item.id, pathname)
								}}
							>
								<img src='/assets/delete.svg'></img>
							</Button>
						</div>
					)
			default:
				return cellValue
		}
	}, [])

	function handleSort({column, direction}) {
		const params = new URLSearchParams(searchParams)
		params.set('sortColumn', column)
		params.set('sortDirection', direction)
		router.push(pathname + '?' + params.toString())

	}

	return (
		<Card>
			<CardBody>
				<Table
					isStriped
					selectionMode={selectionMode}
					aria-label='Table with data'
					bottomContent={bottomContent}
					bottomContentPlacement='outside'
					sortDescriptor={{column: searchParams.get('sortColumn'), direction: searchParams.get('sortDirection')}}
					onSortChange={handleSort}
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
							<TableRow className='' key={item.key}>
								{(columnKey) => (
									<TableCell>{renderCell(item, columnKey)}</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>

			</CardBody>

		</Card>
	)
}
