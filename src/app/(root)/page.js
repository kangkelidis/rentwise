import { printAgreement } from "@/lib/pdf/agreement"
import Agreement from "@/components/shared/Agreement"

export default async function Home() {

  
  return (
    <div className="flex p-24">
      <Agreement />
    </div>
  )
}

