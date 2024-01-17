import { UserInfo, Navbar, ProblemsTable, CompetitionsTable } from "../components";
import  useAuth  from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Competition, Problem } from "../Models";
import {getProblemsForOrganiser}  from "../services/problem.service";
import { useCallback } from "react";
import { getAllCompetitionsForOrganiser } from "../services/competition.service";

const OrganiserProfilePage = () => {
    const[loading, setLoading] = useState(true)
    const[problems, setProblems] = useState<Problem[]>([])
    const[competitions, setCompetitions] = useState<Competition[]>([])
    const { auth } = useAuth()

    const fetchProblems = useCallback(async (): Promise<void> => {
        try{
            setLoading(true)
            const response = await getProblemsForOrganiser(auth?.id)
            const problems: Problem[] = response.data
            setProblems(problems)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    const fetchCompetitions = useCallback(async (): Promise<void> => {
        try{
            setLoading(true)
            const response = await getAllCompetitionsForOrganiser(auth?.id)
            const competitions: Competition[] = response.data
            setCompetitions(competitions)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchProblems()
        fetchCompetitions()
    }, [])

    return(
    <div className="bg-form bg-cover min-h-screen flex flex-col items-center">
        <Navbar />
        <UserInfo auth={auth}/>
        <div className="table-container justify-center bg-white inline-block rounded">
            <h2 className="text-center text-[20px] font-bold">Problems Table</h2>
            <div style={{ padding: '30px' }}>
                <ProblemsTable/>
            </div>
        </div>
        <div className="table-container justify-center bg-white inline-block rounded m-[30px]">
            <h2 className="text-center text-[20px] font-bold">Competitions Table</h2>
            <div style={{ padding: '30px' }}>
                <CompetitionsTable/>
            </div>
        </div>
    </div>
)
}

export default OrganiserProfilePage;
