import { Problem } from "../Models"
import ProblemBox from "./ProblemBox"
interface ProblemListProps {
    problems: Problem[]

}

const ProblemList: React.FC<ProblemListProps> = ({
    problems,
}) => {

    return (
        <div className="inline-flex flex-row">
            {problems.map((problem, index) => {
                return (
                    <div key={index} style={{ width: '600px' }} className="flex items-center justify-center mx-[-30px]">
                        <ProblemBox problem={problem} />
                    </div>
                )
            })}
        </div>
    )
}

export default ProblemList
