'use client'

import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import UploadCSVFile from '@/components/shared/UploadCSVFile'
import FleetTabs from '@/components/shared/FleetTabs'

export default function FleetPageContent({ vehicleData, createFromCSV }) {
    const { t } = useLocale()

    return (
        <div className=''>
            <div className='flex place-content-between mb-3 items-baseline'>
                <h2 className='head-text'>{t('nav.fleet')}</h2>
                <Button color='secondary' className='mb-4'>
                    <Link href={'/fleet/create'}>{t('vehicle.addVehicle')}</Link>
                </Button>
            </div>

            {/* Pass only the vehicle data. The tabs component will fetch its own stats. */}
            <FleetTabs vehicleData={vehicleData} />

            <UploadCSVFile action={createFromCSV}/>
        </div>
    )
}
