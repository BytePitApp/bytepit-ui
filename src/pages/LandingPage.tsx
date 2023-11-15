import { BubbleText, HoverCard, Navbar } from "../components"
import { LandingBackground } from "../assets"
import { IoTrophy, IoDesktopOutline, IoCalendar } from "react-icons/io5"
import { Button } from "primereact/button"

const LandingPage = () => {
    return (
        <div 
            className="flex flex-col h-full bg-cover bg-center bg-no-repeate"
            style={{backgroundImage: `url(${LandingBackground})`}}>
            <Navbar />
            <div className="flex w-full flex-grow">
                <div className="w-[54.3rem] h-full flex flex-col items-center justify-between p-12 bg-primary/10 bg-opacity-70">
                    <BubbleText />
                    <div className="border-l-2 border-black p-5 flex flex-col gap-5 mb-32">
                        <span className="text-xl text-black font-bold">
                            Interested, start learning... Sign up for free now?
                        </span>
                        <Button label="Get Started" className="w-fit" />
                    </div>
                </div>
                <div className="flex-1 h-2/3 flex justify-center items-center mt-10">
                <div className="grid w-4/5 gap-10 py-32 grid-flow-col overflow-x-auto">
                        <HoverCard
                            className="translate-y-10"
                            title="Code & Learn"
                            subtitle="Solve coding problems and learn"
                            Icon={IoDesktopOutline}
                            href="/register"
                        />
                        <HoverCard
                            className=""
                            title="Compete with others"
                            subtitle="Participate in competitions with other contestants and become coding champ"
                            Icon={IoTrophy}
                            href="/register"
                        />
                        <HoverCard
                            className="-translate-y-10"
                            title="Custom coding problems and competitions"
                            subtitle="Create cutom coding problems for real coding challenge and host competitions"
                            Icon={IoCalendar}
                            href="/register"
                        />
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default LandingPage

