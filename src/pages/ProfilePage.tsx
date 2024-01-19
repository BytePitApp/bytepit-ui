import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { User } from "../Models"
import { getUserByUsername } from "../services/users.service"
import { Navbar, UserInfo, ContestantProfile, OrganiserProfile } from "../components"

const ProfilePage = () => {
    const { username } = useParams<{ username: string }>()
    const [loading, setLoading] = useState(true)

    const [user, setUser] = useState<User>()
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getUserByUsername(username)
            setUser(response.data)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    return (
        <div className="bg-form bg-cover min-h-screen pb-4">
            <Navbar />
            <div className="m-10 bg-graymedium px-[5%] rounded-xl flex flex-col py-8 border-b-4 border-graydark">
                <UserInfo user={user} loading={loading} />
                {user &&
                    (user?.role === "contestant" ? (
                        <ContestantProfile id={user.id} />
                    ) : (
                        <OrganiserProfile id={user.id} />
                    ))}
            </div>
        </div>
    )
}

export default ProfilePage
