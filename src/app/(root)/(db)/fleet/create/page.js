import { VehicleForm } from "@/components/forms/VehicleForm";
import { fetchEquipment, fetchInsurances } from "@/lib/actions/extras.actions";
import { fetchGroups } from "@/lib/actions/group.actions";
import { fetchOwners } from "@/lib/actions/owner.actions";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function Page({ searchParams }) {
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
            <PageHeader titleKey="vehicle.addNewVehicle" fallbackTitle="Add a new Vehicle" />
            <VehicleForm data={JSON.stringify(data)}/>
        </main>
    )
}
