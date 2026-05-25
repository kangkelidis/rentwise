import * as jsPDF from 'jspdf'
import { hasCustomPrice, toCurrency, zeroPad } from '../utils.js'
import { getClientDisplayName } from '../client-display.js'
import { getVatAmount, getVatTotals } from '../price/rates.js'
import autoTable from 'jspdf-autotable'

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

function getLineSubtotal(amount, vatMode) {
	return vatMode === 'excluded' ? amount : amount - getVatAmount(amount, vatMode)
}

function getTaxText(amount, vatMode) {
	return `(VAT 19%)  ${toCurrency(getVatAmount(amount, vatMode))}`
}

function printHeader(company, logoImgData, order, totals, vatTotals) {
	doc.addImage(
		logoImgData,
		'png',
		PAGE_MARGIN,
		HEADER_Y,
		LOGO_SIZE[0],
		LOGO_SIZE[1],
		null,
		'NONE'
	)
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
	yPos += 2 * LINE_SPACE
	xPos = PAGE_MARGIN
	doc.text(`Tel: ${company.tel}`, xPos, yPos)
	yPos += LINE_SPACE
	doc.text(`Email: ${company.email}`, xPos, yPos)
	yPos += LINE_SPACE
	doc.text(`Website: ${company.website}`, xPos, yPos)

	yPos = HEADER_Y + SPACING
	xPos = PAGE_WIDTH - PAGE_MARGIN
	doc.setFontSize(19)
	doc.setFont('Helvetica', 'normal')
	doc.text('Proforma Invoice', xPos, yPos, null, null, 'right')

	doc.setFontSize(11)
	yPos += 1.5 * LINE_SPACE

	doc.text('Invoice No: ' + order.number, xPos, yPos, null, null, 'right')
	yPos += 2 * LINE_SPACE
	doc.setFontSize(9)
	doc.text('Date', xPos, yPos, null, null, 'right')
	yPos += 1.5 * LINE_SPACE
	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(11)
	doc.text(
		`${new Date().toLocaleDateString('en-UK')}`,
		xPos,
		yPos,
		null,
		null,
		'right'
	)

	yPos += 2.2 * LINE_SPACE
	doc.setFontSize(9)
	doc.text(`Balance Due`, xPos, yPos, null, null, 'right')
	yPos += 2 * LINE_SPACE
	doc.setFontSize(13)
	doc.setFont('Helvetica', 'bold')

	doc.text(toCurrency(vatTotals.total), xPos, yPos, null, null, 'right')

	// CLient
	doc.setFontSize(11)
	xPos = PAGE_MARGIN
	yPos += LINE_SPACE * 10
	doc.setFont('Helvetica', 'normal')
	doc.text('Bill To:', xPos, yPos)
	yPos += 2 * LINE_SPACE
	doc.setFont('Helvetica', 'bold')
	const client = order.client || {}
	doc.text(getClientDisplayName(client, 'Missing client'), xPos, yPos)

	doc.setFont('Helvetica', 'normal')
	yPos += 2 * LINE_SPACE
	if (client.email) {
		doc.text(client.email, xPos, yPos)
		yPos += 1.5*LINE_SPACE
	}
	if (client.tel) {
		doc.text(client.tel, xPos, yPos)
		yPos += 1.5*LINE_SPACE
	}
	if (client.address && client.address !== ', , , , ') {
		doc.text(client.address, xPos, yPos)
		yPos += 1.5*LINE_SPACE
	}
	yPos += LINE_SPACE

	doc.autoTable({
		startY: yPos,
		headStyles: { fillColor: [50, 50, 50] },
		margin: { left: PAGE_MARGIN, right: PAGE_MARGIN, bottom: 55 },
		rowPageBrake: 'avoid',
		styles: {
			fontSize: 9,
		},
		columnStyles: { 0: { halign: 'center'}, 1: {halign: 'left'}, 2:{halign: 'left'}, 3: {halign: 'right'}  },
		head: [['No', 'Description', 'Tax', 'Amount']],
		body: [
			[
				1,
				`${order.vehicle.make.toUpperCase()} ${order.vehicle.model.toUpperCase()} (${
					order.vehicle.registration
				})  |  ${new Date(order.pick_up_date).toLocaleDateString(
					'en-UK'
				)} - ${new Date(order.drop_off_date).toLocaleDateString('en-UK')}`,
				getTaxText(totals.vehicle, vatTotals.mode),
				toCurrency(getLineSubtotal(totals.vehicle, vatTotals.mode)),
			],
			[
				2,
				`Insurance: ${order.insurance.name.toUpperCase()}`,
				getTaxText(totals.insurance, vatTotals.mode),
				toCurrency(getLineSubtotal(totals.insurance, vatTotals.mode)),
			],
			...order.extras.map((extra, i) => {
				if (extra.count > 0) {
					const extraTotal = totals[extra.item.name]
					return [
						Number(3 + i),
						`${extra.count}x ${extra.item.name}`,
						getTaxText(extraTotal, vatTotals.mode),
						toCurrency(getLineSubtotal(extraTotal, vatTotals.mode)),
					]
				} else {return []}
			}).filter(a => a.length > 0),
		],
	})

	yPos = doc.lastAutoTable.finalY + LINE_SPACE;
	xPos = PAGE_WIDTH - PAGE_MARGIN
  	doc.line(PAGE_MARGIN, yPos, PAGE_WIDTH-PAGE_MARGIN, yPos);
	yPos += 2*LINE_SPACE
	doc.text('Total Tax', xPos -35, yPos, null, null, 'right')
	doc.text(toCurrency(vatTotals.tax), xPos, yPos, null, null, 'right')
	yPos += 2*LINE_SPACE

	doc.text('Subtotal', xPos -35, yPos, null, null, 'right')
	doc.text(toCurrency(vatTotals.subtotal), xPos, yPos, null, null, 'right')
	yPos += 2*LINE_SPACE

	doc.setFont('Helvetica', 'bold')
	doc.text('Balance Due', xPos -35, yPos, null, null, 'right')
	doc.text(toCurrency(vatTotals.total), xPos, yPos, null, null, 'right')

	doc.setFontSize(9);
	doc.setFont("Helvetica", "normal");
	doc.line(PAGE_MARGIN, 270, PAGE_WIDTH-PAGE_MARGIN, 270, "S");
    doc.text(
      [
        "Account name: CYTRANSOLUTIONS LTD",
        "Account number: 357026026038",
        "IBAN: CY47002001950000357026026038",
        "BIC: BCYPCY2N",
      ],
      PAGE_MARGIN,
      275
    );

}

export function printInvoice(settings, order, prices, logoImgData) {
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
	const vatTotals = getVatTotals(prices, settings)

	printHeader(settings.company, logoImgData, order, totals, vatTotals)

	doc.save(`${zeroPad(order.number, 3)}_invoice.pdf`)
}
