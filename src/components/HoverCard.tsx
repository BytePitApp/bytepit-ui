import { reverse } from "dns"
import { IconType } from "react-icons"

interface CardType {
    title: string
    subtitle: string
    Icon: IconType
    href?: string
    className?: string
    reverse: boolean
}

const HoverCard = ({ title, subtitle, Icon, href, className, reverse }: CardType) => {
    return (
        <a href={href} className={`${className} p-6 rounded-2xl relative overflow-hidden group ${reverse ? "bg-indigo-600" : "bg-white/80"} ${reverse && "bg-gradient-to-r from-indigo-600 to-primary"} select-none`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${reverse ? "from-white" : "from-primary"} ${reverse ? "to-white" : "to-indigo-600"} translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300{}`} />
            <Icon className={`absolute z-10 -top-12 -right-12 text-9xl ${reverse ? "text-primarylight" : "text-slate-200"} ${reverse ? "group-hover:text-primary" : "group-hover:text-white"} group-hover:rotate-12 transition-transform duration-300{}`} />
            <Icon className={`mb-2 text-2xl ${reverse ? "text-white" : "text-primary"} ${reverse ? "group-hover:text-primary" : "group-hover:text-white"} transition-colors relative z-10 duration-300{}`} />
            <h3 className={`font-medium text-2xl ${reverse ? "text-white" : "text-slate-950"} ${reverse ? "group-hover:text-black" : "group-hover:text-white"} relative z-10 duration-300{}`}>
                {title}
            </h3>
            <p className={`${reverse ? "text-slate-100" : "text-slate-500"} ${reverse ? "group-hover:text-slate-500" : "group-hover:text-white"} relative z-10 duration-300{}`}>
                {subtitle}
            </p>
        </a>
    )
}


export default HoverCard