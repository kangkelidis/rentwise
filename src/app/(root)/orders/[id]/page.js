import { OrderForm } from '@/components/forms/OrderForm'
import { fetchClientsList } from '@/lib/actions/client.actions'
import { fetchEquipment, fetchInsurances } from '@/lib/actions/extras.actions'
import { fetchOrder } from '@/lib/actions/order.actions'
import { fetchVehicles } from '@/lib/actions/vehicle.actions'

export default async function Page({ params }) {
	const order = fetchOrder(params.id)
	const vehicles = fetchVehicles()
	const clients = fetchClientsList()
	const equipment = fetchEquipment()
	const insurances = fetchInsurances()

	const result = await Promise.all([order, vehicles, clients, equipment, insurances])
	const data = {
		order: result[0],
		vehicles: result[1],
		clients: result[2],
		equipment: result[3],
		insurances: result[4]
	}
	return (
		<main>
			<h2 className='head-text'>Edit</h2>
			<OrderForm data={JSON.stringify(data)} />
		</main>
	)
}
