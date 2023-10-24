'use client'

import SignatureCanvas from 'react-signature-canvas'


export default function Signature(props) {
    

    return (
        <>
            <SignatureCanvas penColor='blue'
canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} backgroundColor='rgba(200,200,200, 100)' />
        </>
    )
}
