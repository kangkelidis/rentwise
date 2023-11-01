import { dateDiffInDays } from "../utils";

function calculatePrice(standard_rate, num_days) {
    let total = 0
    const adj = 0.7 * (1 - (Math.exp(-0.045 * Math.sqrt(num_days))))

    if (num_days == 1) {
        total = standard_rate * 150/100
        return Math.round(total / 5) * 5
    }
    if (num_days == 2) {
        total = 2 * standard_rate * 130/100
        return Math.round(total / 5) * 5
    }

    for (let i = 0; i < num_days; i++) {
        if (i < 2) {
            total += (standard_rate + standard_rate * 5/100) * (1 - adj)
            continue
        }
        if (i < 4) {
            total += (standard_rate + standard_rate * 10/100) * (1 - adj)
            continue
        }
        if (i < 6) {
            total += (standard_rate + standard_rate * 2/100) * (1 - adj)
            continue
        }
        if (i < 10) {
            total += (standard_rate - standard_rate * 25/100) * (1 - adj)
            continue
        }
        if (i < 15) {
            total += (standard_rate - standard_rate * 30/100) * (1 - adj)
            continue
        }
        if (i < 20) {
            total += (standard_rate - standard_rate * 35/100) * (1 - adj)
            continue
        }
        if (i < 30) {
            total += (standard_rate - standard_rate * 40/100) * (1 - adj)
            continue
        }
        total += standard_rate - standard_rate * 60/100
    }

    return Math.round(total / 5) * 5
}

function adjustForSeason(price, from, till) {

}

function adjustForAvailability(standard_rate, from, till) {

}

export function getPrice(standard_rate, from, till, num_days) {
    if (num_days) {
        return calculatePrice(standard_rate, num_days)
    }
    
    if (from === '' || till === '') return
    num_days = dateDiffInDays(from, till)
    return calculatePrice(standard_rate, num_days)
}
