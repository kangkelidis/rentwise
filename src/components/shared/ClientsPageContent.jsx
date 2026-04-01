'use client'

import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useClientColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'
import UploadCSVFile from '@/components/shared/UploadCSVFile'
import SearchInput from '@/components/shared/SearchInput'

export default function ClientsPageContent({ data, createFromCSV }) {
    const { t } = useLocale()
    const clientColumns = useClientColumns()

    return (
        <div className=''>
            <div className='flex place-content-between mb-3 items-baseline'>
                <h2 className='head-text'>{t('nav.clients')}</h2>
                <Button color='secondary' className='mb-4'>
                    <Link href={'/clients/create'}>{t('client.addClient')}</Link>
                </Button>
            </div>
            <SearchInput />
                <TableUI columns={clientColumns} data={data} />
            <UploadCSVFile action={createFromCSV} />
        </div>
    )
}
