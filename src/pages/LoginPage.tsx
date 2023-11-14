import { useState } from "react"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { FormDataLogin } from "../Models"

const LoginPage = () => {
    const [formData, setFormData] = useState<FormDataLogin>({
        username: "",
        password: ""
    })
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const login = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await axios.post("http://localhost:8000/auth/login",
                new URLSearchParams({ username: formData.username, password: formData.password }),
                {
                    headers: { 
                        ContentType: "application/x-www-form-urlencoded"
                    },
                    withCredentials: true,
                }
            )
            navigate("/contestant/home")
        } catch (err: any) {
            setLoading(false)
            setError(err.response.data.detail)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col gap-10 w-1/3">
                <span className="text-4xl">Login</span>
                <span className="p-float-label">
                    <InputText
                        value={formData.username} 
                        onChange={(e) => setFormData({
                            username: e.target.value,
                            password: formData.password,
                        })} 
                        className="w-full"
                    />
                    <label htmlFor="in">Username</label>
                </span>
                <span className="p-float-label flex items-center">
                    <Password 
                        toggleMask={true}
                        value={formData.password}
                        onChange={(e) => setFormData({
                            username: formData.username,
                            password: e.target.value,
                        })} 
                        feedback={false} 
                        className='w-full' 
                        inputClassName="w-full"
                    />
                    <label htmlFor="in">Password</label>
                </span>
                <Button label="Submit" onClick={login} />
                {loading && <ProgressSpinner />}
                {error !== "" &&
                    <span className="text-red-700 font-semibold text-clip">{error}</span>
                }
            </div>
        </div>
    )
}

export default LoginPage
