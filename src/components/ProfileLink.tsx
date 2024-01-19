import { Link } from "react-router-dom"

const ProfileLink: React.FC<{ username: string }> = ({ username }) => (
    <Link
        to={`/profile/${username}`}
        className="text-primary font-semibold hover:underline hover:scale-105 duration-200 ease"
    >
        {username}
    </Link>
)

export default ProfileLink
