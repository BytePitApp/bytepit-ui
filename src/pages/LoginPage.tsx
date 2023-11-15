import { useState } from "react"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { FormDataLogin } from "../Models"
import useAuth from "../hooks/useAuth"
import { login } from "../services/login.service"

const LoginPage = () => {
    const navigate = useNavigate()
    const { auth, updateAuth } = useAuth()
    if (auth) {
        navigate(`/${auth.role}/home`)
    }
    const [formData, setFormData] = useState<FormDataLogin>({
        username: "",
        password: "",
    })
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const handleValueChange = (e: any) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const submitForm = async () => {
        setLoading(true)
        setError("")
        try {
            await login(formData.username, formData.password)
            await updateAuth()
            navigate("/contestant/home")
        } catch (err: any) {
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col gap-10 w-1/3">
                <span className="text-4xl">Login</span>
                <span className="p-float-label">
                    <InputText
                        name="username"
                        value={formData.username}
                        onChange={handleValueChange}
                        className="w-full"
                    />
                    <label htmlFor="in">Username</label>
                </span>
                <span className="p-float-label flex items-center">
                    <Password
                        name="password"
                        toggleMask={true}
                        value={formData.password}
                        onChange={handleValueChange}
                        feedback={false}
                        className="w-full"
                        inputClassName="w-full"
                    />
                    <label htmlFor="in">Password</label>
                </span>
                <Button label="Submit" onClick={submitForm} />
                {loading && <ProgressSpinner />}
                {error !== "" && <span className="text-red-700 font-semibold text-clip">{error}</span>}
            </div>
        </div>
    )
}

export default LoginPage
