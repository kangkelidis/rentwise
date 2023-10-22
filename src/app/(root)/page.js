import { printAgreement } from "@/lib/pdf/agreement"
import Agreement from "@/components/shared/Agreement"
import Upload from "@/components/elements/Upload"

import VehicleDetails from "@/components/elements/vehicle-details"

export default async function Home() {

  
  return (
    <div className="flex p-24 flex-col gap-5">
      <Agreement />
      <VehicleDetails vehicle={{registration: 'NAT142', thumb: '', group: 'economy' }}/>
      <Upload />
    </div>
  )
}

