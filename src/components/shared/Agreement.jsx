'use client'

import { Button } from "../ui/button"
import { printAgreement } from "@/lib/pdf/agreement"

export default function Agreement({ order }) {
    
    return (
        <>
            <Button onClick={() => printAgreement(order)}>test</Button>            
        </>
    )
}
