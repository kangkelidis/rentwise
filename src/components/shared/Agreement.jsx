'use client'

import { Button } from "../ui/button"
import { printAgreement } from "@/lib/pdf/agreement"

export default function Agreement(props) {
    

    return (
        <>
            <Button onClick={() => printAgreement(1)}>test</Button>            
        </>
    )
}
