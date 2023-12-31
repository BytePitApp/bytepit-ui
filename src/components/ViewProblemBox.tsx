import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import { Problem } from '../Models'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faHourglassEnd, faLock, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons'
import { getCurrentUser } from '../services/users.service';


interface ProblemProps {
  problem: Problem;
}

const Attribute: React.FC<{icon: any, label: string, value: any}> = ({icon, label, value}) => (
    <div className="flex items-center">
        <FontAwesomeIcon icon={icon} className="mr-2 text-primary" />
        <p className="text-lg text-primary">{label}: {value}</p>
    </div>
)



const ViewProblemBox: React.FC<ProblemProps> = ({
    problem,
}) => {
    const formattedDate = new Date(problem.created_on).toLocaleDateString();
    const [organiserUsername, setOrganiserUsername] = React.useState<string>("")


    const fetchCreatorsUsername = async () => {
        const response = await getCurrentUser()
        const username = response.data.username
        setOrganiserUsername(username)
    }

    const getDifficulty = (points: number) => {
    if (points < 50) return 'Easy';
    if (points < 100) return 'Medium';
    return 'Hard';
    }

    

    useEffect(() => {
        fetchCreatorsUsername()
    }, [])

    return (
        <>
            <div className="p-8 m-4 bg-gray-100 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl text-primary font-bold mb-4">
                    {problem.name}
                    <span className={`ml-2 px-2 py-1 rounded text-white ${getDifficulty(problem.num_of_points) === 'Easy' ? 'bg-green-500' : getDifficulty(problem.num_of_points) === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {getDifficulty(problem.num_of_points)}
                    </span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 rounded transition-colors duration-200 hover:bg-gray-200">
                        <Attribute icon={faClock} label="Created On" value={formattedDate} />
                    </div>
                    <div className="p-2 rounded transition-colors duration-200 hover:bg-gray-200">
                        <Attribute icon={faHourglassEnd} label="Runtime Limit" value={problem.runtime_limit} />
                    </div>
                    <div className="p-2 rounded transition-colors duration-200 hover:bg-gray-200">
                        <Attribute icon={problem.is_hidden ? faLock : faEyeSlash} label="Hidden" value={problem.is_hidden ? 'True' : 'False'} />
                    </div>
                    <div className="p-2 rounded transition-colors duration-200 hover:bg-gray-200">
                        <Attribute icon={faUser} label="Created by" value={organiserUsername} />
                    </div>
                </div>
                <div className="mt-4 bg-white p-4 rounded shadow">
                    <h3 className="text-xl text-primary font-bold mb-2">Description</h3>
                    <p className="text-lg text-primary">{problem.description}</p>
                </div>
                <div className="mt-4 bg-white p-4 rounded shadow">
                    <h3 className="text-xl text-primary font-bold mb-2">Example Input</h3>
                    <p className="text-lg text-primary">{problem.example_input}</p>
                </div>
                <div className="mt-4 bg-white p-4 rounded shadow">
                    <h3 className="text-xl text-primary font-bold mb-2">Example Output</h3>
                    <p className="text-lg text-primary">{problem.example_output}</p>
                </div>
            </div>
        </>
    )
}

export default ViewProblemBox
