import { Problem } from "../Models"
import ProblemBox from "./ProblemBox"
interface ProblemListProps {
    problems: Problem[]
}

const ProblemList: React.FC<ProblemListProps> = ({ problems }) => {
    return problems.map((problem, index) => {
        return <ProblemBox problem={problem} />
    })
}

export default ProblemList
