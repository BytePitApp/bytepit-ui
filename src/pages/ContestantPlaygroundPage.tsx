import { Navbar } from "../components"
import { PlaygroundProblemList } from "../components"

const ContestantPlaygroundPage: React.FC = () => {
    return (
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <PlaygroundProblemList />
        </div>
    )
}

export default ContestantPlaygroundPage
