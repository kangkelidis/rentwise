export const test_agreement = {
    order: {
        pick_up_date: "Fri Oct 13 2023 15:57:36 GMT+0300 (Eastern European Summer Time)",
        drop_off_date: "Fri Oct 13 2023 15:57:36 GMT+0300 (Eastern European Summer Time)",
        pick_up_location: "limassol office",
        drop_off_location: "limassol office",
        number: '001',
        // virtual
        num_days: 10,
        price_per_day: 105,

        vehicle: {
            make: "Mercedes-Benz",
            model: "E220",
            year: "2017",
            registration: "ABC123",
            group: "LUXURY A",
            color: "RED",
            odometer: "170000",
            fuel_type: "diesel",
            fuel_amount: "60",
        },

        client: {
            first_name: "firsr",
            last_name: "last",
            dob:  "Fri Oct 13 2023 15:57:36 GMT+0300 (Eastern European Summer Time)",
            tel: "+35799878787",
            email: "email@iam.com",
            passport: "passport",
            id: "nationality + id/pass",
            license: "driving license",
            nationality: "CY",
            address: "full address in 2 cells"
        },

        extras: {
            drivers: [
                // money per day?
                {
                    first_name: "firsr",
                    last_name: "last",
                    license: "driving license",
                },
                {
                    first_name: "first name",
                    last_name: "last name",
                    license: "driving license 2",
                }
            ],

            other: []
        },

        insurance: {
            type: "SDW",
            price_per_day: 0,

        },

        //virtual?
        money: {
            total: "1000",

            tax: {
                vehicle_vat: "10",
                equipment_vat: "10",
                insurance_vat: "20",
                total: "50"
            },
    
        },
        
        deposit: {
            amount: "100",
            excess: "100"
        },
        // signature
    },

    
    


}