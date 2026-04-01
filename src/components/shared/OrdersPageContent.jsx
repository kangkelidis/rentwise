'use client'

import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useOrderColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'
import UploadCSVFile from '@/components/shared/UploadCSVFile'
import SearchInput from '@/components/shared/SearchInput'

export default function OrdersPageContent({ data, createFromCSV }) {
    const { t } = useLocale()
    const orderColumns = useOrderColumns()

    return (
        <div className=''>
            <div className='flex place-content-between mb-3 items-baseline'>
                <h2 className='head-text'>{t('nav.orders')}</h2>
                <Button color='secondary' className=''>
                    <Link href={'/orders/create'}>{t('order.addOrder')}</Link>
                </Button>
            </div>
            <SearchInput />
            <TableUI columns={orderColumns} data={data} />

            <UploadCSVFile action={createFromCSV} />
        </div>
    )
}
