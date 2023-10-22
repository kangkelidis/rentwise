'use client'

import { CldUploadButton } from 'next-cloudinary';
 
export default function Upload({ setPhotos }) {
    
    function handleUpload(event) {
        if (event.event === 'success') {
            setPhotos(prev => ([...prev, event.info.public_id]))
        }
    }

    return (
        <>
            <CldUploadButton
                onUpload={handleUpload}
                uploadPreset="uflrmx00" />
        </>
    )
}
