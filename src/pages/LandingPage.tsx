import { HoverCard, Navbar } from "../components"
import { LandingBackground } from "../assets"
import { IoTrophy, IoDesktopOutline, IoCalendar } from "react-icons/io5"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
    const navigate = useNavigate()

    return (
        <div
            className="flex h-full flex-col bg-cover bg-top bg-no-repeate"
            style={{backgroundImage: `url(${LandingBackground})`}}>
            <Navbar />
            <div className="flex w-full flex-grow">
                <div className="w-[40%] flex flex-col items-center justify-start">
                    <div className="flex flex-col text-[7rem] select-none font-major-mono">
                        <div className="flex">
                            <p className="transition-all duration-200 ease-in-out hover:scale-110">B</p>
                            <p className="transition-all duration-200 ease-in-out hover:scale-110">y</p>
                            <p className="transition-all duration-200 ease-in-out hover:scale-110">t</p>
                            <p className="transition-all duration-200 ease-in-out hover:scale-110">e</p>
                        </div>
                        <div className="flex">
                            <p className="transition-all -translate-y-10 duration-200 ease-in-out hover:scale-110">P</p>
                            <p className="transition-all -translate-y-10 duration-200 ease-in-out hover:scale-110">i</p>
                            <p className="transition-all -translate-y-10 duration-200 ease-in-out hover:scale-110">t</p>
                        </div>
                    </div>
                    <div className="flex w-full justify-end mb-[10%]">
                        <Button onClick={() => navigate("/register")} label="Get Started" className="w-fit text-xl px-10 py-5" />
                    </div>
                </div>
                <div className="flex-1 h-2/3 flex flex-col items-start">
                    <div className="grid gap-5 py-32 px-20 grid-flow-col">
                        <HoverCard
                            className="-translate-y-10 w-full"
                            title="Code & Learn"
                            subtitle="Browse through coding problems or create your own"
                            Icon={IoDesktopOutline}
                            href="/register"
                        />
                        <HoverCard
                            className="w-full"
                            title="Compete with others"
                            subtitle="Participate in competitions against other contestants and become coding champ"
                            Icon={IoTrophy}
                            href="/register"
                        />
                        <HoverCard
                            className="translate-y-10 w-full"
                            title="Host competitions"
                            subtitle="Organise competition for real coding challenge"
                            Icon={IoCalendar}
                            href="/register"
                        />
                    </div>
                    <Button onClick={() => navigate("/register")} label="Get Started" className="w-fit text-xl px-10 py-5" />

                </div>

            </div>
        </div>
    )
}

export default LandingPage

