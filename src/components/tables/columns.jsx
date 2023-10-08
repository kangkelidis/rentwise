"use client"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const carColumns = [
  {
    accessorKey: "make",
    header: "Make",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "registration",
    header: "Registration",
  },
]

export const orderColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "pickup",
    header: "Pick Up Date",
  },
  {
    accessorKey: "dropoff",
    header: "Drop of Date",
  },
  {
    accessorKey: "vehicle",
    header: "Car",
  },
]