import EquipmentForm from "@/components/forms/EquipmentForm";
import GroupForm from "@/components/forms/GroupForm";
import InsuranceForm from "@/components/forms/InsuranceForm";
import { equipmentColumns, groupColumns, insuranceColumns } from "@/components/tables/columns";
import TableUI from "@/components/tables/table";
import { fetchEquipment, fetchInsurances } from "@/lib/actions/extras.actions";
import { fetchGroups } from "@/lib/actions/group.actions";
import { fetchVehiclesInGroup } from "@/lib/actions/vehicle.actions";

async function getData() {
	const groups = fetchGroups()
    const equipment = fetchEquipment()
    const insurance = fetchInsurances()
    const result = await Promise.all([groups, equipment, insurance])
    const data = { 
        groups: result[0],
        equipment: result[1],
        insurance: result[2]
    }
	return data
}

export default async function Page({ searchParams }) {
    const data = await getData()
    
    const group = data.groups.find(g => g.id === searchParams.id)
    const equipment = data.equipment.find(g => g.id === searchParams.id)
    const insurance = data.insurance.find(g => g.id === searchParams.id)

    const newGroups = await Promise.all(data.groups.map(async g => ({...g._doc, id: g._doc._id, vehicles: await fetchVehiclesInGroup(g._id)})))

    // BUG: crashes on escape to cose modal
    return (
        <main>
            <h2 className="head-text">Settings</h2>
            <GroupForm group={JSON.stringify(group)} />
            <TableUI columns={groupColumns} data={JSON.stringify({items:newGroups, count:null})} />

            <EquipmentForm equipment={JSON.stringify(equipment)}/>
            <TableUI columns={equipmentColumns} data={JSON.stringify({items:data.equipment, count:null})} />

            <InsuranceForm insurance={JSON.stringify(insurance)} />
            <TableUI columns={insuranceColumns} data={JSON.stringify({items:data.insurance, count:null})} />

        </main>
    )
}
