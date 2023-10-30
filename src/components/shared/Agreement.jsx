'use client'

import { Button } from "../ui/button"
import { printAgreement } from "@/lib/pdf/agreement"

export default function Agreement({ settings, order }) {
    
    return (
        <>
            <Button onClick={() => printAgreement(settings, order)}>test</Button>            
        </>
    )
}
