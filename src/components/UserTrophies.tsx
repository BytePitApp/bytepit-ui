import { Avatar } from "primereact/avatar"
import { Button } from "primereact/button"
import React from "react"
import { useNavigate } from "react-router-dom"

interface Trophy {
    icon: string
    competition_id: string
    competition_name: string
    rank_in_competition?: number
}

interface UserTrophiesProps {
    trophies: Trophy[]
}

const UserTrophies: React.FC<UserTrophiesProps> = ({ trophies }) => {
    const navigate = useNavigate()

    trophies.sort((a, b) => (a.rank_in_competition ?? 0) - (b.rank_in_competition ?? 0))

    return (
        <div className="bg-white p-4 flex flex-col text-center gap-2 border-4 rounded-2xl">
            <div className="text-xl font-bold h-[6%]">Trophies</div>
            <div className="flex flex-col h-[80%] w-[25rem] mr-4">
                {trophies.length === 0 ? (
                    <div className="w-full h-full flex text-center items-center justify-center">No available trophies for this user.</div>
                ) : (
                    trophies.map((trophy, index) => (
                        <div
                            key={index}
                            className="w-full h-[3rem] m-2 flex align-middle items-center bg-gray-100 p-2 rounded-lg gap-2 relative">
                            <div className="text-lg font-semibold">{trophy.rank_in_competition}.</div>
                            <Avatar
                                className="transition-color ease-in-out duration-300 cursor-pointer hover:scale-105"
                                image={`data:image/jpeg;base64,${trophy.icon}`}
                                size="normal"
                                pt={{ image: { className: "rounded-lg h-full object-cover" } }}
                            />
                            <div className="ml-2 text-md">{trophy.competition_name}</div>
                            <Button
                                label={"Results"}
                                onClick={() => navigate(`/contestant/competition/${trophy.competition_id}`)}
                                className="py-1 px-3 text-md absolute right-2 text-primary hover:text-graymedium bg-graymedium hover:bg-primary transition-colors ease-in-out duration-150"
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default UserTrophies
