import Link from 'next/link'
import { ownerColumns } from '@/components/tables/columns'
import { fetchOwners, totalCountOwners } from '@/lib/actions/owner.actions'
import TableUI from '@/components/tables/table'

import {Button} from '@nextui-org/button'
import { DEFAULT_LIMIT } from '@/constants'

async function getData(page, limit) {
	const result = await fetchOwners(page, limit)
	const owners = {items: result, count: await totalCountOwners()}
	return JSON.stringify(owners)
}

export default async function Page({ searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT
	const data = await getData(page, limit)

	return (
		<div className=''>
			<h2 className='head-text'>Owners</h2>
			<Button color='secondary' className='mb-4'>
				<Link href={'/owners/create'}>Add Owner</Link>
			</Button>
			<TableUI columns={ownerColumns} data={data} />
		</div>
	)
}
