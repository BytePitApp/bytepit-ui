import { Avatar } from "primereact/avatar"
import { User } from "../Models"
import { useCallback, useEffect, useState } from "react"
import { getUserById } from "../services/users.service"
import { ProgressSpinner } from "primereact/progressspinner"

interface UserInfoProps {
    userId?: string
}

const UserInfo = ({ userId }: UserInfoProps) => {
    const [loading, setLoading] = useState(true)

    const [user, setUser] = useState<User>()
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getUserById(userId)
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
        <div className="flex justify-center items-center mb-4 gap-3">
            <div className="h-32 rounded-xl flex justify-center flex-col items-center bg-white border-b-4 border-graydark p-4 gap-2">
                {loading ? (
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                ) : (
                    <>
                        <div className="flex justify-center items-center w-max h-max">
                            {user?.image ? (
                                <Avatar
                                    className="w-16 h-16 rounded-full bg-secondary text-white hover:scale-105 transition-color ease-in-out duration-300 cursor-pointer"
                                    image={`data:image/jpeg;base64,${user?.image}`}
                                    size="large"
                                    pt={{ image: { className: "rounded-lg object-cover" } }}
                                />
                            ) : (
                                <Avatar
                                    className="w-16 h-16 rounded-full bg-secondary text-white hover:scale-105 transition-color ease-in-out duration-300 cursor-pointer"
                                    template={<i className="pi pi-user text-4xl"></i>}
                                    size="large"
                                />
                            )}
                        </div>
                        <div className="font-bold">
                            <p>{user?.username}</p>
                        </div>
                    </>
                )}
            </div>
            <div className="flex flex-col w-fit h-32 bg-white border-b-4 border-graydark rounded-xl p-4 gap-3">
                {loading ? (
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                ) : (
                    <>
                        <div className="text-lg font-semibold flex items-center gap-4 text-primary">
                            <i className="pi pi-id-card text-primary" />
                            {user?.name} {user?.surname}
                        </div>
                        <div className="text-sm flex items-center gap-4">
                            <i className="pi pi-inbox text-sm" />
                            {user?.email}{" "}
                        </div>
                        <div className="text-sm flex items-center gap-4">
                            <i className="pi pi-user text-sm" />
                            {user?.role[0].toUpperCase()}
                            {user?.role.slice(1)}{" "}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default UserInfo
