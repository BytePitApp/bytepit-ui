import DefaultUserImg from '../assets/default_user.png'
import { useState } from 'react'

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [openState, setOpenState] = useState(false)

    return (
        <nav className="bg-gray-300 border-b-2 border-gray-400 w-full p-4
            flex md:flex-row justify-between items-center h-20">
            <div className="bg-gray-30 font-bold text-3xl max-md:flex max-md:items-center max-md:justify-between max-md:w-full">
                BytePit
                <svg onClick={() => setOpenState(!openState)} className="md:hidden svg-icon w-7 h-7" viewBox="0 0 20 20">
                    {!openState ? 
                        <path fill="black" d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314 c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743 s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314 c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"></path>
                    :
                        <path fill="black" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                    }
                </svg>
            </div>
            <ul className={`bg-gray-300 w-full md:w-auto max-md:left-0 md:static absolute
                flex flex-col md:flex-row items-end md:items-center gap-4 p-4
                transition-all duration-500 ease-in-out ${openState ? "top-20" : "-top-full"}`}>
                <li className="border-2 bg-cover rounded-full border-black w-10 h-10">
                    <img alt="default profile picture" src={DefaultUserImg} />
                </li>
                {isLoggedIn ?
                    <li className="flex flex-col">
                        <span className="text-lg">Name Surname</span>
                        <span className="text-sm">Admin</span>
                    </li>
                : 
                    <li onClick={() => setIsLoggedIn(true)} 
                        className="w-fit cursor-pointer transition-color ease-in-out duration-300
                            text-center text-black/70 hover:text-black font-bold text-xl">
                        Log In
                    </li>
                }
                <li className="cursor-pointer text-white text-center font-bol text-xl w-fit rounded-xl 
                        py-2 px-4 bg-blue-700 transition-color ease-in-out duration-300"
                    onClick={() => setIsLoggedIn(!isLoggedIn)}>
                        {isLoggedIn ? "Logout" : "Register"}
                </li>
            </ul>
        </nav>
    )
}

export default Navbar