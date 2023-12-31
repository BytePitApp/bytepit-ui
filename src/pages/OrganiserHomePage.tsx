import { useState, useEffect, useCallback, useRef } from "react"
import { Navbar } from "../components"
import { DataTable } from "primereact/datatable"
import { getOrganisersProblems } from "../services/organiser.service"
import { useParams } from "react-router-dom"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Column } from "primereact/column"
import { getCurrentUser } from "../services/users.service"
import { Problem } from "../Models"
import useAuth from "../hooks/useAuth"
import { ProblemList } from "../components"
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"
import { Link } from "react-router-dom"


const OrganiserHomePage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [problems, setProblems] = useState<any>([])
    const { auth } = useAuth()
    const scrollContainerRef = useRef<HTMLDivElement>(null)


    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getOrganisersProblems(auth?.id) // Access the user's id
            const problems : Problem[] = response.data
            setProblems(problems)
            setLoading(false)
        } catch (err: any) {
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchProblems()
    }, [])

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between px-2">
                <h2 className="text-2xl text-primary">Problems List</h2>
            </div>
        )
    }

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            "No users found."
        )
    }

    const handleScroll = (direction: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= scrollContainerRef.current.clientWidth * direction
        }
    }

    return (
        <div className="bg-form bg-cover min-h-screen">
        <div className="bg-form bg-cover h-screen">
            {loading && (
                <div className="z-50 absolute top-1.5 left-[50%]">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                </div>
            )}
            <Navbar />
            <div className="grow m-[5%]">
                <div className="flex flex-col md:flex-row max-md:gap-4 items-center md:justify-between justify-center">
                    <span className="text-xl md:text-3xl font-bold text-primary">Your Problems</span>
                    <div className="flex gap-4 text-lg items-center max-md:justify-between max-md:w-full transition-colors">
                        <Link to="/organiser/create-problem" className="text-primary max-md:order-2 hover:text-secondary duration-150 cursor-pointer font-bold" replace={true}>New Problem</Link>
                        <FaArrowCircleLeft onClick={() => handleScroll(1)} className="max-md:order-1 fill-secondarydark hover:fill-secondary duration-150 w-auto h-7 cursor-pointer" />
                        <FaArrowCircleRight onClick={() => handleScroll(-1)} className="max-md:order-3 fill-secondarydark hover:fill-secondary duration-150 w-auto h-7 cursor-pointer" />
                    </div>
                </div>
                <div ref={scrollContainerRef} className="scroll-smooth overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    <div className="my-5">
                        <ProblemList problems={problems} />
                    </div>
                </div>
            </div>
        </div>
    </div> 
    )
}

export default OrganiserHomePage
