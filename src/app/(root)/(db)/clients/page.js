import { DEFAULT_LIMIT } from '@/constants'
import { fetchClients, totalCountClients } from '@/lib/actions/client.actions'
import { createFromCSV } from '@/lib/actions/client.actions'
import ClientsPageContent from '@/components/shared/ClientsPageContent'

async function getData(page, limit, sortColumn, sortDirection, searchTerm) {
	const result = await fetchClients(
		page,
		limit,
		sortColumn,
		sortDirection,
		searchTerm
	)
	return JSON.stringify(result)
}

export default async function Page({ searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT
	const sortColumn = searchParams.sortColumn || 'number'
	const sortDirection = searchParams.sortDirection || 'descending'
	const searchTerm = searchParams.search
		? { full_name: new RegExp(searchParams.search, 'i') }
		: {}
	const data = await getData(page, limit, sortColumn, sortDirection, searchTerm)

	return (
		<ClientsPageContent
			data={data}
			createFromCSV={createFromCSV}
		/>
	)
}
