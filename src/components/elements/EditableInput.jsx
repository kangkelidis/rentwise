'use client'

import { changeSingleStateValue, toCurrency } from '@/lib/utils'
import { Input } from '@nextui-org/input'
import { Tooltip } from '@nextui-org/tooltip'

// TODO: validate input to avoid NaN
export default function EditableInput(props) {
    function handleChange(e) {
        changeSingleStateValue(props.setCustomPrice, props.name, Number(e.target.value))
    }

    function handleClear() {
        if (props.isCustom[props.name]) {
            changeSingleStateValue(props.setIsCustom, props.name, false)
            changeSingleStateValue(props.setCustomPrice, props.name, props.defaultPrice[props.name])
        }
						
    }
	return (
		<Tooltip
			content={
				props.isCustom[props.name] ? 'Press x to reset' : 'Double Click to Edit'
			}
		>
			<Input
				name={props.name}
				className={`${props.size === 'lg' ? 'w-[7rem]' : 'w-[6rem]'}`}
                size='sm'
				type=''
				classNames={{
					input: ['text-body-semibold', 'text-right'],
					inputWrapper: props.isCustom[props.name]
						? ['border-green-400 border-2']
						: '' ,
				}}
				onChange={handleChange}
				readOnly={!props.isCustom[props.name]}
				onDoubleClick={() =>
					changeSingleStateValue(props.setIsCustom, props.name, true)
				}
				value={
					props.isCustom[props.name]
						? props.customPrice[props.name] 
						: toCurrency(props.defaultPrice[props.name], null, true)
				}
				isClearable={props.isCustom[props.name]}
				onClear={handleClear}
				startContent={
					<div className='pointer-events-none flex items-center'>
						<span className='text-default-400 text-small'>€</span>
					</div>
				}
			></Input>
		</Tooltip>
	)
}
