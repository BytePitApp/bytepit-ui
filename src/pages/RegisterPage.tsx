import React, { useEffect, useState, useRef } from "react"
import { FormDataRegister, Role } from "../Models"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Dropdown } from "primereact/dropdown"
import { Messages } from "primereact/messages"
import { useMountEffect } from "primereact/hooks"
import uuid from "react-uuid"

const RegisterPage = () => {
    const [formData, setFormData] = useState<FormDataRegister>({
        username: "",
        password: "",
        email: "",
        name: "",
        surname: "",
        role: "Contestant",
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [id, setId] = useState<string>(uuid())

    const msgs = useRef<Messages>(null)

    useMountEffect(() => {
        msgs.current?.clear()
    })

    const register = async () => {
        if (
            formData.username === "" ||
            formData.password === "" ||
            formData.email === "" ||
            formData.name === "" ||
            formData.surname === ""
        ) {
            msgs.current?.show({
                id: id,
                severity: "error",
                summary: "Error!",
                detail: "Please fill in all fields!",
                closable: false,
            })
            setId(uuid())
            return
        }
        setLoading(true)
        try {
            const response = await axios.post(
                "http://localhost:8000/auth/register",
                new URLSearchParams({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    name: formData.name,
                    surname: formData.surname,
                    role: formData.role.toLowerCase(),
                }),
                {
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                    },
                    withCredentials: true,
                }
            )
            msgs.current?.show({
                id: id,
                severity: "success",
                summary: "Success!",
                detail: "Check your email for confirmation!",
                closable: false,
            })
            setFormData({
                username: "",
                password: "",
                email: "",
                name: "",
                surname: "",
                role: "Contestant",
            })
            setId(uuid())
            setLoading(false)
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

    useEffect(() => {
        console.log(formData)
    }, [formData])

    const navigate = useNavigate()

    return (
        <div className="relative">
            <div className="flex absolute right-0 py-10 px-6 z-30">
                <Messages ref={msgs} />
            </div>
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="flex flex-col gap-10 w-1/3">
                    <span className="text-4xl">Register</span>
                    <TextInput
                        value={formData.username}
                        label="Username"
                        onUpdate={(value) => setFormData({ ...formData, username: value })}
                    />
                    <span className="p-float-label">
                        <Password
                            toggleMask={true}
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            feedback={false}
                            className="w-full"
                            inputClassName="w-full min-w-[15rem]"
                        />
                        <label htmlFor="in">Password</label>
                    </span>
                    <TextInput value={formData.name} label="Name" onUpdate={(value) => setFormData({ ...formData, name: value })} />
                    <TextInput
                        value={formData.surname}
                        label="Surname"
                        onUpdate={(value) => setFormData({ ...formData, surname: value })}
                    />
                    <TextInput value={formData.email} label="Email" onUpdate={(value) => setFormData({ ...formData, email: value })} />
                    <div className="flex justify-center">
                        <span className="p-float-label">
                            <Dropdown
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({
                                        username: formData.username,
                                        password: formData.password,
                                        name: formData.name,
                                        surname: formData.surname,
                                        email: formData.email,
                                        role: e.value,
                                    })
                                }
                                options={["Contestant", "Admin", "Organizer"]}
                                placeholder="Select a Role"
                                className="w-60"
                            />
                        </span>
                    </div>
                    <Button label="SUBMIT" onClick={register} />
                    <div className="flex justify-end">
                        <Button label="SIGN IN" onClick={() => navigate("/login")} text raised />
                    </div>
                    {loading && <ProgressSpinner />}
                </div>
            </div>
        </div>
    )
}

type TextInputProps = {
    value: string
    label: string
    onUpdate: (value: string) => void
}

const TextInput = ({ value, label, onUpdate }: TextInputProps) => {
    return (
        <span className="p-float-label">
            <InputText value={value} onChange={(e) => onUpdate(e.target.value)} className="w-full min-w-[15rem]" />
            <label htmlFor="in">{label}</label>
        </span>
    )
}

export default RegisterPage
