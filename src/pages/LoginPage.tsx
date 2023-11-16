import { useState, useRef, useEffect } from "react"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { FormDataLogin } from "../Models"
import useAuth from "../hooks/useAuth"
import { login } from "../services/login.service"
import { Toast } from "primereact/toast"
import { Navbar } from "../components"

const LoginPage = () => {
    const navigate = useNavigate()
    const { auth, updateAuth } = useAuth()
    const [formData, setFormData] = useState<FormDataLogin>({
        username: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast>(null)

    useEffect(() => {
        if (auth) {
            navigate(`/${auth.role}/home`)
        }
    }, [auth])

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
        } catch (err: any) {
            if (Array.isArray(err.response.data.detail)) {
                for (const error of err.response.data.detail) {
                    sendToast({
                        severity: "error",
                        summary: "Error!",
                        detail: error,
                    })
                }
            } else {
                sendToast({
                    severity: "error",
                    summary: "Error!",
                    detail: err.response.data.detail,
                })
            }
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col h-screen justify-center">
            {loading ? (
                <div className="z-30 h-full w-full bg-primarylight/10 absolute flex justify-start items-center p-6">
                    <ProgressSpinner />
                </div>
            ) : null}
            <Navbar />
            <div className="flex absolute right-0 py-10 px-6 z-30">
                <Toast ref={toast} />
            </div>
            <div className="bg-form bg-cover grow flex flex-col justify-center items-center">
                <div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex mb-6 2xl:mb-16 drop-shadow-xl rounded-xl">
                            <div className="flex-grow flex flex-col gap-10 w-[32rem] h-[30rem] p-16 bg-graymedium rounded-l-xl border-graydark border-b-4">
                                <span className="text-4xl text-center font-semibold text-primary">Login</span>
                                <span className="p-float-label">
                                    <InputText name="username" value={formData.username} onChange={handleValueChange} className="w-full" />
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
                                <Button
                                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                    label="Submit"
                                    onClick={submitForm}
                                />
                            </div>
                            <div className="flex-grow flex flex-col justify-center items-center gap-4 bg- w-[32rem] h-[30rem] bg-primary rounded-r-xl border-primarylight border-b-4">
                                <span className="text-2xl text-center font-semibold text-white">Welcome back!</span>
                                <span className="text-lg text-center text-white px-6">
                                    Welcome back! We hope you had a safe and enjoyable time away! <br /> Create your account and start
                                    coding right now!
                                </span>
                                <Button
                                    className="bg-graydark rounded-3xl text-primary mt-1 hover:bg-white hover:scale-[102%] transition-all ease-in-out duration-300"
                                    label="No account yet? Register now!"
                                    size="small"
                                    onClick={() => navigate("/register")}
                                    text
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
