import * as jsPDF from "jspdf";

//TODO: multiple pages and pagination,
//      align header info with logo
//      add car image
//      do totals
//      add signature area
//      add parameters
//      fix totals and add multiple drivers
//      figure out signature
//      limit text in its box

const doc = new jsPDF.jsPDF();

const PAGE_MARGIN = 10
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297

const TITLE_HEIGHT = 2
const HEADER_Y = 15
const VEHICLE_Y = 47

const LOGO_SCALE = 1.2
const LOGO_SIZE = [17.4 * LOGO_SCALE, 15.4 * LOGO_SCALE]
const CAR_SIZE = [65, 65]
const VEHICLE_COL_WIDTH = (PAGE_WIDTH - 2 * PAGE_MARGIN - CAR_SIZE[0]) / 3
const COL_WIDTH = (PAGE_WIDTH - 2 * PAGE_MARGIN) / 3
const CELL_HEIGHT = 9

const SPACING = 3.5
const LINE_SPACE = 2.7

const TERMS = `TERMS AND CONDITIONS

1. In case the hirer paid for the insurance and in the event of an accident, the Hirer/Driver remains responsible for the first €.
2. In case of an accident, Cytransolutions Ltd (Allure Rent Car) has the right to deduct from the credit card of the renter or the payer the maximum amount of the excess to cover damages sustained to the vehicle.
3. If the charges, in connection with the rental or the damages, are to be charged on a credit card, Hirer’s/Payer’s signature below will be considered to have been made on the credit card slip. SIGNATURE
4. Insurance does not cover damage to the tires, oil pump, interior of the car, windshields/glass windows, soft tops, fire, passengers' injuries or death.
5. Insurance does not cover the driver's injuries or death.
6. The Hirer/Driver is liable for the full repair of damages or injuries either to the owner’s or to the third party's vehicle: A) If the accident was caused by any violation of the Traffic Law B) If driving under the influence of alcohol or drugs C) If driving on gravel roads D) If anyone else was driving the car without the owner’s permission.
7. Traffic fines are the responsibility of the Hirer.
8. The Hirer agrees at all times to keep and drive the car with every proper care and attention and to return the same in good working order as it was when delivered, including all tools, jack, spare wheel, and radio, which he/she has checked at the delivery time, and return all at the place and time agreed upon in the Hirer agreement.
9. The owner has the full right to cancel the agreement and take possession of the car at any time.
10. In case the hirer returns the above-hired car to the owner before the agreed period, the hirer shall not be entitled to any refund of the agreed hire charges. Any outstanding balance remains payable by the renter.
11. In case the said car is not returned within the agreed time, the hirer could claim the whole daily rental amount.
12. The hirer's car must not be used in the Northern part of Cyprus or in areas under the control of the Turkish army or the Turkish-Cypriots.
We hereby warrant that all the above particulars and statements are true.

The terms and conditions of this rental agreement have been properly explained to me, and if the renter chose to pay the owner with his credit card, then with his signature on the rental agreement, he authorizes unreservedly the lessor to calculate the total amount to be paid to the lessor and to charge his card accordingly, estimating also the amounts owed due to damages, fines, or other judicial expenses, as well as any other amounts deriving from the rental, according to the terms of the present agreement. I have read the terms and conditions and agree thereto. Any and all disputes that may arise between the Owner and Hirer will be settled before the competent courts of the Republic of Cyprus.`

const accept = `I HAVE READ AND AGREED TO THE TERMS ON BOTH SIDES OF THIS AGREEMENT AND CONFIRM THAT IF PAYMENT HERE UNDER IS TO BE MADE BY CREDIT CARD OR CHARGE CARD MY SIGNATURE BELOW SMALL CONSTITUTE AUTHORITY TO DEBIT MY NOMINATED CREDIT CARD OF CHARGE CARD COMPANY WITH THE TOTAL AMOUNT DUE. ALSO AGREE THAT REGARDLESS OF ANY OTHER MATTER I AM PERSONALLY LIABLE UNTIL THE BALANCE IS PAID ANY DAMAGES UNDERNEATH THE CAR, OIL SUMP, WINDOWS AND THEFT ARE NOT COVERED BY THE SCOW INSURANCE AND REMAIN RESPONSIBILITY OF THE DRIVER.
ALL COMPLAINS MUST BE NOTIFIED TO THE MANAGEMENT BEFORE THE END OF THE RENTAL PERIOD OTHERWISE WE WILL NOT BE HELD RESPONSIBLE.`

function printTitle(number) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`CAR HIRE AGREEMENT No: ${number}`, PAGE_WIDTH - PAGE_MARGIN, PAGE_MARGIN, null, null, 'right' )
} 

function printHeader() {
    let file = require("../../../public/assets/company/logo.js");
    doc.addImage(file.logo, "png", PAGE_MARGIN, HEADER_Y, LOGO_SIZE[0], LOGO_SIZE[1]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
  
    let yPos = HEADER_Y + SPACING
    let xPos =  PAGE_MARGIN + LOGO_SIZE[0] + SPACING
    doc.text("ALLURE RENT A CAR", xPos, yPos);
    yPos += LINE_SPACE *1.5
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
    doc.text("CYTRANSOLUTIONS LTD", xPos, yPos);
    yPos += LINE_SPACE *1.5
    doc.text("Amathountos 34, Shop 8,", xPos, yPos);
    yPos += LINE_SPACE
    doc.text("Limassol, 4532", xPos, yPos);
    yPos += LINE_SPACE
    doc.text("Tel: +35799667777", xPos, yPos);
    yPos += LINE_SPACE
    doc.text("Email: info@allure-rent-a-car.com", xPos, yPos);
    yPos += LINE_SPACE
    doc.text("VAT no : 10361018V", xPos, yPos);

    yPos = HEADER_Y + SPACING
    xPos = PAGE_WIDTH - PAGE_MARGIN

    doc.setFontSize(9);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, xPos, yPos, null, null, 'right')
}


function printVehicleInfo(vehicle) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setLineWidth(0.1)
    doc.text('VEHICLE', PAGE_MARGIN, VEHICLE_Y)
    doc.line(PAGE_MARGIN, VEHICLE_Y + LINE_SPACE, PAGE_WIDTH - PAGE_MARGIN, VEHICLE_Y + LINE_SPACE)

    let xPos = PAGE_MARGIN
    let yPos = VEHICLE_Y + LINE_SPACE
    doc.line(xPos, yPos, xPos, yPos + 5*CELL_HEIGHT )
    doc.line(PAGE_WIDTH-PAGE_MARGIN, yPos, PAGE_WIDTH-PAGE_MARGIN, yPos + 5*CELL_HEIGHT )

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    yPos = VEHICLE_Y + 2 * LINE_SPACE
    doc.text('MAKE', xPos + 1, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('REGISTRATION NUMBER', xPos + 1, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('VEHICLE GROUP', xPos + 1, yPos)
    xPos = PAGE_MARGIN +1
    yPos += LINE_SPACE +1.5
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('MERCEDES-BENZ', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.line(xPos-1, VEHICLE_Y + LINE_SPACE, xPos-1, VEHICLE_Y + LINE_SPACE + 5*CELL_HEIGHT )
    doc.text('ABX123', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.line(xPos-1, VEHICLE_Y + LINE_SPACE, xPos-1, VEHICLE_Y + LINE_SPACE + 5*CELL_HEIGHT )
    doc.text('LUXURY A', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.line(xPos-1, VEHICLE_Y + LINE_SPACE, xPos-1, VEHICLE_Y + LINE_SPACE + 5*CELL_HEIGHT )
    
    xPos = PAGE_MARGIN +1
    yPos = VEHICLE_Y + CELL_HEIGHT + LINE_SPACE * 2
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    doc.text('MODEL', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('YEAR', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('COLOR', xPos, yPos)
    yPos += LINE_SPACE * 1.5
    xPos = PAGE_MARGIN +1
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('E220', xPos, yPos)
    doc.line(PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + CELL_HEIGHT, VEHICLE_COL_WIDTH * 3 + PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + CELL_HEIGHT)
    xPos += VEHICLE_COL_WIDTH
    doc.text('2020', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('RED', xPos, yPos)
    doc.line(PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + 2*CELL_HEIGHT, VEHICLE_COL_WIDTH * 3 + PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + 2*CELL_HEIGHT)


    xPos = PAGE_MARGIN +1
    yPos = VEHICLE_Y + 2 * CELL_HEIGHT + LINE_SPACE * 2
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    doc.text('ODOMETER', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('FUEL TYPE', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('AMOUNT OF FUEL', xPos, yPos)
    yPos += LINE_SPACE * 1.5
    xPos = PAGE_MARGIN +1
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('170000', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('DIESEL', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('60%', xPos, yPos)
    doc.line(PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + 3*CELL_HEIGHT, VEHICLE_COL_WIDTH * 3 + PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + 3*CELL_HEIGHT)

    xPos = PAGE_MARGIN +1
    yPos = VEHICLE_Y + 3 * CELL_HEIGHT + LINE_SPACE * 2
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    doc.text('PICKUP DATE', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('PICKUP LOCATION', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('PICKUP TIME', xPos, yPos)
    yPos += LINE_SPACE * 1.5
    xPos = PAGE_MARGIN +1
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('10/10/10', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('LIMASSOL OFFICE', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('10:10', xPos, yPos)
    doc.line(PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + 4*CELL_HEIGHT, VEHICLE_COL_WIDTH * 3 + PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + 4*CELL_HEIGHT)

    xPos = PAGE_MARGIN +1
    yPos = VEHICLE_Y + 4 * CELL_HEIGHT + LINE_SPACE * 2
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    doc.text('RETURN DATE', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('RETURN LOCATION', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('RETURN TIME', xPos, yPos)
    yPos += LINE_SPACE * 1.5
    xPos = PAGE_MARGIN +1
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('10/10/10', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('LIMASSOL OFFICE', xPos, yPos)
    xPos += VEHICLE_COL_WIDTH
    doc.text('10:10', xPos, yPos)
    doc.line(PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + 5*CELL_HEIGHT, PAGE_WIDTH - PAGE_MARGIN, VEHICLE_Y + LINE_SPACE + 5*CELL_HEIGHT)
    return VEHICLE_Y + LINE_SPACE + 5*CELL_HEIGHT
}

function printDriver(yPos) {
    let xPos = PAGE_MARGIN
    yPos = yPos + 3*LINE_SPACE

    const TOP_LINE = yPos + LINE_SPACE
   
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setLineWidth(0.1)
    doc.text('DRIVER 1 / HIRER', PAGE_MARGIN, yPos)
    doc.line(PAGE_MARGIN, TOP_LINE, PAGE_WIDTH - PAGE_MARGIN, TOP_LINE)

    yPos = yPos + LINE_SPACE
    doc.line(xPos, yPos, xPos, yPos + 3*CELL_HEIGHT )
    doc.line(PAGE_WIDTH-PAGE_MARGIN, yPos, PAGE_WIDTH-PAGE_MARGIN, yPos + 3*CELL_HEIGHT )

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    yPos = yPos + LINE_SPACE
    doc.text('FIRST NAME', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('LAST NAME', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('DATE OF BIRTH', xPos + 1, yPos)
    xPos = PAGE_MARGIN +1
    yPos += LINE_SPACE +1.5
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('FIRST', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(xPos-1, TOP_LINE, xPos-1, TOP_LINE + 3* CELL_HEIGHT )
    doc.text('LAST', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(xPos-1, TOP_LINE, xPos-1, TOP_LINE + 3* CELL_HEIGHT )
    doc.text('01/08/10', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(xPos-1, TOP_LINE, xPos-1, TOP_LINE + 3* CELL_HEIGHT )
    doc.line(PAGE_MARGIN,  TOP_LINE + CELL_HEIGHT , COL_WIDTH * 3 + PAGE_MARGIN, TOP_LINE + CELL_HEIGHT)

    yPos = TOP_LINE + CELL_HEIGHT
    xPos = PAGE_MARGIN 
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    yPos = yPos + LINE_SPACE
    doc.text('PHONE NO', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('POSTAL CODE', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('EMAIL', xPos + 1, yPos)
    xPos = PAGE_MARGIN +1
    yPos += LINE_SPACE +1.5
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('+357996611117', xPos, yPos)
    xPos += COL_WIDTH
    doc.text('4006', xPos, yPos)
    xPos += COL_WIDTH
    doc.text('email@dom.com', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(PAGE_MARGIN,  TOP_LINE + 2*CELL_HEIGHT , COL_WIDTH * 3 + PAGE_MARGIN, TOP_LINE + 2*CELL_HEIGHT)

    yPos = TOP_LINE + 2*CELL_HEIGHT
    xPos = PAGE_MARGIN 
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    yPos = yPos + LINE_SPACE
    doc.text('COUNTRY', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('CITY', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('STREET', xPos + 1, yPos)
    xPos = PAGE_MARGIN +1
    yPos += LINE_SPACE +1.5
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('CY', xPos, yPos)
    xPos += COL_WIDTH
    doc.text('LIMASSOL', xPos, yPos)
    xPos += COL_WIDTH
    doc.text('THERVANTES', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(PAGE_MARGIN, TOP_LINE + 3*CELL_HEIGHT, COL_WIDTH * 3 + PAGE_MARGIN, TOP_LINE + 3*CELL_HEIGHT)

    return TOP_LINE + 3*CELL_HEIGHT
}

function printTotal(yPos) {
    let xPos = PAGE_MARGIN
    yPos = yPos + 3*LINE_SPACE

    const TOP_LINE = yPos + LINE_SPACE
   
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setLineWidth(0.1)
    doc.text('DRIVER 1 / HIRER', PAGE_MARGIN, yPos)
    doc.line(PAGE_MARGIN, TOP_LINE, PAGE_WIDTH - PAGE_MARGIN, TOP_LINE)

    yPos = yPos + LINE_SPACE
    doc.line(xPos, yPos, xPos, yPos + 3*CELL_HEIGHT )
    doc.line(PAGE_WIDTH-PAGE_MARGIN, yPos, PAGE_WIDTH-PAGE_MARGIN, yPos + 3*CELL_HEIGHT )

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    yPos = yPos + LINE_SPACE
    doc.text('FIRST NAME', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('LAST NAME', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('DATE OF BIRTH', xPos + 1, yPos)
    xPos = PAGE_MARGIN +1
    yPos += LINE_SPACE +1.5
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('FIRST', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(xPos-1, TOP_LINE, xPos-1, TOP_LINE + 3* CELL_HEIGHT )
    doc.text('LAST', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(xPos-1, TOP_LINE, xPos-1, TOP_LINE + 3* CELL_HEIGHT )
    doc.text('01/08/10', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(xPos-1, TOP_LINE, xPos-1, TOP_LINE + 3* CELL_HEIGHT )
    doc.line(PAGE_MARGIN,  TOP_LINE + CELL_HEIGHT , COL_WIDTH * 3 + PAGE_MARGIN, TOP_LINE + CELL_HEIGHT)

    yPos = TOP_LINE + CELL_HEIGHT
    xPos = PAGE_MARGIN 
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    yPos = yPos + LINE_SPACE
    doc.text('PHONE NO', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('POSTAL CODE', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('EMAIL', xPos + 1, yPos)
    xPos = PAGE_MARGIN +1
    yPos += LINE_SPACE +1.5
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('+357996611117', xPos, yPos)
    xPos += COL_WIDTH
    doc.text('4006', xPos, yPos)
    xPos += COL_WIDTH
    doc.text('email@dom.com', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(PAGE_MARGIN,  TOP_LINE + 2*CELL_HEIGHT , COL_WIDTH * 3 + PAGE_MARGIN, TOP_LINE + 2*CELL_HEIGHT)

    yPos = TOP_LINE + 2*CELL_HEIGHT
    xPos = PAGE_MARGIN 
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    yPos = yPos + LINE_SPACE
    doc.text('COUNTRY', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('CITY', xPos + 1, yPos)
    xPos += COL_WIDTH
    doc.text('STREET', xPos + 1, yPos)
    xPos = PAGE_MARGIN +1
    yPos += LINE_SPACE +1.5
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text('CY', xPos, yPos)
    xPos += COL_WIDTH
    doc.text('LIMASSOL', xPos, yPos)
    xPos += COL_WIDTH
    doc.text('THERVANTES', xPos, yPos)
    xPos += COL_WIDTH
    doc.line(PAGE_MARGIN, TOP_LINE + 3*CELL_HEIGHT, COL_WIDTH * 3 + PAGE_MARGIN, TOP_LINE + 3*CELL_HEIGHT)

    return TOP_LINE + 3*CELL_HEIGHT
}

export function printAgreement(agreement) {


    printTitle()
    doc.setLineWidth(0.8)
    doc.line(PAGE_MARGIN, PAGE_MARGIN + TITLE_HEIGHT, PAGE_WIDTH-PAGE_MARGIN, PAGE_MARGIN + TITLE_HEIGHT);
    printHeader()
    let lastY = printVehicleInfo(agreement?.vehicle)
    lastY = printDriver(lastY)
    lastY = printTotal(lastY)

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(5);
    const splitTerms = doc.splitTextToSize(TERMS, 185);
    const splitAccept = doc.splitTextToSize(accept, 185)
    doc.text(PAGE_MARGIN, lastY, splitTerms)
    doc.text(PAGE_MARGIN, 250, splitAccept)

    doc.save()
}