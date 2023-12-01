'use client'

import { changeSingleStateValue, hasCustomPrice, toCurrency } from '@/lib/utils'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { useState } from 'react'

// TODO: validate input to avoid NaN
//       reset when 0
export default function EditableInput(props) {
	const [isEditable, setIsEditable] = useState(
		hasCustomPrice(props.name, props.prices, props.equipment)
	)

	function handleChange(e) {
		if (isNaN(e.target.value.replace(',', ''))) {
			return
		}
		props.setPrices((prev) => {
			return props.equipment
				? {
						...prev,
						equipment: {
							...prev.equipment,
							[props.name]: {
								...prev.equipment[props.name],
								custom: Number(e.target.value.replace(',', '')),
							},
						},
				  }
				: {
						...prev,
						[props.name]: {
							...prev[props.name],
							custom: Number(e.target.value.replace(',', '')),
						},
				  }
		})
	}

	function handleEdit() {
		if (isEditable) {
			setIsEditable(false)

			props.setPrices((prev) => {
				return props.equipment
					? {
							...prev,
							equipment: {
								...prev.equipment,
								[props.name]: {
									...prev.equipment[props.name],
									custom: false,
								},
							},
					  }
					: {
							...prev,
							[props.name]: {
								...prev[props.name],
								custom: false,
							},
					  }
			})
		} else {
			setIsEditable(true)

			props.setPrices((prev) => {
				return props.equipment
					? {
							...prev,
							equipment: {
								...prev.equipment,
								[props.name]: {
									...prev.equipment[props.name],
									custom: prev.equipment[props.name].total,
								},
							},
					  }
					: {
							...prev,
							[props.name]: {
								...prev[props.name],
								custom: prev[props.name].total,
							},
					  }
			})
		}
	}

	return (
		<div className='flex flex-row'>
			<Input
				name={props.name}
				className={`${props.size === 'lg' ? 'w-[7rem]' : 'w-[6rem]'}`}
				size='sm'
				type=''
				classNames={{
					input: ['text-body-semibold', 'text-right'],
					inputWrapper: isEditable ? ['border-green-400 border-2'] : '',
				}}
				onChange={handleChange}
				readOnly={!isEditable}
				value={
					props.equipment
						? isEditable
							? props.prices.equipment[props.name].custom
							: toCurrency(props.prices.equipment[props.name].total, null, true)
						: isEditable
						? props.prices[props.name].custom
						: toCurrency(props.prices[props.name]?.total, null, true)
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
				<img src={isEditable ? '/assets/edit.svg' : '/assets/edit.svg'} alt='edit'/>
			</Button>
		</div>
	)
}
