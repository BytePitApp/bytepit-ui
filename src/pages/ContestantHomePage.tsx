import { ContestantHomeCompetitionTable, Navbar } from "../components"

const ContestantHomePage: React.FC = () => {
    return (
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <ContestantHomeCompetitionTable />
        </div>
    )
}

export default ContestantHomePage
