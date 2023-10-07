import { VehicleProfile } from "@/components/forms/VehicleProfile";
import { getCar } from "@/lib/actions/cars.actions";

export default async function Page({ params }) {
    const car = await getCar(params.id) 
    console.log(car);
    return (
        <>
            <h2 className="head-text">Edit</h2>
            <VehicleProfile car={JSON.stringify(car)} />
        </>
    )
}
