import { VehicleForm } from "@/components/forms/VehicleForm";
import { getCar } from "@/lib/actions/vehicle.actions";

export default async function Page({ params }) {
    const car = await getCar(params.id) 
    return (
        <>
            <h2 className="head-text">Edit</h2>
            <VehicleForm car={JSON.stringify(car)} />
        </>
    )
}
