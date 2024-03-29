import Problem from "./Problem";

export default interface ProblemSolverProps {
    problems: (Problem | any)[]
    competitionId?: string
    submitCode?: boolean
}
