import { Problem } from "./"

export default interface ProblemPickerProps {
    problems: Problem[]
    selectedProblems: string[]
    addProblem: (problemId: string) => void
    removeProblem: (problemId: string) => void
}
