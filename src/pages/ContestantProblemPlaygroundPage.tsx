import { useParams } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import { getProblem } from "../services/problem.service"
import { Navbar, ProblemSolver } from "../components"
import { Problem } from "../Models"
import { ProgressSpinner } from "primereact/progressspinner"

const ContestantProblemPlaygroundPage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [problem, setProblem] = useState<Problem | undefined>(undefined)
    const { id } = useParams<{ id: string }>()

    const getProblemData = useCallback(async () => {
        if (id) {
            console.log(id)
            try {
                const problem = await getProblem(id)
                console.log(problem.data)
                setProblem(problem.data)
                setLoading(false)
            } catch (err: any) {
                console.log(err)
                setError(err.response?.data?.detail ?? "Something went wrong")
            }
        }
    }, [id])

    useEffect(() => {
        getProblemData()
    }, [getProblemData])

    return (
        <div className="flex flex-col h-screen justify-center">
            {loading ? (
                <div className="z-50 absolute top-1.5 left-[50%]">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                </div>
            ) : null}
            <Navbar />
            <div className="bg-form bg-cover grow flex flex-row justify-center items-center">
                {error ? <div className="text-2xl">{error}</div> : null}
                {!error || !loading ? (
                    <div className="mx-[2%] rounded-xl px-[2%] bg-graymedium drop-shadow-xl rounded-t-xl border-graydark border-b-4">
                        <div className="flex flex-col gap-[3vh] py-4 h-[85vh] w-[90vw] overflow-auto scrollbar-hide items-center">
                            {problem ? <ProblemSolver problems={[problem]} /> : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default ContestantProblemPlaygroundPage
