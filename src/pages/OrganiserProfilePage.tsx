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
        <>
            <Navbar />
            <UserInfo auth={auth}/>
            <div className="table-container">
                <ProblemsTable/>
            </div>
            <div className="table-container">
            <CompetitionsTable/>
            </div>
        </>
    )
}

export default OrganiserProfilePage;
