import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getAllCars } from "@/lib/actions"

async function getData() {
  // Fetch data from your API here.
  const cars = await getAllCars()
  console.log(cars);
  return cars.map(car => ({vehicle: [car.make, car.model, car.registration]}))
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
