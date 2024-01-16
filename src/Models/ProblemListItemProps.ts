import { Problem } from "./"

export default interface ProblemListItemProps {
    problem: Problem
    isSelected: boolean
    addProblem: (problemId: string) => void
    removeProblem: (problemId: string) => void
}
