'use client'

import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useOwnerColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'

export default function OwnersPageContent({ data }) {
    const { t } = useLocale()
    const ownerColumns = useOwnerColumns()

    return (
        <div className=''>
            <div className='flex place-content-between mb-3 items-baseline'>
                <h2 className='head-text'>{t('nav.owners')}</h2>
                <Button color='secondary' className='mb-4'>
                    <Link href={'/owners/create'}>{t('owner.addOwner')}</Link>
                </Button>
            </div>
            <TableUI columns={ownerColumns} data={data} />
        </div>
    )
}
