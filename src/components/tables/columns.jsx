'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { useMemo } from 'react'

// Hook-based columns that use translations
export const useVehicleColumns = () => {
	const { t } = useLocale()
	return useMemo(() => [
		{
			key: 'number',
			label: t('table.id'),
		},
		{
			key: 'vehicle',
			label: t('common.name'),
		},
		{
			key: 'owner',
			label: t('forms.owner'),
		},
	], [t])
}

export const useOrderColumns = () => {
	const { t } = useLocale()
	return useMemo(() => [
		{
			key: 'number',
			label: t('table.id'),
		},
		{
			key: 'status',
			label: t('common.status'),
		},
		{
			key: 'pick_up_date',
			label: t('table.pickUp'),
		},
		{
			key: 'drop_off_date',
			label: t('table.dropOff'),
		},
		{
			key: 'num_days',
			label: t('table.totalDays'),
		},
		{
			key: 'vehicle',
			label: t('table.car'),
		},
		{
			key: 'client',
			label: t('client.client'),
		},
		{
			key: 'prices',
			label: t('table.amount'),
		},
		{
			key: 'actions_order',
			label: t('common.actions'),
		},
	], [t])
}

export const useClientColumns = () => {
	const { t } = useLocale()
	return useMemo(() => [
		{
			key: 'number',
			label: t('table.id'),
		},
		{
			key: 'full_name',
			label: t('common.name'),
		},
		{
			key: 'email',
			label: t('common.email')
		},
		{
			key: 'tel',
			label: t('common.phone')
		}
	], [t])
}

export const useOwnerColumns = () => {
	const { t } = useLocale()
	return useMemo(() => [
		{
			key: 'number',
			label: t('table.id'),
		},
		{
			key: 'name',
			label: t('common.name'),
		},
	], [t])
}

export const useGroupColumns = () => {
	const { t } = useLocale()
	return useMemo(() => [
		{
			key: 'name',
			label: t('common.name'),
		},
		{
			key: 'vehicles',
			label: t('table.vehicles'),
		},
		{
			key: 'actions',
			label: t('common.actions'),
		},
	], [t])
}

export const useInsuranceColumns = () => {
	const { t } = useLocale()
	return useMemo(() => [
		{
			key: 'name',
			label: t('common.name'),
		},
		{
			key: 'price_per_day',
			label: t('forms.price'),
		},
		{
			key: 'price_type',
			label: t('table.priceType'),
		},
		{
			key: 'deposit_amount',
			label: t('common.deposit'),
		},
		{
			key: 'deposit_excess',
			label: t('table.excess'),
		},
		{
			key: 'actions',
			label: t('common.actions'),
		},
	], [t])
}

export const useEquipmentColumns = () => {
	const { t } = useLocale()
	return useMemo(() => [
		{
			key: 'name',
			label: t('common.name'),
		},
		{
			key: 'price_per_day',
			label: t('forms.price'),
		},
		{
			key: 'price_type',
			label: t('table.priceType'),
		},
		{
			key: 'actions',
			label: t('common.actions'),
		},
	], [t])
}
