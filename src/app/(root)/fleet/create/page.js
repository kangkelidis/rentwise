import { VehicleForm } from "@/components/forms/VehicleForm";
import { fetchEquipment, fetchInsurances } from "@/lib/actions/extras.actions";
import { fetchGroups } from "@/lib/actions/group.actions";
import { fetchOwners } from "@/lib/actions/owner.actions";

export default async function Page(props) {
    const groups = fetchGroups()
    const owners = fetchOwners()
    const insurances = fetchInsurances()


    const result = await Promise.all([groups, owners, insurances])
    const data = {
        groups: result[0],
        owners: result[1],
        insurances: result[2],
    }

    return (
        <main>
            <h2 className="head-text">Add a new Vehicle</h2>
            <VehicleForm data={JSON.stringify(data)}/>
        </main>
    )
}
