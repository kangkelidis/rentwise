import Link from 'next/link'
import { ownerColumns } from '@/components/tables/columns'
import { fetchOwners } from '@/lib/actions/owner.actions'
import TableUI from '@/components/tables/table'

import {Button} from '@nextui-org/button'

async function getData() {
	const owners = await fetchOwners()
	return owners.map((owner, index) => ({
        key: owner._id,
		code: owner.id,
		name: owner.name
	}))
}

export default async function Page() {
	const data = await getData()

	return (
		<main>
			<h2 className='head-text'>Owners</h2>
			<Button color='secondary'>
				<Link href={'/owners/create'}>Add Owner</Link>
			</Button>
			<TableUI columns={ownerColumns} data={data} />
		</main>
	)
}
