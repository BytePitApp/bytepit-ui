import { Avatar } from "primereact/avatar"
import { User } from "../Models"

interface UserInfoProps {
    auth: Auth | null
    user?: User
}

interface Auth {
    image?: string
    username?: string
}

const UserInfo = ({ auth, user }: UserInfoProps) => {
    return (
        <div className="flex justify-center items-center mb-4 gap-3">
            <div className="w-32 h-32 rounded-xl flex justify-center flex-col items-center bg-white border-b-4 border-graydark p-4 gap-2">
                <div className="flex justify-center items-center w-max h-max">
                    {auth?.image ? (
                        <Avatar
                            className="w-16 h-16 rounded-full bg-secondary text-white hover:scale-105 transition-color ease-in-out duration-300 cursor-pointer"
                            image={`data:image/jpeg;base64,${auth?.image}`}
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
                    <p>{auth?.username}</p>
                </div>
            </div>
            <div className="flex flex-col w-fit h-32 bg-white border-b-4 border-graydark rounded-xl p-4 gap-3">
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
            </div>
        </div>
    )
}

export default UserInfo
