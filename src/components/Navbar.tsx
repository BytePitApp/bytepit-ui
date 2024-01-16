import { Button } from "primereact/button"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "primereact/avatar"
import { logout } from "../services/login.service"
import { ProfileLink } from "../components"
import { Role } from "../Models"
import { FaGamepad } from "react-icons/fa"

const Navbar = () => {
    const navigate = useNavigate()
    const { auth, updateAuth } = useAuth()

    const handleLogOut = async () => {
        await logout()
        updateAuth()
        navigate("/login")
    }

    const VerticalLine = () => {
        return <div className="border-[0.1rem] border-graydark h-10 rounded-lg mx-1"></div>
    }

    return (
        <nav
            className="bg-graymedium border-b-4 border-graydark w-full flex md:flex-row
            justify-between items-center rounded-b-lg px-32 drop-shadow-nav sticky top-0 z-50"
        >
            <Link
                className="bg-gray-30 text-primary font-major-mono text-[6vh] max-md:flex max-md:items-center max-md:justify-between max-md:w-full cursor-pointer hover:scale-[103%] transition-all ease-in-out duration-300"
                to={auth ? `/${auth["role"]}/home` : "/"}
            >
                BytePit
            </Link>
            <ul
                className="p-[1vh] bg-graymedium w-full md:w-auto max-md:left-0 md:static absolute
                flex flex-row items-center gap-[1vw] justify-center
                transition-all duration-500 ease-in-out"
            >
                {auth ? (
                    <>
                        {auth.image ? (
                            <Avatar
                                className="transition-color ease-in-out duration-300 cursor-pointer hover:scale-105"
                                image={`data:image/jpeg;base64,${auth?.image}`}
                                size="large"
                                pt={{ image: { className: "rounded-lg object-cover" } }}
                            />
                        ) : (
                            <Avatar
                                className="bg-secondary text-white hover:scale-105 transition-color ease-in-out duration-300 cursor-pointer"
                                icon="pi pi-user"
                                size="large"
                            />
                        )}

                        {/* <img src={`data:image/jpeg;base64,${auth?.image}`}></img> */}
                        <li className="flex flex-col">
                            <ProfileLink profileUrl={`/${auth.role}/home`} username={auth.username} />
                        </li>

                        <VerticalLine />
                        <Button
                            label="Logout"
                            className="text-white text-center font-bold h-[5vh] text-[2vh] w-fit rounded-[0.5vh] hover:scale-[103%] bg-primary hover:bg-primarylight transition-all ease-in-out duration-300"
                            onClick={handleLogOut}
                        />
                    </>
                ) : (
                    <li className="flex flex-row items-center gap-2">
                        <Button
                            label="Login"
                            className="text-white text-center font-bold h-[5vh] text-[2vh] rounded-[0.5vh]
                            hover:scale-[103%] bg-primary hover:bg-primarylight transition-all ease-in-out duration-300"
                            onClick={() => navigate("/login")}
                        />
                        <VerticalLine />
                        <Button
                            label="Register"
                            className="text-white text-center font-bold h-[5vh] text-[2vh] rounded-[0.5vh]
                            bg-secondary hover:bg-secondarylight hover:scale-[103%] border-secondarylight transition-all ease-in-out duration-300"
                            onClick={() => navigate("/register")}
                        />
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Navbar
