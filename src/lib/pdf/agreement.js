import * as jsPDF from 'jspdf'
import { hasCustomPrice, toCurrency, zeroPad } from '../utils.js'

const doc = new jsPDF.jsPDF()

const PAGE_MARGIN = 10
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297

const TITLE_HEIGHT = 2
const HEADER_Y = 15
const VEHICLE_Y = 40

const LOGO_SCALE = 1.2
const LOGO_SIZE = [17.4 * LOGO_SCALE, 15.4 * LOGO_SCALE]
const CAR_BOX_WIDTH = 65
const CAR_SIZE = [51, 38]
const VEHICLE_COL_WIDTH = (PAGE_WIDTH - 2 * PAGE_MARGIN - CAR_BOX_WIDTH) / 3
const COL_WIDTH = (PAGE_WIDTH - 2 * PAGE_MARGIN) / 3
const CELL_HEIGHT = 8

const SPACING = 3.5
const LINE_SPACE = 2.7

function printTitle(number) {
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(13)
	doc.text(
		`CAR HIRE AGREEMENT No: ${zeroPad(number, 3)}`,
		PAGE_WIDTH - PAGE_MARGIN,
		PAGE_MARGIN,
		null,
		null,
		'right'
	)
}

function printHeader(company, logoImgData) {
	
	// let file = require('../../../public/assets/company/logo.js')
	// doc.addImage(file.logo, "png", PAGE_MARGIN, HEADER_Y, LOGO_SIZE[0], LOGO_SIZE[1], null, 'NONE');
	doc.addImage(logoImgData, "png", PAGE_MARGIN, HEADER_Y, LOGO_SIZE[0], LOGO_SIZE[1], null, 'NONE');
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(13)

	let yPos = HEADER_Y + SPACING
	let xPos = PAGE_MARGIN + LOGO_SIZE[0] + SPACING
	doc.text(company.name, xPos, yPos)
	yPos += LINE_SPACE * 1.5
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(7)
	doc.text(company.slogan, xPos, yPos)
	yPos += LINE_SPACE * 2
	doc.text(company.address.line1, xPos, yPos)
	yPos += LINE_SPACE
	doc.text(company.address.line2, xPos, yPos)
	yPos += LINE_SPACE
	doc.text(`VAT no : ${company.vat}`, xPos, yPos)

	yPos = HEADER_Y + LOGO_SIZE[1] - LINE_SPACE * 2
	xPos = PAGE_WIDTH - PAGE_MARGIN
	doc.text(`Tel: ${company.tel}`, xPos, yPos, null, null, 'right')
	yPos += LINE_SPACE
	doc.text(`Email: ${company.email}`, xPos, yPos, null, null, 'right')
	yPos += LINE_SPACE
	doc.text(`Website: ${company.website}`, xPos, yPos, null, null, 'right')

	// yPos = HEADER_Y + SPACING
	// xPos = PAGE_WIDTH - PAGE_MARGIN
	// doc.setFontSize(9);
	// doc.text(`Date: ${new Date().toLocaleDateString()}`, xPos, yPos, null, null, 'right')
}

function printVehicleInfo(order) {
	const vehicle = order.vehicle

	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.setLineWidth(0.1)
	doc.text('VEHICLE', PAGE_MARGIN, VEHICLE_Y)
	doc.line(
		PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE,
		PAGE_WIDTH - PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE
	)

	let xPos = PAGE_MARGIN
	let yPos = VEHICLE_Y + LINE_SPACE
	doc.line(xPos, yPos, xPos, yPos + 5 * CELL_HEIGHT)
	doc.line(
		PAGE_WIDTH - PAGE_MARGIN,
		yPos,
		PAGE_WIDTH - PAGE_MARGIN,
		yPos + 5 * CELL_HEIGHT
	)

	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	yPos = VEHICLE_Y + 2 * LINE_SPACE
	doc.text('MAKE', xPos + 1, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('REGISTRATION NUMBER', xPos + 1, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('VEHICLE GROUP', xPos + 1, yPos)
	xPos = PAGE_MARGIN + 1
	yPos += LINE_SPACE + 1.5
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(vehicle.make, xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.line(
		xPos - 1,
		VEHICLE_Y + LINE_SPACE,
		xPos - 1,
		VEHICLE_Y + LINE_SPACE + 5 * CELL_HEIGHT
	)
	doc.text(vehicle.registration, xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.line(
		xPos - 1,
		VEHICLE_Y + LINE_SPACE,
		xPos - 1,
		VEHICLE_Y + LINE_SPACE + 5 * CELL_HEIGHT
	)
	if (vehicle.group) {
		doc.text(vehicle.group.name, xPos, yPos)
	}
	xPos += VEHICLE_COL_WIDTH
	doc.line(
		xPos - 1,
		VEHICLE_Y + LINE_SPACE,
		xPos - 1,
		VEHICLE_Y + LINE_SPACE + 5 * CELL_HEIGHT
	)

	xPos = PAGE_MARGIN + 1
	yPos = VEHICLE_Y + CELL_HEIGHT + LINE_SPACE * 2
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	doc.text('MODEL', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('YEAR', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('COLOR', xPos, yPos)
	yPos += LINE_SPACE * 1.5
	xPos = PAGE_MARGIN + 1
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(vehicle.model, xPos, yPos)
	doc.line(
		PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + CELL_HEIGHT,
		VEHICLE_COL_WIDTH * 3 + PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + CELL_HEIGHT
	)
	xPos += VEHICLE_COL_WIDTH
	doc.text(String(vehicle.year), xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	if (vehicle.color) {
		doc.text(vehicle.color, xPos, yPos)
	}
	doc.line(
		PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + 2 * CELL_HEIGHT,
		VEHICLE_COL_WIDTH * 3 + PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + 2 * CELL_HEIGHT
	)

	xPos = PAGE_MARGIN + 1
	yPos = VEHICLE_Y + 2 * CELL_HEIGHT + LINE_SPACE * 2
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	doc.text('ODOMETER', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('FUEL TYPE', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('AMOUNT OF FUEL', xPos, yPos)
	yPos += LINE_SPACE * 1.5
	xPos = PAGE_MARGIN + 1
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(String(vehicle.odometer), xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	if (vehicle.fuel_type){
		doc.text(vehicle.fuel_type, xPos, yPos)
	}
	xPos += VEHICLE_COL_WIDTH
	doc.text(`${vehicle.fuel_amount} %`, xPos, yPos)
	doc.line(
		PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + 3 * CELL_HEIGHT,
		VEHICLE_COL_WIDTH * 3 + PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + 3 * CELL_HEIGHT
	)

	xPos = PAGE_MARGIN + 1
	yPos = VEHICLE_Y + 3 * CELL_HEIGHT + LINE_SPACE * 2
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	doc.text('PICKUP DATE', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('PICKUP LOCATION', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('PICKUP TIME', xPos, yPos)
	yPos += LINE_SPACE * 1.5
	xPos = PAGE_MARGIN + 1
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(new Date(order.pick_up_date).toLocaleDateString('en-GB'), xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text(order.pick_up_location || '', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text(new Date(order.pick_up_date).toLocaleTimeString('en-GB'), xPos, yPos)
	doc.line(
		PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + 4 * CELL_HEIGHT,
		VEHICLE_COL_WIDTH * 3 + PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + 4 * CELL_HEIGHT
	)

	xPos = PAGE_MARGIN + 1
	yPos = VEHICLE_Y + 4 * CELL_HEIGHT + LINE_SPACE * 2
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	doc.text('RETURN DATE', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('RETURN LOCATION', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text('RETURN TIME', xPos, yPos)
	yPos += LINE_SPACE * 1.5
	xPos = PAGE_MARGIN + 1
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(
		new Date(order.drop_off_date).toLocaleDateString('en-GB'),
		xPos,
		yPos
	)
	xPos += VEHICLE_COL_WIDTH
	doc.text(order.drop_off_location || '', xPos, yPos)
	xPos += VEHICLE_COL_WIDTH
	doc.text(
		new Date(order.drop_off_date).toLocaleTimeString('en-GB'),
		xPos,
		yPos
	)
	doc.line(
		PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + 5 * CELL_HEIGHT,
		PAGE_WIDTH - PAGE_MARGIN,
		VEHICLE_Y + LINE_SPACE + 5 * CELL_HEIGHT
	)

	const carBoxCenterX = PAGE_WIDTH - PAGE_MARGIN - CAR_BOX_WIDTH / 2
	const carBoxCenterY = VEHICLE_Y + LINE_SPACE + (5 * CELL_HEIGHT) / 2
	xPos = carBoxCenterX - CAR_SIZE[0] / 2
	yPos = carBoxCenterY - CAR_SIZE[1] / 2
	let car = require('../../../public/assets/car-damages.js')
	doc.addImage(car.image, 'png', xPos, yPos, CAR_SIZE[0], CAR_SIZE[1])

	return VEHICLE_Y + LINE_SPACE + 5 * CELL_HEIGHT
}

function printDriver(yPos, client, drivers) {
	let xPos = PAGE_MARGIN
	yPos = yPos + 3 * LINE_SPACE

	const TOP_LINE = yPos + LINE_SPACE

	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.setLineWidth(0.1)
	doc.text('DRIVER 1 / HIRER', PAGE_MARGIN, yPos)
	doc.line(PAGE_MARGIN, TOP_LINE, PAGE_WIDTH - PAGE_MARGIN, TOP_LINE)

	yPos = yPos + LINE_SPACE
	doc.line(xPos, yPos, xPos, yPos + 3 * CELL_HEIGHT)
	doc.line(
		PAGE_WIDTH - PAGE_MARGIN,
		yPos,
		PAGE_WIDTH - PAGE_MARGIN,
		yPos + 3 * CELL_HEIGHT
	)

	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	yPos = yPos + LINE_SPACE
	doc.text('CLIENT NAME', xPos + 1, yPos)
	xPos += COL_WIDTH
	// doc.text('LAST NAME', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('DATE OF BIRTH', xPos + 1, yPos)
	xPos = PAGE_MARGIN + 1
	yPos += LINE_SPACE + 1.5
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(client.full_name, xPos, yPos)
	xPos += COL_WIDTH
	doc.line(xPos - 1, TOP_LINE+CELL_HEIGHT, xPos - 1, TOP_LINE + 3 * CELL_HEIGHT)
	// doc.text(client.last_name, xPos, yPos)
	xPos += COL_WIDTH
	doc.line(xPos - 1, TOP_LINE, xPos - 1, TOP_LINE + 2 * CELL_HEIGHT)
	doc.text(
		client.dob ? new Date(client.dob).toLocaleDateString() : '',
		xPos,
		yPos
	)
	doc.line(
		PAGE_MARGIN,
		TOP_LINE + CELL_HEIGHT,
		COL_WIDTH * 3 + PAGE_MARGIN,
		TOP_LINE + CELL_HEIGHT
	)

	yPos = TOP_LINE + CELL_HEIGHT
	xPos = PAGE_MARGIN
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	yPos = yPos + LINE_SPACE
	doc.text('PHONE NO', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('EMAIL', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('DRIVING LICENSE', xPos + 1, yPos)
	xPos = PAGE_MARGIN + 1
	yPos += LINE_SPACE + 1.5
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(client.tel ? client.tel : '', xPos, yPos)
	xPos += COL_WIDTH
	doc.text(client.email || '', xPos, yPos)
	xPos += COL_WIDTH
	doc.text(client.license || '', xPos, yPos)
	xPos += COL_WIDTH
	doc.line(
		PAGE_MARGIN,
		TOP_LINE + 2 * CELL_HEIGHT,
		COL_WIDTH * 3 + PAGE_MARGIN,
		TOP_LINE + 2 * CELL_HEIGHT
	)

	yPos = TOP_LINE + 2 * CELL_HEIGHT
	xPos = PAGE_MARGIN
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	yPos = yPos + LINE_SPACE
	doc.text('ID/PASSPORT', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('ADDRESS', xPos + 1, yPos)
	xPos += COL_WIDTH
	xPos = PAGE_MARGIN + 1
	yPos += LINE_SPACE + 1.5
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(
		`${client.nationality || ''} | ${
			client.identification ? client.identification : client.passport || ''
		}`,
		xPos,
		yPos
	)
	xPos += COL_WIDTH
	doc.text(client.address || '', xPos, yPos)
	doc.line(
		PAGE_MARGIN,
		TOP_LINE + 3 * CELL_HEIGHT,
		COL_WIDTH * 3 + PAGE_MARGIN,
		TOP_LINE + 3 * CELL_HEIGHT
	)
	yPos = TOP_LINE + 3 * CELL_HEIGHT

	if (drivers.length > 0) {
		yPos += 3 * LINE_SPACE
		xPos = PAGE_MARGIN
		const topLine = yPos + LINE_SPACE

		doc.setFont('Helvetica', 'bold')
		doc.setFontSize(11)
		doc.setLineWidth(0.1)

		doc.text(`EXTRA DRIVER${drivers.length > 1 ? 'S' : ''}`, PAGE_MARGIN, yPos)

		let i = 0
		drivers.forEach((driver) => {
			yPos = topLine + LINE_SPACE + CELL_HEIGHT * i
			//top horizontal line
			doc.line(
				PAGE_MARGIN,
				topLine + CELL_HEIGHT * i,
				PAGE_WIDTH - PAGE_MARGIN,
				topLine + CELL_HEIGHT * i
			)
			//bottom horizontal line
			doc.line(
				PAGE_MARGIN,
				topLine + CELL_HEIGHT * i + CELL_HEIGHT,
				PAGE_WIDTH - PAGE_MARGIN,
				topLine + CELL_HEIGHT * i + CELL_HEIGHT
			)

			doc.setFont('Helvetica', 'normal')
			doc.setFontSize(5)
			doc.text('FULL NAME', xPos + 1, yPos)
			xPos += COL_WIDTH
			xPos += COL_WIDTH
			doc.line(
				PAGE_MARGIN,
				topLine + CELL_HEIGHT * i,
				PAGE_MARGIN,
				topLine + CELL_HEIGHT * i + CELL_HEIGHT
			)

			doc.text('DRIVING LICENSE', xPos + 1, yPos)
			doc.line(
				xPos,
				topLine + CELL_HEIGHT * i,
				xPos,
				topLine + CELL_HEIGHT * i + CELL_HEIGHT
			)
			doc.line(
				PAGE_WIDTH - PAGE_MARGIN,
				topLine + CELL_HEIGHT * i,
				PAGE_WIDTH - PAGE_MARGIN,
				topLine + CELL_HEIGHT * i + CELL_HEIGHT
			)

			xPos = PAGE_MARGIN + 1
			yPos += LINE_SPACE + 1.5
			doc.setFont('Helvetica', 'bold')
			doc.setFontSize(11)
			doc.text(driver.full_name, xPos, yPos)
			xPos += COL_WIDTH
			xPos += COL_WIDTH
			doc.text(driver.license, xPos, yPos)
			xPos += COL_WIDTH

			i += 1
			xPos = PAGE_MARGIN
		})
	}

	return yPos
}

function printTotal(yPos, order, totals, prices) {
	let xPos = PAGE_MARGIN
	yPos = yPos + 3 * LINE_SPACE

	const TOP_LINE = yPos + LINE_SPACE

	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.setLineWidth(0.1)
	doc.text('TOTAL', PAGE_MARGIN, yPos)
	doc.line(PAGE_MARGIN, TOP_LINE, PAGE_WIDTH - PAGE_MARGIN, TOP_LINE)

	yPos = yPos + LINE_SPACE

	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	yPos = yPos + LINE_SPACE
	doc.text('RENTAL PERIOD', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('PRICE PER DAY', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('TOTAL', xPos + 1, yPos)
	xPos = PAGE_MARGIN + 1
	yPos += LINE_SPACE + 1.5
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(`${order.num_days} DAYS`, xPos, yPos)
	xPos += COL_WIDTH
	doc.text(toCurrency(totals.vehicle / order.num_days), xPos, yPos)
	xPos += COL_WIDTH
	doc.text(toCurrency(totals.vehicle), xPos, yPos)
	xPos += COL_WIDTH
	doc.line(
		PAGE_MARGIN,
		TOP_LINE + CELL_HEIGHT,
		COL_WIDTH * 3 + PAGE_MARGIN,
		TOP_LINE + CELL_HEIGHT
	)

	yPos = TOP_LINE + CELL_HEIGHT
	yPos = printExtras(
		yPos,
		order.extras.filter((e) => e.count > 0),
		order,
		totals,
		prices
	)
	yPos = printInsurance(yPos, order, totals, prices)
	yPos = printTax(yPos, order, totals)

	const bottom_line = yPos + CELL_HEIGHT
	yPos = yPos + LINE_SPACE
	xPos = PAGE_MARGIN
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	doc.text('SECURITY DEPOSIT', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('DAMAGE EXCESS', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('TOTAL AMOUNT', xPos + 1, yPos)
	xPos = PAGE_MARGIN + 1
	yPos += LINE_SPACE + 1.5
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(toCurrency(totals.deposit), xPos, yPos)
	xPos += COL_WIDTH
	doc.text(toCurrency(totals.excess), xPos, yPos)
	xPos += COL_WIDTH
	doc.text(toCurrency(totals.total), xPos, yPos)
	xPos += COL_WIDTH
	doc.line(
		PAGE_MARGIN,
		TOP_LINE + CELL_HEIGHT,
		COL_WIDTH * 3 + PAGE_MARGIN,
		TOP_LINE + CELL_HEIGHT
	)

	doc.line(PAGE_MARGIN, TOP_LINE, PAGE_MARGIN, bottom_line)
	doc.line(
		PAGE_WIDTH - PAGE_MARGIN,
		TOP_LINE,
		PAGE_WIDTH - PAGE_MARGIN,
		bottom_line
	)
	doc.line(PAGE_MARGIN, bottom_line, PAGE_WIDTH - PAGE_MARGIN, bottom_line)

	// column lines
	doc.line(
		PAGE_MARGIN + COL_WIDTH,
		TOP_LINE,
		PAGE_MARGIN + COL_WIDTH,
		bottom_line
	)
	doc.line(
		PAGE_MARGIN + 2 * COL_WIDTH,
		TOP_LINE,
		PAGE_MARGIN + 2 * COL_WIDTH,
		bottom_line
	)

	return yPos
}

function printInsurance(topY, order, totals, prices) {
	let yPos = topY + LINE_SPACE
	let xPos = PAGE_MARGIN

	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	doc.text('TYPE OF INSURANCE', xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text(
		`${
			order.insurance?.price_type === 'day' ||
			hasCustomPrice('insurance', prices)
				? 'PRICE PER DAY'
				: 'FIX PRICE'
		}`,
		xPos + 1,
		yPos
	)
	xPos += COL_WIDTH
	doc.text('TOTAL', xPos + 1, yPos)
	xPos = PAGE_MARGIN + 1
	yPos += LINE_SPACE + 1.5
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text(order.insurance?.name || '', xPos, yPos)
	xPos += COL_WIDTH
	doc.text(
		toCurrency(perDayValue(order.insurance, totals, prices, order) || 0),
		xPos,
		yPos
	)
	xPos += COL_WIDTH
	doc.text(toCurrency(totals.insurance), xPos, yPos)
	xPos += COL_WIDTH
	doc.line(
		PAGE_MARGIN,
		topY + CELL_HEIGHT,
		COL_WIDTH * 3 + PAGE_MARGIN,
		topY + CELL_HEIGHT
	)

	return topY + CELL_HEIGHT
}
function printExtras(topY, extras, order, totals, prices) {
	let total_cell_num =
		order.extra_drivers.length > 0 ? extras.length + 1 : extras.length
	let yPos = topY
	let xPos = PAGE_MARGIN
	extras.forEach((extra, i) => {
		yPos = i * CELL_HEIGHT + LINE_SPACE + topY
		xPos = PAGE_MARGIN
		// bottom line
		doc.line(
			PAGE_MARGIN,
			topY + CELL_HEIGHT * (i + 1),
			PAGE_WIDTH - PAGE_MARGIN,
			topY + CELL_HEIGHT * (i + 1)
		)
		doc.setFont('Helvetica', 'normal')
		doc.setFontSize(5)
		doc.text(`TYPE OF EXTRA ${i + 1}`, xPos + 1, yPos)
		xPos += COL_WIDTH
		doc.text(
			`${
				extra.item.price_type === 'day' ||
				hasCustomPrice(extra.item.name, prices, true)
					? 'PRICE PER DAY'
					: 'FIX PRICE'
			}`,
			xPos + 1,
			yPos
		)
		xPos += COL_WIDTH
		doc.text('TOTAL', xPos + 1, yPos)
		xPos = PAGE_MARGIN + 1
		yPos += LINE_SPACE + 1.5
		doc.setFont('Helvetica', 'bold')
		doc.setFontSize(11)
		doc.text(`${extra.item.name} (x${extra.count})`, xPos, yPos)
		xPos += COL_WIDTH
		doc.text(
			toCurrency(perDayValue(extra.item, totals, prices, order)),
			xPos,
			yPos
		)
		xPos += COL_WIDTH
		doc.text(toCurrency(totals[extra.item.name]), xPos, yPos)
		xPos += COL_WIDTH
	})

	if (order.extra_drivers.length > 0) {
		yPos = extras.length * CELL_HEIGHT + topY
		xPos = PAGE_MARGIN
		doc.line(
			PAGE_MARGIN,
			yPos + CELL_HEIGHT,
			PAGE_WIDTH - PAGE_MARGIN,
			yPos + CELL_HEIGHT
		)
		yPos += LINE_SPACE
		doc.setFont('Helvetica', 'normal')
		doc.setFontSize(5)
		doc.text(`TYPE OF EXTRA`, xPos + 1, yPos)
		xPos += COL_WIDTH
		doc.text(
			`${
				prices.drivers.type === 'day' || hasCustomPrice('drivers', prices)
					? 'PRICE PER DAY'
					: 'FIX PRICE'
			}`,
			xPos + 1,
			yPos
		)
		xPos += COL_WIDTH
		doc.text('TOTAL', xPos + 1, yPos)

		xPos = PAGE_MARGIN + 1
		yPos += LINE_SPACE + 1.5
		doc.setFont('Helvetica', 'bold')
		doc.setFontSize(11)
		doc.text(`Extra Driver (x${order.extra_drivers.length})`, xPos, yPos)
		xPos += COL_WIDTH
		doc.text(
			toCurrency(perDayValue('drivers', totals, prices, order)),
			xPos,
			yPos
		)
		xPos += COL_WIDTH
		doc.text(toCurrency(totals.drivers), xPos, yPos)
		xPos += COL_WIDTH
	}

	return topY + CELL_HEIGHT * total_cell_num
}

function printTax(topY, order, totals) {
	let cell_num = order.extras?.length > 0 ? 3 : 2
	let xPos = PAGE_MARGIN
	let yPos = topY + LINE_SPACE
	let total = (totals.vehicle * 19) / 119
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(5)
	doc.text(`TYPE`, xPos + 1, yPos)
	xPos += COL_WIDTH
	doc.text('VEHICLE VAT', xPos + 1, yPos)
	doc.line(xPos, topY + CELL_HEIGHT, xPos + COL_WIDTH, topY + CELL_HEIGHT)
	if (order.extras?.length) {
		doc.text('EQUIPMENT VAT', xPos + 1, yPos + CELL_HEIGHT)
		doc.line(
			xPos,
			topY + 2 * CELL_HEIGHT,
			xPos + COL_WIDTH,
			topY + 2 * CELL_HEIGHT
		)
		total += (totals.equipment * 19) / 119
		doc.setFont('Helvetica', 'bold')
		doc.setFontSize(11)
		doc.text(
			toCurrency((totals.equipment * 19) / 119),
			xPos + 1,
			yPos + CELL_HEIGHT + LINE_SPACE + 1.5
		)
		doc.setFont('Helvetica', 'normal')
		doc.setFontSize(5)
	}
	doc.text('INSURANCE VAT', xPos + 1, yPos + (cell_num - 1) * CELL_HEIGHT)
	xPos += COL_WIDTH
	doc.text('TOTAL', xPos + 1, yPos)
	xPos = PAGE_MARGIN + 1
	yPos += LINE_SPACE + 1.5
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)
	doc.text('TAX', xPos, yPos)
	xPos += COL_WIDTH
	doc.text(toCurrency((totals.vehicle * 19) / 119), xPos, yPos)
	doc.text(
		toCurrency((totals.insurance * 19) / 119),
		xPos,
		yPos + (cell_num - 1) * CELL_HEIGHT
	)
	total += (totals.insurance * 19) / 119
	doc.line(
		PAGE_MARGIN,
		topY + cell_num * CELL_HEIGHT,
		PAGE_WIDTH - PAGE_MARGIN,
		topY + cell_num * CELL_HEIGHT
	)
	xPos += COL_WIDTH
	doc.text(toCurrency(total), xPos, yPos)

	return topY + CELL_HEIGHT * cell_num
}

function perDayValue(item, totals, prices, order) {
	if (item === 'drivers') {
		return (
			totals[item] /
			(prices.drivers.type === 'day' || hasCustomPrice('drivers', prices)
				? order.num_days
				: 1)
		)
	}

	if (item?.category === 'insurance') {
		return (
			totals['insurance'] /
			(prices.insurance.type === 'day' || hasCustomPrice('insurance', prices)
				? order.num_days
				: 1)
		)
	}

	if (item?.category === 'equipment') {
		return (
			totals[item?.name] /
			(prices.equipment[item.name].type === 'day' ||
			hasCustomPrice(item.name, prices, true)
				? order.num_days
				: 1)
		)
	}

	return (
		totals[item?.name] /
		(item?.price_type === 'day' || hasCustomPrice(item?.name, prices)
			? order.num_days
			: 1)
	)
}

export function printAgreement(settings, order, prices, logoImgData) {
	function getEquipTotal() {
		return order.extras.reduce((prev, curr) => {
			return (
				(hasCustomPrice(curr.item.name, prices, true)
					? prices.equipment[curr.item.name].custom
					: prices.equipment[curr.item.name]?.total || 0) + prev
			)
		}, 0)
	}

	const totals = {
		vehicle: hasCustomPrice('vehicle', prices)
			? prices.vehicle.custom
			: prices.vehicle?.total || 0,
		insurance: hasCustomPrice('insurance', prices)
			? prices.insurance.custom
			: prices.insurance.total || 0,
		drivers: hasCustomPrice('drivers', prices)
			? prices.drivers.custom
			: prices.drivers?.total || 0,
		deposit: hasCustomPrice('deposit', prices)
			? prices.deposit.custom
			: prices.deposit?.total || 0,
		excess: hasCustomPrice('excess', prices)
			? prices.excess.custom
			: prices.excess?.total || 0,
		equipment: getEquipTotal(),
		...order.extras.reduce((res, obj) => {
			res[obj.item.name] = hasCustomPrice(obj.item.name, prices, true)
				? prices.equipment[obj.item.name].custom
				: prices.equipment[obj.item.name].total
			return res
		}, {}),
	}

	totals.total =
		totals.vehicle + totals.insurance + totals.drivers + totals.equipment

	printTitle(order.number)
	doc.setLineWidth(0.8)
	doc.line(
		PAGE_MARGIN,
		PAGE_MARGIN + TITLE_HEIGHT,
		PAGE_WIDTH - PAGE_MARGIN,
		PAGE_MARGIN + TITLE_HEIGHT
	)
	printHeader(settings.company, logoImgData)
	let lastY = printVehicleInfo(order)
	lastY = printDriver(lastY, order.client, order.extra_drivers)
	lastY = printTotal(lastY, order, totals, prices)

	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(9)
	const splitTerms = doc.splitTextToSize(settings.company.terms, 185)

	doc.addPage()
	doc.text(PAGE_MARGIN, PAGE_MARGIN, splitTerms)

	lastY = doc.getTextDimensions(splitTerms).h + 15
	doc.line(PAGE_MARGIN, lastY, PAGE_WIDTH - PAGE_MARGIN, lastY)
	doc.line(
		PAGE_MARGIN,
		lastY + 2 * CELL_HEIGHT,
		PAGE_WIDTH - PAGE_MARGIN,
		lastY + 2 * CELL_HEIGHT
	)
	doc.line(PAGE_MARGIN, lastY, PAGE_MARGIN, lastY + 2 * CELL_HEIGHT)
	doc.line(
		PAGE_WIDTH - PAGE_MARGIN,
		lastY,
		PAGE_WIDTH - PAGE_MARGIN,
		lastY + 2 * CELL_HEIGHT
	)
	doc.line(PAGE_WIDTH / 2, lastY, PAGE_WIDTH / 2, lastY + 2 * CELL_HEIGHT)

	doc.setFontSize(5)
	doc.text("HIRER'S SIGNATURE", PAGE_MARGIN + 1, lastY + LINE_SPACE)
	if (order.client_signature) {
		doc.addImage(
			order.client_signature,
			'png',
			PAGE_MARGIN + 6,
			lastY + LINE_SPACE + 1,
			25,
			10
		)
	}
	doc.text("MANAGER'S SIGNATURE", PAGE_WIDTH / 2 + 1, lastY + LINE_SPACE)
	doc.addImage(
		settings.company.signature,
		'png',
		PAGE_MARGIN + 6 + PAGE_WIDTH / 2,
		lastY + LINE_SPACE + 1,
		25,
		10
	)

	doc.save(`${zeroPad(order.number, 3)}.pdf`)
}
