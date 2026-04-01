'use client'

import { useLocale } from '@/contexts/LocaleContext'

// Helper component for translating array options
export function TranslatedSelectItems({ items, translationKey, valueKey = 'id', nameKey = 'name' }) {
  const { t } = useLocale()

  return items.map((item) => (
    <SelectItem key={item[valueKey] || item} value={item[valueKey] || item}>
      {translationKey ? t(`${translationKey}.${item[nameKey] || item}`) : (item[nameKey] || item)}
    </SelectItem>
  ))
}

// Hook for getting translated options
export function useTranslatedOptions() {
  const { t } = useLocale()

  const getTransmissionOptions = () => [
    { value: 'automatic', label: t('vehicle.automatic') },
    { value: 'manual', label: t('vehicle.manual') }
  ]

  const getStatusOptions = () => [
    { value: 'available', label: t('vehicle.available') },
    { value: 'rented', label: t('vehicle.rented') },
    { value: 'maintenance', label: t('vehicle.maintenance') }
  ]

  const getOrderStatusOptions = () => [
    { value: 'pending', label: t('order.pending') },
    { value: 'confirmed', label: t('order.confirmed') },
    { value: 'inProgress', label: t('order.inProgress') },
    { value: 'completed', label: t('order.completed') },
    { value: 'cancelled', label: t('order.cancelled') }
  ]

  return {
    getTransmissionOptions,
    getStatusOptions,
    getOrderStatusOptions
  }
}
