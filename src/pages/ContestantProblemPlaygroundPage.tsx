import { Navbar } from "../components"
import { ContestantProblemPlayground } from "../components"

const ContestantProblemPlaygroundPage: React.FC = () => {
    return (
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <ContestantProblemPlayground />
        </div>
    )
}

export default ContestantProblemPlaygroundPage
