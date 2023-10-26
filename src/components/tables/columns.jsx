'use client'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const vehicleColumns = [
	{
		key: 'number',
		label: 'Id',
	},
	{
		key: 'vehicle',
		label: 'Vehicle',
	},
	{
		key: 'owner',
		label: 'Owner',
	},
]

export const orderColumns = [
	{
		key: 'number',
		label: 'ID',
	},
	{
		key: 'pick_up_date',
		label: 'Pick Up',
	},
	{
		key: 'drop_off_date',
		label: 'Drop off',
	},
	{
		key: 'num_days',
		label: 'Total Days',
	},
	{
		key: 'vehicle',
		label: 'Car',
	},
	{
		key: 'client',
		label: 'Client',
	},
	{
		key: 'price_per_day',
		label: 'Amount',
	},
]

export const clientColumns = [
	{
		key: 'number',
		label: 'ID',
	},
	{
		key: 'full_name',
		label: 'Name',
	},
]

export const ownerColumns = [
	{
		key: 'number',
		label: 'Id',
	},
	{
		key: 'name',
		label: 'Name',
	},
]

export const groupColumns = [
	{
		key: 'name',
		label: 'Name',
	},
	{
		key: 'vehicles',
		label: 'Vehicles',
	},
	{
		key: 'actions',
		label: 'Actions',
	},
]

export const insuranceColumns = [
	{
		key: 'name',
		label: 'Name',
	},
	{
		key: 'price_per_day',
		label: 'Price',
	},
	{
		key: 'price_type',
		label: 'Price Type',
	},
	{
		key: 'deposit_amount',
		label: 'Deposit',
	},
	{
		key: 'deposit_excess',
		label: 'Excess',
	},
	{
		key: 'actions',
		label: 'Actions',
	},
]

export const equipmentColumns = [
	{
		key: 'name',
		label: 'Name',
	},
	{
		key: 'price_per_day',
		label: 'Price',
	},
	{
		key: 'price_type',
		label: 'Price Type',
	},
	{
		key: 'actions',
		label: 'Actions',
	},
]