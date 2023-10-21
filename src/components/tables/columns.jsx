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
]

export const orderColumns = [
	{
		key: 'id',
		label: 'ID',
	},
	{
		key: 'pickup',
		label: 'Pick Up Date',
	},
	{
		key: 'dropoff',
		label: 'Drop of Date',
	},
	{
		key: 'vehicle',
		label: 'Car',
	},
	{
		key: 'client',
		label: 'Client',
	},
]

export const clientColumns = [
	{
		key: 'id',
		label: 'ID',
	},
	{
		key: 'name',
		label: 'Name',
	},
]

export const ownerColumns = [
	{
		key: 'code',
		label: 'Id',
	},
	{
		key: 'name',
		label: 'Name',
	},
]
