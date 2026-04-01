import { fetchOwners, totalCountOwners } from '@/lib/actions/owner.actions'
import { DEFAULT_LIMIT } from '@/constants'
import OwnersPageContent from '@/components/shared/OwnersPageContent'

async function getData(page, limit, sortColumn, sortDirection) {
	const result = await fetchOwners(page, limit, sortColumn, sortDirection)
	const owners = {items: result, count: await totalCountOwners()}
	return JSON.stringify(owners)
}

export default async function Page({ searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT
	const sortColumn = searchParams.sortColumn || 'number'
	const sortDirection = searchParams.sortDirection || 'descending'
	const data = await getData(page, limit, sortColumn, sortDirection)

	return (
		<OwnersPageContent data={data} />
	)
}
