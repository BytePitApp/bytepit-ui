import React from "react"
import CompetitionsTable from "./CompetitionsTable"
import ProblemsTable from "./ProblemsTable"

const OrganiserProfile: React.FC<{ id?: string }> = ({ id }) => {
    return (
        <>
            <ProblemsTable userId={id} />
            <CompetitionsTable userId={id} />
        </>
    )
}

export default OrganiserProfile
