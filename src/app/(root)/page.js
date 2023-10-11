import { printAgreement } from "@/lib/pdf/agreement"
import { Button } from "@/components/ui/button"

export default async function Home() {
  printAgreement(1)
  
  return (
    <div className="flex p-24">
    </div>
  )
}

