import { OrderForm } from '@/components/forms/OrderForm'
import { fetchClientsList } from '@/lib/actions/client.actions'
import { fetchEquipment, fetchInsurances } from '@/lib/actions/extras.actions'
import { fetchSettings } from '@/lib/actions/settings.action'
import { fetchVehicles, markUnavailable } from '@/lib/actions/vehicle.actions'
import { auth } from "@clerk/nextjs";

export default async function Page({ searchParams }) {
	const { userId } = auth();
	
	const vehicles = fetchVehicles()
	const clients = fetchClientsList()
    const equipment = fetchEquipment()
	const insurances = fetchInsurances()
	const settings = fetchSettings(userId)

	const result = await Promise.all([vehicles, clients, equipment, insurances, settings])
	const data = {
		vehicles: result[0],
		clients: result[1],
		equipment: result[2],
		insurances: result[3],
		settings: result[4],
	}

	const selectedVehicle = data.vehicles.find(v => v.id === searchParams.vehicle)
	const pickUpDate = new Date(searchParams.pickUp)
	const dropOfDate = new Date(searchParams.dropOff)

	if (!isNaN(pickUpDate) && !isNaN(dropOfDate)) {
		const markedVehicles = await markUnavailable(data.vehicles, pickUpDate, dropOfDate)
		data.vehicles = markedVehicles
	}

	return (
		<div className=''>
			<h2 className='head-text'>Add a new Order</h2>
			<OrderForm data={JSON.stringify(data)} />
		</div>
	)
}
