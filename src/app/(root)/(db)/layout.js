export default function DBLayout({ children }) {
	return (
		<div className=''>
			<div className='flex place-content-between mb-3 items-baseline'>
				<h2 className='head-text'>Orders</h2>
				<Button color='secondary' className=''>
					<Link href={'/orders/create'}>Add Order</Link>
				</Button>
			</div>
			<TableUI columns={orderColumns} data={data} />
		</div>
	)
}

// USE layout to avoid duplicate code
