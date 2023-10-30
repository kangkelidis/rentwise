'use client'

import { Button } from '@nextui-org/button'
import Image from 'next/image'
import { useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@nextui-org/modal'
import { createSettings, updateSettings } from '@/lib/actions/settings.action'

import { useAuth } from "@clerk/nextjs";

export default function Signature({ field, form, clientSignature }) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	const { isLoaded, userId, sessionId, getToken } = useAuth();

	let sigCanvas = {}

	async function saveSignature() {
		const ts = sigCanvas?.getTrimmedCanvas().toDataURL('image/png')

		form.setValue(field.name, ts)
		onClose()
		// TODO: change to company
		if(!clientSignature) {
			await updateSettings(userId, {[field.name]: ts})
		}
	}

	return (
		<div>
			<Button onPress={onOpen}>Edit Signature</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<div>
							<ModalHeader className=''>
								Signature
							</ModalHeader>
							<ModalBody>
								<div className='w-[500px] h-[200px]'>
									<SignatureCanvas
										penColor='blue'
										canvasProps={{ className: 'absolute w-full h-full' }}
										backgroundColor='rgba(200,200,200, 0)'
										ref={(ref) => {
											sigCanvas = ref
										}}
										
									/>
									<Button onClick={() => sigCanvas?.clear()}>clear</Button>
									<Button onClick={saveSignature}>save</Button>

	
								</div>
							</ModalBody>
							<ModalFooter></ModalFooter>
						</div>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}
