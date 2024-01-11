import { FaRegCalendarAlt, FaClock } from "react-icons/fa"
import { Link } from "react-router-dom"

interface CardType {
    competitionId: string,
    name: string,
    description: string,
    startTime: string,
    endTime: string,
    problemCount: number,
    trophyCount: number,
    className?: string,
}

const CompetitionCard = ({ competitionId, name, description, startTime, endTime, problemCount, trophyCount, className }: CardType) => {
    const start_time = new Date(startTime)
    const end_time = new Date(endTime)
    const active = start_time < new Date() && end_time > new Date()
    
    return (
        <Link
            replace={true}
            to={`/organiser/edit-competition/${competitionId}`}
            className={`${className} relative flex flex-col group overflow-hidden shadow-lg pt-10 p-5 rounded-2xl select-none bg-gradient-to-br
                ${start_time > new Date() && "from-secondarylight to-secondary"}
                ${end_time < new Date() && "from-zinc-300/60 to-zinc-400/60"}
                ${active && "from-amber-300 to-amber-500"}`}>
            <div className="absolute inset-0 bg-primarylight translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
            {active && 
                <div className="absolute z-10 top-3 left-0 bg-secondarylight py-1 px-5 rounded-e-2xl text-xs text-white">Active</div>
            }
            <h3 className="z-10 relative font-medium text-xl md:text-3xl overflow-hidden pb-2 whitespace-nowrap text-ellipsis">{name}</h3>
            <div className="z-10 relative text-slate-100 text-sm grow mb-2 line-clamp-2 text-ellipsis">{description}</div>
            <div className="z-10 relative md:flex md:justify-between text-sm">
                <p className="font-medium">problem: {problemCount}</p>
                <p className="font-medium">trophies: {trophyCount}</p>
            </div>
            <div className="z-10 relative md:flex md:justify-between mt-2">
                <div className="flex items-center gap-2">
                    <FaRegCalendarAlt />
                    <span className="text-slate-100 text-sm">
                        {start_time.toLocaleDateString()} - {end_time.toLocaleDateString()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <FaClock />
                    <span className="text-slate-100 text-sm">
                        {String(start_time.getHours()).padStart(2, "0")}:{String(start_time.getMinutes()).padStart(2, "0")} - {String(end_time.getHours()).padStart(2, "0")}:{String(end_time.getMinutes()).padStart(2, "0")}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default CompetitionCard
