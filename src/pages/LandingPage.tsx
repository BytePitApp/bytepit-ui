import { HoverCard, Navbar } from "../components"
import { LandingBackground } from "../assets"
import { IoTrophy, IoDesktopOutline, IoCalendar } from "react-icons/io5"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
    const navigate = useNavigate()

    return (
        <div className="flex h-full flex-col bg-cover bg-top bg-no-repeate bg-form">
            <Navbar />
            <div className="flex w-full flex-grow pl-40 2xl:pl-64 overflow-hidden">
                <div className="flex-1 flex flex-col items-start">
                    <div className="grid gap-3 2xl:gap-5 py-20 2xl:py-32 grid-flow-row justify-between align grow">
                        <HoverCard
                            className="-translate-y-5 2xl:-translate-y-10 w-1/2 max-w-1/2"
                            title="Code & Learn"
                            subtitle="Browse through coding problems or create your own."
                            Icon={IoDesktopOutline}
                            reverse={false}
                        />
                        <HoverCard
                            className="w-1/2  max-w-1/2 translate-x-[50%]"
                            title="Compete with others"
                            subtitle="Participate in competitions against other contestants and become the coding champ!"
                            Icon={IoTrophy}
                            reverse={true}
                        />
                        <HoverCard
                            className="translate-y-5 2xl:translate-y-10 w-1/2"
                            title="Host competitions"
                            subtitle="Organise a competition for a real coding challenge."
                            Icon={IoCalendar}
                            reverse={false}
                        />
                    </div>
                </div>
                <div className=" flex flex-col items-center justify-start flex-1">
                    <div className="bg-secondary rounded-b-[13rem] p-8 2xl:p-8 pt-6 2xl:pt-10 2xl:pl-18 bg-gradient-to-b from-slate-200 via-slate-100 to-white mr-8 2xl:mr-0">
                        <div className="flex flex-col text-[6.5rem] 2xl:text-[8rem] select-none font-major-mono mr-4 2xl:mr-10"> 
                            <div className="flex">
                                <p className="transition-all duration-200 ease-in-out hover:scale-110 text-primary font-[900]">B</p>
                                <p className="transition-all duration-200 ease-in-out hover:scale-110 text-primary font-[900]">y</p>
                                <p className="transition-all duration-200 ease-in-out hover:scale-110 text-primary font-[900]">t</p>
                                <p className="transition-all duration-200 ease-in-out hover:scale-110 text-primary font-[900]">e</p>
                            </div>
                            <div className="flex justify-end">
                                <p className="transition-all -translate-y-10 duration-200 ease-in-out hover:scale-110 text-primary 2xl:font-[900]">
                                    P
                                </p>
                                <p className="transition-all -translate-y-10 duration-200 ease-in-out hover:scale-110 text-primary font-[900]">
                                    i
                                </p>
                                <p className="transition-all -translate-y-10 duration-200 ease-in-out hover:scale-110 text-primary font-[900]">
                                    t
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="2xl:p-10 flex flex-col 2xl:gap-5 mt-[10%] 2xl:mt-[20%] rounded-l-full w-full h-52 2xl:h-64 ml-4 2xl:ml-20 pl-10 2xl:pl-0 bg-gradient-to-r from-indigo-600 via-primary to-indigo-800 ">
                        <div className="flex flex-col items-center justify-center h-full gap-4 2xl:gap-8 mr-20">
                            <div className="flex flex-col text-center text-lg 2xl:text-xl text-white font-bold">
                                <p className="font-semibold px-4 2xl:px-28">BytePit is a great tool to boost your coding skills and get ready for any technical interview.</p>
                            </div>
                            <Button
                                className="bg-graydark rounded-full text-primary text-lg 2xl:text-xl 2xl:mt-1 hover:bg-white hover:scale-[102%] transition-all ease-in-out duration-300"
                                label="No account yet? Register now!"
                                size="large"
                                onClick={() => navigate("/register")}
                                text
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
