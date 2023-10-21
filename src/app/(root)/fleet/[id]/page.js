import { VehicleForm } from "@/components/forms/VehicleForm";
import { fetchGroups } from "@/lib/actions/group.actions";
import { getVehicle } from "@/lib/actions/vehicle.actions";

export default async function Page({ params }) {
    const vehicle = await getVehicle(params.id) 
    const groups = fetchGroups()

    const [data] = await Promise.all([groups])

    return (
        <>
            <h2 className="head-text">Edit</h2>
            <VehicleForm vehicle={JSON.stringify(vehicle)} data={JSON.stringify(data)} />
        </>
    )
}
