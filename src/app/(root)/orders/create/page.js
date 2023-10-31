import { OrderForm } from '@/components/forms/OrderForm'
import { fetchClientsList } from '@/lib/actions/client.actions'
import { fetchEquipment, fetchInsurances } from '@/lib/actions/extras.actions'
import { fetchSettings } from '@/lib/actions/settings.action'
import { fetchVehicles } from '@/lib/actions/vehicle.actions'
import { auth } from "@clerk/nextjs";

export default async function Page(props) {
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

	return (
		<div className=''>
			<h2 className='head-text'>Add a new Order</h2>
			<OrderForm data={JSON.stringify(data)} />
		</div>
	)
}
