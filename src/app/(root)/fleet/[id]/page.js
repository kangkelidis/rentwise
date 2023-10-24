import { VehicleForm } from "@/components/forms/VehicleForm";
import { fetchGroups } from "@/lib/actions/group.actions";
import { fetchOwners } from "@/lib/actions/owner.actions";
import { fetchVehicle } from "@/lib/actions/vehicle.actions";

export default async function Page({ params }) {
    const groups = fetchGroups()
    const owners = fetchOwners()
    const vehicle = fetchVehicle(params.id) 

    const result = await Promise.all([groups, owners, vehicle])
    const data = {
        groups: result[0],
        owners: result[1],
        vehicle: JSON.parse(result[2]),
    }

    return (
        <>
            <h2 className="head-text">Edit</h2>
            <VehicleForm data={JSON.stringify(data)} />
        </>
    )
}
