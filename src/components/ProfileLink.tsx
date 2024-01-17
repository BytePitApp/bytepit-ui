import { Link } from "react-router-dom"

const ProfileLink: React.FC<{ profileUrl: string; username: string }> = ({ profileUrl, username }) => (
    <Link to={profileUrl} className="text-primary font-semibold hover:underline hover:scale-105 duration-200 ease">
        {username}
    </Link>
)

export default ProfileLink
