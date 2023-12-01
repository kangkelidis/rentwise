import DailyPlan from "@/components/shared/DailyPlan";
import { fetchMissedOrders, fetchOrderForDate } from "@/lib/actions/order.actions";
import { fetchSettings } from "@/lib/actions/settings.action";
import { auth } from "@clerk/nextjs";

async function getData(date) {
  const { userId } = auth();

	const orders = fetchOrderForDate(date)
  const missedOrders = fetchMissedOrders()
  const settings = fetchSettings(userId)

  const result = await  Promise.all([orders, missedOrders, settings])
  return JSON.stringify({orders: result[0], missedOrders: result[1], settings: result[2]})
}

export default async function Page({ searchParams }) {
  const date = new Date(searchParams.date || new Date())

  const data = await getData(date)
  return (
    <>
    <DailyPlan data={data}/>
    </>
    )
}

