import { orderColumns } from '@/components/tables/columns'
import { Button } from '@nextui-org/button'
import { fetchOrders, totalCountOrders } from '@/lib/actions/order.actions'
import Link from 'next/link'
import { DEFAULT_LIMIT } from '@/constants'
import TableUI from '@/components/tables/table'

async function getData(page, limit) {
	const result = await fetchOrders(page, limit)
    const orders = {items: result, count: await totalCountOrders()}
	return JSON.stringify(orders)
}

export default async function Page({ searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT
	const data = await getData(page, limit)

	return (
		<div className=''>
			<div className='flex place-content-between mb-3 items-baseline'>
				<h2 className='head-text'>Orders</h2>
				<Button color='secondary' className=''>
					<Link href={'/orders/create'}>Add Order</Link>
				</Button>
			</div>
			<TableUI columns={orderColumns} data={data} />
		</div>
	)
}
