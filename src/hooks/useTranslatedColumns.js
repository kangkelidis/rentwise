'use client'

import { useMemo } from 'react'
import { useLocale } from '@/contexts/LocaleContext'

const useTranslatedColumns = (key) => {
    const { t } = useLocale()

    const columnsConfig = useMemo(() => ({
        vehicles: [
            { key: 'number', label: t('table.id') },
            { key: 'vehicle', label: t('common.name') },
            { key: 'owner', label: t('forms.owner') },
        ],
        orders: [
            { key: 'number', label: t('table.id') },
            { key: 'status', label: t('common.status') },
            { key: 'pick_up_date', label: t('table.pickUp') },
            { key: 'drop_off_date', label: t('table.dropOff') },
            { key: 'num_days', label: t('table.totalDays') },
            { key: 'vehicle', label: t('table.car') },
            { key: 'client', label: t('client.client') },
            { key: 'prices', label: t('table.amount') },
            { key: 'actions_order', label: t('common.actions') },
        ],
        clients: [
            { key: 'number', label: t('table.id') },
            { key: 'full_name', label: t('common.name') },
            { key: 'email', label: t('common.email') },
            { key: 'tel', label: t('common.phone') }
        ],
        owners: [
            { key: 'number', label: t('table.id') },
            { key: 'name', label: t('common.name') },
        ],
        groups: [
            { key: 'name', label: t('common.name') },
            { key: 'vehicles', label: t('table.vehicles') },
            { key: 'actions', label: t('common.actions') },
        ],
        insurance: [
            { key: 'name', label: t('common.name') },
            { key: 'price_per_day', label: t('forms.price') },
            { key: 'price_type', label: t('table.priceType') },
            { key: 'deposit_amount', label: t('common.deposit') },
            { key: 'deposit_excess', label: t('table.excess') },
            { key: 'actions', label: t('common.actions') },
        ],
        equipment: [
            { key: 'name', label: t('common.name') },
            { key: 'price_per_day', label: t('forms.price') },
            { key: 'price_type', label: t('table.priceType') },
            { key: 'actions', label: t('common.actions') },
        ],
    }), [t])

    return columnsConfig[key] || []
}

export default useTranslatedColumns
