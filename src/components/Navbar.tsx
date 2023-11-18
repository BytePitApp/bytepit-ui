import { DefaultUserImage } from "../assets"
import { useState } from "react"
import { Button } from "primereact/button"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "primereact/avatar"
import { logout } from "../services/login.service"

const Navbar = () => {
    const navigate = useNavigate()
    const { auth, updateAuth } = useAuth()
    const [openState, setOpenState] = useState(false)

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
            className="bg-graymedium border-b-4 border-graydark w-full 
            flex md:flex-row justify-between items-center h-16 rounded-b-lg px-32 drop-shadow-nav"
        >
            <Link
                className="bg-gray-30 text-primary font-major-mono text-4xl max-md:flex max-md:items-center max-md:justify-between max-md:w-full cursor-pointer hover:scale-[103%] transition-all ease-in-out duration-300"
                to={auth ? `/${auth["role"]}/home` : "/"}
            >
                BytePit
            </Link>
            <ul
                className="p-2 bg-graymedium w-full md:w-auto max-md:left-0 md:static absolute
                flex flex-col md:flex-row items-end md:items-center gap-2 md:h-full
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
                            <span className="text-lg">{auth["username"]}</span>
                        </li>
                        <VerticalLine />
                        <Button
                            label={auth ? "Logout" : "Register"}
                            className="text-white text-center font-bold text-l w-fit rounded-l py-2 px-4 hover:scale-[103%] bg-primary hover:bg-primarylight transition-all ease-in-out duration-300"
                            onClick={handleLogOut}
                        />
                    </>
                ) : (
                    <li className="flex flex-row items-center gap-2">
                        <Link to="/login" className="w-full text-center">
                            <Button className="py-2 text-white text-center font-bold text-lg rounded-md hover:scale-[103%] bg-primary hover:bg-primarylight transition-all ease-in-out duration-300">
                                Login
                            </Button>
                        </Link>
                        <VerticalLine />
                        <Link to="/register" className="w-full text-center">
                            <Button className="py-2 min-w-min text-white text-center font-bold text-lg rounded-m bg-secondary hover:bg-secondarylight hover:scale-[103%] border-secondarylight transition-all ease-in-out duration-300">
                                Register
                            </Button>
                        </Link>
                    </li>
                )}
                <li></li>
            </ul>
        </nav>
    )
}

export default Navbar
