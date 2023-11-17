'use client'

import { CldUploadButton } from 'next-cloudinary'

export default function Upload({
	setPhotos,
	form,
	fieldName,
	preset,
	multiple,
}) {
	function handleUpload(event) {
		if (event.event === 'success') {
			if (setPhotos) {
				setPhotos((prev) => [...prev, event.info.public_id])
			}
			if (form) {
				form.setValue(
					fieldName,
					multiple
						? [...form.watch(fieldName), event.info.public_id]
						: event.info.public_id
				)
			}
		}
	}

	return (
		<>
			<CldUploadButton
				className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2'
				onUpload={handleUpload}
				uploadPreset={preset}
			/>
		</>
	)
}
