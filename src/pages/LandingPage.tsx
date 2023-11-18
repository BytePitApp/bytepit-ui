import { HoverCard, Navbar } from "../components"
import { IoTrophy, IoDesktopOutline, IoCalendar } from "react-icons/io5"
import { Button } from "primereact/button"
import { Link, useNavigate } from "react-router-dom"

const LandingPage = () => {
    return (
        <div className="flex h-screen flex-col bg-cover bg-form overflow-x-hidden lg:overflow-hidden">
            <Navbar />
            <div className="flex flex-col-reverse lg:flex-row w-full flex-grow">
                <div className="flex-1 lg:flex flex-col items-start px-[10%]">
                    <div className="w-full grid pt-[15%] pb-[15%] grid-cols-1 gap-[4vh] justify-between align grow">
                        <HoverCard
                            className="w-full lg:w-1/2"
                            title="Code & Learn"
                            subtitle="Browse through coding problems or create your own."
                            Icon={IoDesktopOutline}
                            reverse={false}
                        />
                        <HoverCard
                            className="lg:translate-x-[50%] w-full lg:w-1/2"
                            title="Compete with others"
                            subtitle="Participate in competitions against other contestants and become the coding champ!"
                            Icon={IoTrophy}
                            reverse={true}
                        />
                        <HoverCard
                            className="w-full lg:w-1/2"
                            title="Host competitions"
                            subtitle="Organise a competition for a real coding challenge."
                            Icon={IoCalendar}
                            reverse={false}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-start flex-1">
                    <div className="bg-secondary rounded-b-[13rem] p-8 2xl:p-8 pt-6 2xl:pt-10 2xl:pl-18 bg-gradient-to-b from-slate-200 via-slate-100 to-white 2xl:mr-0">
                        <div className="flex flex-col   text-[10vh] select-none font-major-mono mr-4 2xl:mr-10">
                            <div className="flex">
                                <p className="transition-all duration-200 ease-in-out hover:scale-110 text-primary font-[900]">
                                    B
                                </p>
                                <p className="transition-all duration-200 ease-in-out hover:scale-110 text-primary font-[900]">
                                    y
                                </p>
                                <p className="transition-all duration-200 ease-in-out hover:scale-110 text-primary font-[900]">
                                    t
                                </p>
                                <p className="transition-all duration-200 ease-in-out hover:scale-110 text-primary font-[900]">
                                    e
                                </p>
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
                    <div className="ml-[10%] lg:ml-0 flex flex-col 2xl:gap-5 p-[10%] mt-[10vh] lg:mt-[20vh] rounded-l-full w-full h-[20vh] bg-gradient-to-r from-indigo-600 via-primary to-indigo-800 ">
                        <div className="flex flex-col items-center justify-center h-full gap-4 2xl:gap-8">
                            <div className="flex flex-col text-center text-[1.5vh] text-white font-bold">
                                <p className="font-semibold px-4 2xl:px-28">
                                    BytePit is a great tool to boost your coding skills and get ready for any technical
                                    interview.
                                </p>
                            </div>
                            <Link to="/register" className="w-full text-center">
                                <Button className="font-semibold text-[1.5vh] bg-graydark rounded-3xl text-primary mt-1 hover:bg-white hover:scale-[102%] transition-all ease-in-out duration-300">
                                    No account yet? Register now!
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
