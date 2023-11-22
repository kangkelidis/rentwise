import DailyPlan from "@/components/shared/DailyPlan";
import { fetchOrderForDate } from "@/lib/actions/order.actions";
import { fetchSettings } from "@/lib/actions/settings.action";
import { auth } from "@clerk/nextjs";

async function getData(date) {
  const { userId } = auth();

	const orders = fetchOrderForDate(date)
  const settings = fetchSettings(userId)

  const result = await  Promise.all([orders, settings])
  return JSON.stringify({orders: result[0], settings: result[1]})
}

export default async function Page() {
  //temp - use calendar and search options  
  const date = new Date()

  const data = await getData(date)
  return (
    <>
    <DailyPlan data={data}/>
    </>
    )
}

