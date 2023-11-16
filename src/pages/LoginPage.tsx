import { useState, useRef } from "react"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { FormDataLogin } from "../Models"
import useAuth from "../hooks/useAuth"
import { login } from "../services/login.service"
import { Toast } from "primereact/toast"

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
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast>(null)

    const handleValueChange = (e: any) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const sendToast = (toastMessage: any) => {
        toast.current?.show(toastMessage)
    }

    const submitForm = async () => {
        setLoading(true)
        try {
            await login(formData.username, formData.password)
            await updateAuth()
            navigate("/contestant/home")
        } catch (err: any) {
            for (const error of err.response.data.errors) {
                sendToast({
                    severity: "error",
                    summary: "Error!",
                    detail: error,
                })
            }
        }
        setLoading(false)
    }

    return (
        <>
            {loading ? (
                <div className="z-30 h-full w-full bg-primarylight/10 absolute flex justify-start items-center p-6">
                    <ProgressSpinner />
                </div>
            ) : null}
            <div className="flex absolute right-0 py-10 px-6 z-30">
                <Toast ref={toast} />
            </div>
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="flex flex-col gap-10 w-1/3 relative">
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
                    <Button label="SUBMIT" onClick={submitForm} />
                    <div className="flex justify-end">
                        <Button label="REGISTER" onClick={() => navigate("/register")} text raised />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage
