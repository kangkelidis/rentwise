import { fetchEquipment, fetchInsurances } from '@/lib/actions/extras.actions'
import { fetchGroups } from '@/lib/actions/group.actions'
import { fetchSettings } from '@/lib/actions/settings.action'
import { fetchVehiclesInGroup } from '@/lib/actions/vehicle.actions'
import Settings from '@/components/shared/Settings'

import { auth } from '@clerk/nextjs'

async function getData() {
	const { userId } = auth()

	const groups = fetchGroups()
	const equipment = fetchEquipment()
	const insurance = fetchInsurances()
	const settings = fetchSettings(userId)
	const result = await Promise.all([groups, equipment, insurance, settings])
	const data = {
		groups: result[0],
		equipment: result[1],
		insurance: result[2],
		settings: result[3],
	}
	return data
}

export default async function Page({ searchParams }) {
	const data = await getData()

	const group = data.groups.find((g) => g.id === searchParams.id)
	const equipment = data.equipment.find((g) => g.id === searchParams.id)
	const insurance = data.insurance.find((g) => g.id === searchParams.id)

	const newGroups = await Promise.all(
		data.groups.map(async (g) => ({
			...g._doc,
			id: g._doc._id,
			vehicles: await fetchVehiclesInGroup(g._id),
		}))
	)

	const dataProps = {
		data: data,
		group: group,
		equipment: equipment,
		insurance: insurance,
		newGroups: newGroups,
	}
	// BUG: crashes on escape to close modal
	return (
		<main>
			<h2 className='head-text'>Settings</h2>

			<Settings data={JSON.stringify(dataProps)} />
		</main>
	)
}
