import { Problem } from "."

export default interface ProblemListItemProps {
    problem: Problem
    selectedProblems: string[]
    addProblem: (problemId: string) => void
    removeProblem: (problemId: string) => void
}