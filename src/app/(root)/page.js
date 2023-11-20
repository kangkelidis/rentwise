import DailyPlan from "@/components/shared/DailyPlan";
import { fetchOrderForDate } from "@/lib/actions/order.actions";
import { discardTime } from "@/lib/utils";

async function getData(date) {
	const orders = await fetchOrderForDate(date)
	return JSON.stringify(orders)
}

export default async function Page() {
  //temp - use calendar and search options  
  const date = new Date()

  const data = await getData(date)
  return (
    <>
    <DailyPlan orders={data}/>
    </>
    )
}

