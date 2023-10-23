import { clientColumns } from '@/components/tables/columns'
import { Button } from '@nextui-org/button'
import { DEFAULT_LIMIT } from '@/constants'
import { fetchClients, totalCountClients } from '@/lib/actions/client.actions'
import TableUI from '@/components/tables/table'
import Link from 'next/link'

async function getData(page, limit) {
	const result = await fetchClients(page, limit)
	const clients = { items: result, count: await totalCountClients() }
	return JSON.stringify(clients)
}

export default async function Page({ searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT
	const data = await getData(page, limit)

	return (
		<div className=''>
			<div className='flex place-content-between mb-3 items-baseline'>
				<h2 className='head-text'>Clients</h2>
				<Button color='secondary' className='mb-4'>
					<Link href={'/clients/create'}>Add Client</Link>
				</Button>
			</div>
			<TableUI columns={clientColumns} data={data} />
		</div>
	)
}
