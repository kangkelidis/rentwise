import { cn } from '@nextui-org/react'
import StatusChip from './StatusChip'
import { STATUS } from '@/constants'

export const StatusRadio = (props) => {
	const { children, ...otherProps } = props
	const form = props.form
	const currentStatusIndex = STATUS.indexOf(props.field.value)
	const childIndex = STATUS.indexOf(children)

	function onClick() {
    if(currentStatusIndex === STATUS.length -1) return
		form.setValue('status', STATUS[currentStatusIndex + 1])
	}

	return (
		<button
			{...otherProps}
			onClick={onClick}
			className={`${
				children === props.field.value && 'border-primary-600 bg-primary-100 !opacity-100'
			} ${
				currentStatusIndex > childIndex &&
				'rounded-none bg-primary-100 !opacity-50 hover:bg-primary-50'
			} mt-2 disabled:opacity-10 opacity-80 disabled:cursor-not-allowed hover:bg-content2 px-4 py-2 w-full cursor-pointer rounded-lg border-3 border-transparent`}
			disabled={
				childIndex - currentStatusIndex > 1 || currentStatusIndex > childIndex || childIndex === STATUS.length-1
			}
		>
			<StatusChip status={children}></StatusChip>
		</button>
	)
}
