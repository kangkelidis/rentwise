'use client'

import { changeSingleStateValue, hasCustomPrice, toCurrency } from '@/lib/utils'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { useState } from 'react'

// TODO: validate input to avoid NaN
//       reset when 0
export default function EditableInput(props) {
	const [isEditable, setIsEditable] = useState(hasCustomPrice(props.name, props.customPrices))

	function handleChange(e) {
		if (isNaN(e.target.value.replace(',', ''))) {
			return
		}
		changeSingleStateValue(
			props.setCustomPrices,
			props.name,
			Number(e.target.value.replace(',', ''))
		)
	}

	function handleEdit() {
		if (isEditable) {
			setIsEditable(false)

			changeSingleStateValue(
				props.setCustomPrices,
				props.name,
				null
			)
		} else {
			setIsEditable(true)
			
			changeSingleStateValue(
				props.setCustomPrices,
				props.name,
				props.normalPrices[props.name]
			)
		}
	}

	return (
		<div className='flex flex-row'>
			<Input
				onMouseEnter={() => console.log(props)}
				name={props.name}
				className={`${props.size === 'lg' ? 'w-[7rem]' : 'w-[6rem]'}`}
				size='sm'
				type=''
				classNames={{
					input: ['text-body-semibold', 'text-right'],
					inputWrapper: isEditable
						? ['border-green-400 border-2']
						: '',
				}}
				onChange={handleChange}
				readOnly={!isEditable}
				value={
					isEditable
						? props.customPrices[props.name]
						: toCurrency(props.normalPrices[props.name], null, true)
				}

				startContent={
					<div className='pointer-events-none flex items-center'>
						<span className='text-default-400 text-small'>€</span>
					</div>
				}
			></Input>
			<Button
				isIconOnly
				size='sm'
				className='bg-transparent'
				onPress={handleEdit}
			>
				<img src={isEditable ? '/assets/edit.svg' : '/assets/edit.svg'}></img>
			</Button>
		</div>
	)
}
