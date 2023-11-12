import { DefaultUserImage, HamburgerMenuSvg, CloseMenuSvg } from '../assets'
import { useState } from 'react'
import { Button } from '../components'


const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [openState, setOpenState] = useState(false)

    return (
        <nav className="bg-gray-300 border-b-2 border-gray-400 w-full p-4
            flex md:flex-row justify-between items-center h-20">
            <div className="bg-gray-30 font-bold text-3xl max-md:flex max-md:items-center max-md:justify-between max-md:w-full">
                BytePit
                <span onClick={() => setOpenState(!openState)} className="md:hidden svg-icon w-7 h-7 text-xs">
                    {!openState ? <img alt="hamburger menu" src={HamburgerMenuSvg} /> : <img alt="close menu" src={CloseMenuSvg} /> }
                </span>
            </div>
            <ul className={`bg-gray-300 w-full md:w-auto max-md:left-0 md:static absolute
                flex flex-col md:flex-row items-end md:items-center gap-4 p-4
                transition-all duration-500 ease-in-out ${openState ? "top-20" : "-top-full"}`}>
                <li className="border-2 bg-cover rounded-full border-black w-10 h-10">
                    <img alt="default profile picture" src={DefaultUserImage} />
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
                <li>
                    <Button
                        label={isLoggedIn ? 'Logout' : 'Register'}
                        styleClass="cursor-pointer text-white text-center font-bold text-xl w-fit rounded-xl py-2 px-4 bg-blue-700 transition-color ease-in-out duration-300"
                        onClick={() => setIsLoggedIn(!isLoggedIn)}
                    />
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
