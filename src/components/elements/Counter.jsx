'use client'

import { Button } from "@nextui-org/button"
import { useState } from "react"


export default function Counter({equip, index, setEquipmentData}) {
    // const [count, setCount] = useState(equip.count)


    function decrease() {
        if (equip.count === 0) {
            return
        }

        setEquipmentData(prev => {
            const newData = [...prev]
            newData[index] = {
                item: prev[index].item,
                count: prev[index].count -1,
            }
            return newData
        })

    }

    function increase() {
    
        setEquipmentData(prev => {
            const newData = [...prev]
            newData[index] = {
                item: prev[index].item,
                count: prev[index].count +1
            }
            return newData
        })
    }

    return (    
        <div>
            <span>{equip.item.name}</span>
            <div className="flex flex-row items-center ">
                <Button className="rounded-r-none" color="primary" size="sm" isIconOnly disabled={equip.count === 0} onPress={decrease}>-</Button>
                <div className="w-10 text-center p-[3.6px] bg-slate-100 text-black">{equip.count}</div>
                <Button className="rounded-l-none" color="primary" size="sm" isIconOnly onPress={increase}>+</Button>
            </div>
        </div>
    )
}
