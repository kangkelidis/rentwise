'use client'

import { ClientForm } from '@/components/forms/ClientForm'
import TableUI from '@/components/tables/table'
import { DEFAULT_LIMIT } from '@/constants'
import { useLocale } from '@/contexts/LocaleContext'
import { useOrderColumns } from '@/components/tables/columns'

export default function ClientDetailsPageContent( { data }) {

	const {t} = useLocale()
	const columns = useOrderColumns()

	return (
		<div className='flex flex-col gap-4'>
			<h2 className='head-text'>{t('client.editClient')}</h2>

			<div>
				<ClientForm data={data.client} />
			</div>

			<div>
				<TableUI
					title={t('client.orderHistory')}
					rowsPerPage={DEFAULT_LIMIT / 2}
					data={data.orders}
					columns={columns}
				/>
			</div>
		</div>
	)
}
