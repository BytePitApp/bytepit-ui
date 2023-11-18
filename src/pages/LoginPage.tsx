import { useState, useRef, useEffect } from "react"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Link, useNavigate } from "react-router-dom"
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
            {loading && (
                <div className="z-50 absolute top-1.5 left-[50%]">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                </div>
            )}
            <Navbar />
            <div className="flex absolute right-0 py-10 px-6 z-30">
                <Toast ref={toast} />
            </div>
            <div className="bg-form bg-cover grow flex flex-row justify-center items-center">
                <div className="m-[5%] w-full lg:w-[60%] h-[60%] flex flex-row justify-center items-center drop-shadow-xl">
                    <div className="p-[5%] py-[10%] flex flex-col h-full gap-[2vh] w-full bg-graymedium rounded-[3%] lg:rounded-r-none  border-graydark border-b-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-[4vh] text-center font-bold text-primary">Login</span>
                            <span className="lg:hidden text-[2vh] text-center text-slate-950">
                                We hope you had a safe time away! <br /> Log in and jump to coding!
                            </span>
                        </div>
                        <span className="p-float-label text-[2vh] align-middle inline-block">
                            <InputText
                                name="username"
                                value={formData.username}
                                onChange={handleValueChange}
                                className="w-full text-[2vh] rounded-[1vh] h-[6vh]"
                            />
                            <label htmlFor="in">Username</label>
                        </span>
                        <span className="p-float-label flex items-center text-[2vh]">
                            <Password
                                name="password"
                                toggleMask
                                value={formData.password}
                                onChange={handleValueChange}
                                feedback={false}
                                className="w-full text-[2vh] rounded-[1vh]"
                                inputClassName="w-full text-[2vh] rounded-[1vh]"
                                pt={{
                                    showIcon: {
                                        className:
                                            "mb-2 hover:cursor-pointer hover:scale-[108%] transition-all ease-in-out duration-300",
                                    },
                                    hideIcon: {
                                        className:
                                            "mb-2 hover:cursor-pointer hover:scale-[108%] transition-all ease-in-out duration-300",
                                    },
                                }}
                            />
                            <label htmlFor="in">Password</label>
                        </span>
                        <div className="flex flex-col gap-[4vh] mt-[4vh]">
                            <Button
                                className="text-[2vh] rounded-[1vh] h-[6vh] hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                label="Submit"
                                onClick={submitForm}
                            />
                        </div>
                    </div>
                    <div className="p-[5%] hidden lg:flex flex-col w-full h-full justify-center items-center gap-[10%] bg-primary rounded-r-[3%] border-primarylight border-b-4">
                        <span className="text-[4vh] text-center font-bold text-white">Welcome back!</span>
                        <span className="text-[2vh] text-center text-white">
                            We hope you had a safe time away! <br /> Log in and start coding right away.
                        </span>
                        <Link to="/register" className="w-full text-center">
                            <Button
                                className="font-semibold text-[2vh] bg-graydark rounded-full text-primary mt-[1%] hover:bg-white hover:scale-[102%] transition-all ease-in-out duration-300"
                                size="small"
                                text
                            >
                                No account yet? Register now!
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
