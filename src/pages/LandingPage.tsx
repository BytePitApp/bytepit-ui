import { BubbleText, HoverCard, Navbar } from "../components"
import { LandingBackground } from "../assets"
import { IoTrophy, IoDesktopOutline, IoCalendar } from "react-icons/io5"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
    const [val, setVal] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        setVal(true)
    }, [])

    return (
        <div
            className="flex h-full flex-col bg-cover bg-center bg-no-repeate"
            style={{backgroundImage: `url(${LandingBackground})`}}>
            <Navbar />
            <div className="flex w-full flex-grow">
                <div className="w-[45%] flex flex-col items-center justify-between p-10 bg-primary/10 bg-opacity-70">
                    <BubbleText />
                    <div className="border-l-2 border-black p-5 flex flex-col gap-5 mb-[30%]">
                        <div className="flex flex-col text-xl text-black font-bold">
                            <p>Create free account now! Happy coding!</p>
                        </div>
                        <Button onClick={() => navigate("/register")} label="Get Started" className="w-fit" />
                    </div>
                </div>
                <div className="flex-1 h-2/3 flex justify-center items-center mt-20">
                    <div className="grid gap-10 py-32 px-20 grid-flow-col overflow-hidden">
                        <HoverCard
                            className={`${!val && "translate-x-[100vw]" } translate-y-20 transition-transform duration-700 delay-100`}
                            title="Code & Learn"
                            subtitle="Browse through coding problems, create your own custom problems "
                            Icon={IoDesktopOutline}
                            href="/register"
                        />
                        <HoverCard
                            className={`${!val && "translate-x-[100vw]" } transition-transform duration-700 delay-300`}
                            title="Compete with others"
                            subtitle="Participate in competitions against other contestants and become coding champ"
                            Icon={IoTrophy}
                            href="/register"
                        />
                        <HoverCard
                            className={`${!val && "translate-x-[100vw]" } -translate-y-20 transition-transform duration-700 delay-500`}
                            title="Host competitions"
                            subtitle="Organise competition for real coding challenge"
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

