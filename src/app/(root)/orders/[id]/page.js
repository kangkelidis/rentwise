import { OrderForm } from "@/components/forms/OrderForm";
import { fetchClientsList } from "@/lib/actions/client.actions";
import { fetchOrder } from "@/lib/actions/order.actions";
import { fetchVehiclesList } from "@/lib/actions/vehicle.actions";

export default async function Page({ params }) {
    const order = await fetchOrder(params.id) 
    const vehicles = JSON.stringify(await fetchVehiclesList())
    const clients = JSON.stringify(await fetchClientsList())
    
    return (
        <main>
            <h2 className="head-text">Edit</h2>
            <OrderForm order={JSON.stringify(order)} vehicles={vehicles} clients={clients} />
        </main>
    )
}
