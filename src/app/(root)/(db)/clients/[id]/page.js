import { ClientForm } from '@/components/forms/ClientForm'
import { orderColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'
import { DEFAULT_LIMIT } from '@/constants'
import { fetchClient } from '@/lib/actions/client.actions'
import { fetchOrders } from '@/lib/actions/order.actions'

export default async function Page({ params, searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT / 2
	const sortColumn = searchParams.sortColumn || 'number'
	const sortDirection = searchParams.sortDirection || 'descending'

	const client = fetchClient(params.id)
	const orders = fetchOrders(page, limit, sortColumn, sortDirection, {
		client: params.id,
	})
	const result = await Promise.all([client, orders])
	const data = {
		client: result[0],
		orders: result[1],
	}

	return (
		<div className='flex flex-col gap-4'>
			<h2 className='head-text'>Edit</h2>
			<div>
				<ClientForm data={JSON.stringify(data)} />
			</div>

			<div >
				<TableUI
                title='Order History'
					columns={orderColumns}
					rowsPerPage={DEFAULT_LIMIT / 2}
					data={JSON.stringify(data.orders)}
				/>
			</div>
		</div>
	)
}
