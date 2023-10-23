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
		label: 'Pick Up Date',
	},
	{
		key: 'drop_off_date',
		label: 'Drop of Date',
	},
	{
		key: 'num_days',
		label: 'Total Days',
	},
	{
		key: 'vehicle_id',
		label: 'Car',
	},
	{
		key: 'client_id',
		label: 'Client',
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
