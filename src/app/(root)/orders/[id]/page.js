import { OrderForm } from '@/components/forms/OrderForm'
import Agreement from '@/components/shared/Agreement'
import { fetchClientsList } from '@/lib/actions/client.actions'
import { fetchEquipment, fetchInsurances } from '@/lib/actions/extras.actions'
import { fetchOrder } from '@/lib/actions/order.actions'
import { fetchSettings } from '@/lib/actions/settings.action'
import { fetchVehicles } from '@/lib/actions/vehicle.actions'
import { auth } from "@clerk/nextjs";

export default async function Page({ params }) {
	const { userId } = auth();

	const order = fetchOrder(params.id)
	const vehicles = fetchVehicles()
	const clients = fetchClientsList()
	const equipment = fetchEquipment()
	const insurances = fetchInsurances()
    const settings = fetchSettings(userId)


	const result = await Promise.all([order, vehicles, clients, equipment, insurances, settings])
	const data = {
		order: result[0],
		vehicles: result[1],
		clients: result[2],
		equipment: result[3],
		insurances: result[4],
		settings: result[5]
	}
	return (
		<main>
			<h2 className='head-text'>Edit</h2>
			<OrderForm data={JSON.stringify(data)} />
			<Agreement settings={JSON.stringify(data.settings)} order={JSON.stringify(data.order)}/>
		</main>
	)
}
