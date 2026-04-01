import {
	fetchOrders,
	totalCountOrders,
	createFromCSV,
} from '@/lib/actions/order.actions'
import { DEFAULT_LIMIT } from '@/constants'
import OrdersPageContent from '@/components/shared/OrdersPageContent'

async function getData(page, limit, sortColumn, sortDirection, searchTerm) {
	const result = await fetchOrders(
		page,
		limit,
		sortColumn,
		sortDirection,
		searchTerm
	)
	const orders = result
	return JSON.stringify(orders)
}

export default async function Page({ searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT
	const sortColumn = searchParams.sortColumn || 'number'
	const sortDirection = searchParams.sortDirection || 'descending'
	const searchTerm = searchParams.search
		? !isNaN(searchParams.search)
			? {
					number: Number(searchParams.search),
			  }
			: {
					$or: [
						{ status: searchParams.search },
					],
			  }
		: {}
	const data = await getData(page, limit, sortColumn, sortDirection, searchTerm)

	return (
		<OrdersPageContent
			data={data}
			createFromCSV={createFromCSV}
		/>
	)
}
