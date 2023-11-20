'use client'

import { Card } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import React from 'react'

export default function OrderCard({ order }) {
    

    return (
        <Card>
            <div>
                {order?.pick_up_date9}

            </div>
            <Divider orientation='vertical'/>
        </Card>
    )
}
