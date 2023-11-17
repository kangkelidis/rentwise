'use client'

import { Button } from '../ui/button'
import { printAgreement } from '@/lib/pdf/agreement'

export default function Agreement({ settings, order, prices }) {
	const baseURL =
		'https://res.cloudinary.com/dgxlyrprq/image/upload/v1700227330/'

	function toDataURL(src, callback) {
		var image = new Image()
		image.crossOrigin = 'Anonymous'
		image.onload = function () {
			var canvas = document.createElement('canvas')
			var context = canvas.getContext('2d')
			canvas.height = this.naturalHeight
			canvas.width = this.naturalWidth
			context.drawImage(this, 0, 0)
			const dataURL = canvas.toDataURL('image/png')
			callback(dataURL)
		}
		image.src = src
	}
	function handleClick() {
		toDataURL(baseURL + settings.company.logo + '.png', function (dataURL) {
			const logoImgData = dataURL
			printAgreement(settings, order, prices, logoImgData)
		})
		
	}
	return (
		<>
			<Button
				type='button'
				onClick={handleClick}
			>
				Print Agreement
			</Button>
		</>
	)
}
