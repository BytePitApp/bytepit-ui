import React, { useState, useRef } from "react"
import { FormDataRegister, RegisterRole } from "../Models"
import { useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Dropdown } from "primereact/dropdown"
import useAuth from "../hooks/useAuth"
import { Toast } from "primereact/toast"
import { register } from "../services/login.service"
import { Navbar } from "../components"

const RegisterPage = () => {
    const navigate = useNavigate()
    const { auth, updateAuth } = useAuth()
    if (auth) {
        navigate(`/${auth.role}/home`)
    }
    const [formData, setFormData] = useState<FormDataRegister>({
        username: "",
        password: "",
        email: "",
        name: "",
        surname: "",
        role: RegisterRole.CONTESTANT,
    })
    const [loading, setLoading] = useState<boolean>(false)
    const toast = useRef<Toast>(null)

    const handleValueChange = (e: any) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const setFirstLetterToUpperCase = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const sendToast = (toastMessage: any) => {
        toast.current?.show(toastMessage)
    }

    const submitForm = async () => {
        setLoading(true)
        try {
            await register(formData.email, formData.username, formData.password, formData.name, formData.surname, formData.role)
            await updateAuth()
            sendToast({
                severity: "success",
                summary: "Success!",
                detail: "Check your email for confirmation!",
                life: 10000,
            })
            setFormData({
                username: "",
                password: "",
                email: "",
                name: "",
                surname: "",
                role: RegisterRole.CONTESTANT,
            })
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

    const roleTemplate = (option: string) => {
        return <div className="text-semibold">{setFirstLetterToUpperCase(option)}</div>
    }

    const selectedRoleTemplate = (option: string) => {
        return <div className="text-semibold">{setFirstLetterToUpperCase(option)}</div>
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
            <div className="bg-form bg-cover grow flex flex-col justify-center items-center">
                <div className="flex flex-col rounded-xl gap-6 w-[30rem] p-8 bg-graymedium drop-shadow-xl rounded-t-xl border-graydark border-b-4">
                    <span className="text-4xl text-center font-semibold text-primary my-3">Register</span>
                    <TextInput name="username" value={formData.username} label="Username" onUpdate={handleValueChange} />
                    <span className="p-float-label">
                        <Password
                            name="password"
                            toggleMask
                            value={formData.password}
                            onChange={handleValueChange}
                            feedback
                            className="w-full"
                            inputClassName="w-full min-w-[15rem]"
                            pt={{
                                showIcon: {
                                    className: "mb-2 hover:cursor-pointer hover:scale-[108%] transition-all ease-in-out duration-300",
                                },
                                hideIcon: {
                                    className: "mb-2 hover:cursor-pointer hover:scale-[108%] transition-all ease-in-out duration-300",
                                },
                            }}
                        />
                        <label htmlFor="in">Password</label>
                    </span>
                    <TextInput name="name" value={formData.name} label="Name" onUpdate={handleValueChange} />
                    <TextInput name="surname" value={formData.surname} label="Surname" onUpdate={handleValueChange} />
                    <TextInput name="email" value={formData.email} label="Email" onUpdate={handleValueChange} />
                    <div className="flex flex-row justify-end">
                        <span className="flex text-center items-center text-slate-700">Choose your role</span>
                        <span className="p-float-label ml-6">
                            <Dropdown
                                name="role"
                                value={formData.role}
                                onChange={handleValueChange}
                                options={[RegisterRole.CONTESTANT, RegisterRole.ORGANISER]}
                                placeholder="Select a Role"
                                className="w-60"
                                itemTemplate={roleTemplate}
                                valueTemplate={selectedRoleTemplate}
                            />
                        </span>
                    </div>
                    <div className="flex flex-row gap-4">
                        <Button
                            className="w-full hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                            label="Submit"
                            onClick={submitForm}
                        />
                        <div>
                            <Button
                                className="w-full hover:scale-[104%] transition-all ease-in-out duration-300 bg-secondary hover:bg-secondarylight text-white"
                                label="Login"
                                onClick={() => navigate("/login")}
                                text
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

type TextInputProps = {
    name: string
    value: string
    label: string
    onUpdate: (value: any) => void
}

const TextInput = ({ name, value, label, onUpdate }: TextInputProps) => {
    return (
        <span className="p-float-label">
            <InputText name={name} value={value} onChange={(e) => onUpdate(e)} className="w-full min-w-[15rem]" />
            <label htmlFor="in">{label}</label>
        </span>
    )
}

export default RegisterPage
