import React, { useState, useRef, useEffect } from "react"
import { FormDataRegister, Role } from "../Models"
import { useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Dropdown } from "primereact/dropdown"
import useAuth from "../hooks/useAuth"
import { Toast } from "primereact/toast"
import { register } from "../services/login.service"

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
        role: "Contestant",
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

    const sendToast = (toastMessage: any) => {
        toast.current?.show(toastMessage)
    }

    const submitForm = async () => {
        setLoading(true)
        try {
            const role: Role = formData.role.toLowerCase() as Role
            await register(formData.email, formData.username, formData.password, formData.name, formData.surname, role)
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
                role: "Contestant",
            })
        } catch (err: any) {
            const errorMsg = err.response.status === 422 ? "Please fill in all fields!" : err.response.data.detail
            sendToast({
                severity: "error",
                summary: "Error!",
                detail: errorMsg,
            })
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
                <div className="flex flex-col gap-10 w-1/3">
                    <span className="text-4xl">Register</span>
                    <TextInput name="username" value={formData.username} label="Username" onUpdate={handleValueChange} />
                    <span className="p-float-label">
                        <Password
                            name="password"
                            toggleMask={true}
                            value={formData.password}
                            onChange={handleValueChange}
                            feedback={false}
                            className="w-full"
                            inputClassName="w-full min-w-[15rem]"
                        />
                        <label htmlFor="in">Password</label>
                    </span>
                    <TextInput name="name" value={formData.name} label="Name" onUpdate={handleValueChange} />
                    <TextInput name="surname" value={formData.surname} label="Surname" onUpdate={handleValueChange} />
                    <TextInput name="email" value={formData.email} label="Email" onUpdate={handleValueChange} />
                    <div className="flex justify-center">
                        <span className="p-float-label">
                            <Dropdown
                                name="role"
                                value={formData.role}
                                onChange={handleValueChange}
                                options={["Contestant", "Admin", "Organizer"]}
                                placeholder="Select a Role"
                                className="w-60"
                            />
                        </span>
                    </div>
                    <Button label="SUBMIT" onClick={submitForm} />
                    <div className="flex justify-end">
                        <Button label="SIGN IN" onClick={() => navigate("/login")} text raised />
                    </div>
                </div>
            </div>
        </>
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
