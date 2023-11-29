import { clientColumns } from '@/components/tables/columns'
import { Button } from '@nextui-org/button'
import { DEFAULT_LIMIT } from '@/constants'
import { fetchClients, totalCountClients } from '@/lib/actions/client.actions'
import { createFromCSV } from '@/lib/actions/client.actions'
import TableUI from '@/components/tables/table'
import Link from 'next/link'
import UploadCSVFile from '@/components/shared/UploadCSVFile'
import SearchInput from '@/components/shared/SearchInput'

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
		<div className=''>
			<div className='flex place-content-between mb-3 items-baseline'>
				<h2 className='head-text'>Clients</h2>
				<Button color='secondary' className='mb-4'>
					<Link href={'/clients/create'}>Add Client</Link>
				</Button>
			</div>
			<SearchInput />
			<TableUI columns={clientColumns} data={data} />

			<UploadCSVFile action={createFromCSV} />
		</div>
	)
}
