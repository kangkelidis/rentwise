import { zeroPad } from "@/lib/utils";

export default function DateDisplay( props ) {
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const date = new Date(props.date)
    const hour = zeroPad(date.getHours(), 2);
    return (
        <div className="flex flex-col text-xs text-center content-center">
            <div className={`flex flex-col w-10 gap-2 ${hour < 6 || hour > 22 ? "bg-orange-300" : "bg-gray-200"} text-black text-center rounded-t-md tracking-wide leading-3 mb-0`}>
                <span className="font-bold">{month[date.getMonth()]}</span>
                <span className="text-lg -my-1 font-black">{date.getDate()}</span>
                <span className={`font-medium bg-gray-400 text-tiny `}>{date.getFullYear()}</span>
            </div>
                <span className="bg-black w-full text-tiny-medium p-1 text-center rounded-b-md">{hour}:{zeroPad(date.getMinutes(), 2)}</span>
        </div>
    )
}