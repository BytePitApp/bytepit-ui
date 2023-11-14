import { Link } from "react-router-dom"

const LoginPage = () => {
    const login = async () => {
        const res = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            body: new URLSearchParams({
                username: "admin",
                password: "t",
            }),
            headers: {
                ContentType: "application/x-www-form-urlencoded",
            },
            credentials: "include",
        })
        const data = await res.json()
    }

    return (
        <>
            <div className="bg-red-400 p-2 w-fit cursor-pointer" onClick={login}>
                LOGIN
            </div>
            <div className="bg-red-400 p-2 w-fit cursor-pointer">
                <Link to="/admin/home">Go to Admin home</Link>
            </div>
        </>
    )
}

export default LoginPage
