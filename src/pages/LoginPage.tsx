import { useState, useRef } from "react"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { FormDataLogin } from "../Models"
import { Messages } from "primereact/messages"
import { useMountEffect } from "primereact/hooks"
import uuid from "react-uuid"

const LoginPage = () => {
    const [formData, setFormData] = useState<FormDataLogin>({
        username: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState<string>(uuid())
    const msgs = useRef<Messages>(null)

    useMountEffect(() => {
        msgs.current?.clear()
    })

    const navigate = useNavigate()

    const login = async () => {
        setLoading(true)
        try {
            if (formData.username === "" || formData.password === "") {
                msgs.current?.show({
                    id: id,
                    severity: "error",
                    summary: "Error!",
                    detail: "Please fill in all fields!",
                    closable: false,
                })
                setId(uuid())
                setLoading(false)
                return
            }
            const response = await axios.post(
                "http://localhost:8000/auth/login",
                new URLSearchParams({ username: formData.username, password: formData.password }),
                {
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                    },
                    withCredentials: true,
                }
            )
            navigate("/contestant/home")
        } catch (err: any) {
            setLoading(false)
            msgs.current?.show({
                id: id,
                severity: "error",
                summary: "Error!",
                detail: err.response.data.detail,
                closable: false,
            })
            setId(uuid())
        }
    }

    return (
        <div className="relative">
            <div className="flex absolute right-0 py-10 px-6 z-30">
                <Messages ref={msgs} />
            </div>
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="flex flex-col gap-10 w-1/3">
                    <span className="text-4xl">Login</span>
                    <span className="p-float-label">
                        <InputText
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({
                                    username: e.target.value,
                                    password: formData.password,
                                })
                            }
                            className="w-full"
                        />
                        <label htmlFor="in">Username</label>
                    </span>
                    <span className="p-float-label flex items-center">
                        <Password
                            toggleMask={true}
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    username: formData.username,
                                    password: e.target.value,
                                })
                            }
                            feedback={false}
                            className="w-full"
                            inputClassName="w-full"
                        />
                        <label htmlFor="in">Password</label>
                    </span>
                    <Button label="SUBMIT" onClick={login} />
                    {loading && <ProgressSpinner />}
                    <div className="flex justify-end">
                        <Button label="REGISTER" onClick={() => navigate("/register")} text raised />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
