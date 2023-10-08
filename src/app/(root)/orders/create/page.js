import { OrderForm } from "@/components/forms/OrderForm";
import { getAllCars } from "@/lib/actions/vehicle.actions";


export default async function Page(props) {
    let vehicles = await getAllCars()
	vehicles = vehicles.map((vehicle) => ({
		label: `${vehicle.make} ${vehicle.model}, ${vehicle.registration}`,
		value: vehicle._id,
	}))


    return (
        <main>
            <h2 className="head-text">Add a new Order</h2>
            <OrderForm vehicles={JSON.stringify(vehicles)}/>
        </main>
    )
}
