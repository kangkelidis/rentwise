import { Button } from "@/components/ui/button"
import { vehicleColumns } from "@/components/tables/columns"
import { DataTable } from "@/components/tables/data-table"
import { fetchAvailableVehicles, fetchVehicles } from "@/lib/actions/vehicle.actions"
import Link from 'next/link'

async function getData() {
  const vehicles = await fetchVehicles()
  return vehicles.map(vehicle => ({id: vehicle.id, make: vehicle.make, model: vehicle.model, year:vehicle.year, registration: vehicle.registration}))
}

export default async function Page() {
  const data = await getData()


  const from = new Date("2023-10-09T21:00:00.000+00:00")
  const till = new Date("2023-10-15T21:00:00.000+00:00")
  await fetchAvailableVehicles(from, till)



  return (
    <div className="container mx-auto py-10">
      <h2 className="head-text">Fleet</h2>
      <Button><Link href={'/fleet/create'}>Add Vehicle</Link></Button>
      <DataTable columns={vehicleColumns} data={data} />
    </div>
  )
}
