import { useCallback, useEffect, useState } from "react"
import { Problem } from "../Models"
import { useParams } from "react-router-dom"
import ProblemSolver from "./ProblemSolver"
import { getProblem } from "../services/problem.service"

const ContestantProblemPlayground: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [problem, setProblem] = useState<Problem | undefined>(undefined)
    const { id } = useParams<{ id: string }>()

    const getProblemData = useCallback(async () => {
        if (id) {
            try {
                const problem = await getProblem(id)
                setProblem(problem.data)
            } catch (err: any) {
                console.log(err)
                setError(err.response?.data?.detail ?? "Something went wrong")
            }
        }
        setLoading(false)
    }, [id])

    useEffect(() => {
        getProblemData()
    }, [getProblemData])

    return (
        <div className="grow p-[5%] gap-y-20 flex flex-row justify-center items-center">
            {error ? <div className="text-2xl">{error}</div> : null}
            {!error || !loading ? (
                <div className="mx-[2%] rounded-xl px-[2%] bg-graymedium drop-shadow-xl rounded-t-xl border-graydark border-b-4 overflow-">
                    <div className="flex flex-col gap-[3vh] py-4 h-[85vh] w-[90vw] overflow-auto scrollbar-hide items-center">
                        {problem ? <ProblemSolver problems={[problem]} /> : null}
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default ContestantProblemPlayground
