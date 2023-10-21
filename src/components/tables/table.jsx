'use client'

import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
    getKeyValue,
	Spinner,
	Pagination
} from '@nextui-org/react'
import useSWR from "swr";

import { Button } from '@nextui-org/button';

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {useAsyncList} from "@react-stately/data";
import { useCallback, useState, useMemo } from 'react';
import VehicleDetails from '../elements/vehicle-details';

export default function TableUI({ columns, data, count, selectionMode='single' }) {
	const [isLoading, setIsLoading] = useState(true);
	const [selectedKeys, setSelectedKeys] = useState(new Set([]));

	const [page, setPage] = useState(1);

    const router = useRouter()
    const pathname = usePathname()
	const searchParams = useSearchParams()


	const rowsPerPage = 1;
	const pages = count ? Math.ceil(count /rowsPerPage ) : 0

	// Get a new searchParams string by merging the current
  	// searchParams with a provided key/value pair
  	const createQueryString = useCallback(
		(name, value) => {
		const params = new URLSearchParams(searchParams)
		params.set(name, value)
	
		return params.toString()
		},
		[searchParams]
	)

	function onChangePage(page) {
		router.push(pathname + '?' + createQueryString('page', page))
		setPage(page)
	}

	  
	const bottomContent = useMemo(() => {
		return (
		  <div className="py-2 px-2 flex justify-between items-center">
			{
				selectionMode === 'multiple' &&
				<span className="w-[30%] text-small text-default-400">
				{selectedKeys === "all"
					? "All items selected"
					: `${selectedKeys.size} of ${count.length} selected`}
				</span>
			}
			<Pagination
			  isCompact
			  showControls
			  showShadow
			  color="primary"
			  page={page}
			  total={pages}
			  onChange={(page) => onChangePage(page)}
			/>
		  </div>
		);
	  }, [selectedKeys, page, pages]);

	  // find a way to make this work for all
	  const renderCell = useCallback((vehicle, columnKey) => {
		const cellValue = vehicle[columnKey];
	
		switch (columnKey) {
		  case "vehicle":
			return (
			  <VehicleDetails
				vehicle={vehicle}
			  >

			  </VehicleDetails>
			);
		  
		  default:
			return cellValue;
		}
	  }, []);


	return (
		<Table isStriped selectionMode={selectionMode} aria-label="Table with data"
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
            >
			<TableHeader columns={columns}>
				{(column) => <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>}
			</TableHeader>
			<TableBody emptyContent={"No rows to display."} items={data}>
				{(item) => (
					<TableRow key={item.key}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}
