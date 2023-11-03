'use client'

import { Button } from "../ui/button"
import { printAgreement } from "@/lib/pdf/agreement"

export default function Agreement({ settings, order, customPrices, normalPrices }) {
    
    return (
        <>
            <Button type='button' onClick={() => printAgreement(settings, order, customPrices, normalPrices)}>test</Button>            
        </>
    )
}
