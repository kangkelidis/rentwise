import { OrderForm } from "@/components/forms/OrderForm";
import { fetchClientsList } from "@/lib/actions/client.actions";
import { fetchVehicles } from "@/lib/actions/vehicle.actions";


export default async function Page(props) {
    const vehicles = fetchVehicles()
    const clients = fetchClientsList()

    const result = await Promise.all([vehicles, clients])
    const data = {
        vehicles: result[0],
        clients: result[1]
    }

    return (
        <main>
            <h2 className="head-text">Add a new Order</h2>
            <OrderForm data={JSON.stringify(data)}/>
        </main>
    )
}
