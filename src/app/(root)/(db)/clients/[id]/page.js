import { DEFAULT_LIMIT } from '@/constants'
import { fetchClient } from '@/lib/actions/client.actions'
import { fetchOrders } from '@/lib/actions/order.actions'
import ClientDetailsPageContent from '@/components/shared/ClientDetailsPageContent'

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
		client: JSON.parse(JSON.stringify(result[0])),
		orders: JSON.parse(JSON.stringify(result[1])),
	}

	return <ClientDetailsPageContent data={data} />
}
