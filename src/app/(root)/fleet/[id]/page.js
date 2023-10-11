import { VehicleForm } from "@/components/forms/VehicleForm";
import { getVehicle } from "@/lib/actions/vehicle.actions";

export default async function Page({ params }) {
    const vehicle = await getVehicle(params.id) 
    return (
        <>
            <h2 className="head-text">Edit</h2>
            <VehicleForm vehicle={JSON.stringify(vehicle)} />
        </>
    )
}
