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

export default function Signature({ field, form }) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	const { isLoaded, userId, sessionId, getToken } = useAuth();

	let sigCanvas = {}
	const [trimmedSignature, setTrimmedSignature] = useState()

	async function saveSignature() {
		const signature = sigCanvas?.getTrimmedCanvas().toDataURL('image/png')

		form.setValue(field.name, signature)
		onClose()
		await updateSettings(userId, {[field.name]: signature})
	}

	return (
		<div>
			<Button onPress={onOpen}>Edit Signature</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<div>
							{/* <ModalHeader className='flex flex-col gap-1'>
								Modal Title
							</ModalHeader> */}
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

									{trimmedSignature && (
										<Image
											width={100}
											height={100}
											alt='sign'
											src={trimmedSignature}
										/>
									)}
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
