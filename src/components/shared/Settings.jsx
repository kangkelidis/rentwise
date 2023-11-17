'use client'

import { Tabs, Tab } from '@nextui-org/tabs'
import { useState } from 'react'
import { SettingsForm } from '@/components/forms/SettingsForm'
import TableUI from '@/components/tables/table'
import GroupForm from '@/components/forms/GroupForm'
import EquipmentForm from '@/components/forms/EquipmentForm'
import InsuranceForm from '@/components/forms/InsuranceForm'
import {
	equipmentColumns,
	groupColumns,
	insuranceColumns,
} from '@/components/tables/columns'
import { RentalsForm } from '../forms/RentalsForm'
import { Card, CardHeader } from '@nextui-org/react'

export default function Settings({ data }) {
	data = JSON.parse(data)
	const [selected, setSelected] = useState('rentals')

	return (
		<div>
			<div>
				<Tabs
					aria-label='Settings'
					selectedKey={selected}
					onSelectionChange={setSelected}
				>

					<Tab key='rentals' title='Rental'>
						<Card className='container p-4 flex gap-5'>
							<Card className='container p-4 flex gap-5'>
								<CardHeader>Groups</CardHeader>
								<GroupForm group={data.group} />
								<TableUI
									columns={groupColumns}
									data={{ items: data.newGroups }}
								/>
							</Card>
							<RentalsForm data={data.data.settings}/>
						</Card>
					</Tab>

					<Tab key='extras' title='Extras'>
						<div>
							<EquipmentForm equipment={data.equipment} />
							<TableUI
								columns={equipmentColumns}
								data={{ items: data.data.equipment }}
							/>

							<InsuranceForm insurance={data.insurance} />
							<TableUI
								columns={insuranceColumns}
								data={{ items: data.data.insurance }}
							/>
						</div>
					</Tab>

					<Tab key='company' title='Company'>
						<div>
							<SettingsForm data={data.data.settings} />
						</div>
					</Tab>
				</Tabs>
			</div>
		</div>
	)
}
