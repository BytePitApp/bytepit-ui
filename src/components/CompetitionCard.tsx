import { FaRegCalendarAlt, FaFlagCheckered, FaQuestionCircle } from "react-icons/fa"
import { Link } from "react-router-dom"

interface CardType {
    competitionId: string
    name: string
    description: string
    startTime: string
    endTime: string
    problemCount: number
    className?: string
}

const CompetitionCard = ({
    competitionId,
    name,
    description,
    startTime,
    endTime,
    problemCount,
    className,
}: CardType) => {
    const startTimeDate = new Date(startTime)
    const endTimeDate = new Date(endTime)
    const active = startTimeDate < new Date() && endTimeDate > new Date()
    const upcoming = startTimeDate > new Date()
    const old = endTimeDate < new Date()

    const textColor = old ? "text-black" : "text-slate-100"

    return (
        <Link
            replace={true}
            to={`/organiser/edit-competition/${competitionId}`}
            className={`${className} relative flex flex-col group overflow-hidden shadow-lg pt-10 p-5 rounded-2xl select-none bg-gradient-to-br
                ${!old && "from-primary  to-primarylight/90"}
                ${old && "from-zinc-400 to-zinc-300 opacity-50"}`}
        >
            <div
                className={`absolute z-50 inset-0 ${
                    startTimeDate > new Date() && endTimeDate < new Date() ? "bg-black/0" : "bg-black/0"
                } hover:bg-black/10 transition duration-300`}
            />
            {!old && (
                <div
                    className={`absolute z-10 top-3 right-0 ${
                        active ? "bg-green-400 animate-bounce text-black" : "bg-secondarylight text-white"
                    }  py-1 px-4 rounded-l-2xl text-md font-semibold`}
                >
                    {active && "Active"}
                    {upcoming && "Upcoming"}
                </div>
            )}
            <h3
                className={`z-10 relative ${textColor} font-bold text-xl md:text-3xl overflow-hidden pb-2 whitespace-nowrap text-ellipsis`}
            >
                {name}
            </h3>
            <div className={`z-10 relative ${textColor} font-semibold text-sm grow mb-2 line-clamp-2 text-ellipsis`}>
                {description}
            </div>
            <div className={`z-10 relative ${textColor} font-semibold flex gap-2 items-center text-sm`}>
                <span className="pi pi-question-circle" />
                <p className="font-semibold">{problemCount}</p>
            </div>
            <div className={`z-10 relative flex justify-end mt-2`}>
                <div className="flex flex-col items-end gap-2">
                    <div className={`${textColor} text-sm font-semibold flex items-center gap-2`}>
                        <span className="pi pi-calendar" />
                        {startTimeDate.toLocaleDateString()}
                        <span className="underline">
                            {String(startTimeDate.getHours()).padStart(2, "0")}:
                            {String(startTimeDate.getMinutes()).padStart(2, "0")}
                        </span>
                    </div>

                    <div className={`${textColor} text-sm font-semibold flex items-center gap-2`}>
                        {endTimeDate.toLocaleDateString()}
                        <span className="underline">
                            {String(endTimeDate.getHours()).padStart(2, "0")}:
                            {String(endTimeDate.getMinutes()).padStart(2, "0")}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default CompetitionCard
