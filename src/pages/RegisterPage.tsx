import { useState, useRef, FormEvent } from "react"
import { FormDataRegister, RegisterRole } from "../Models"
import { Link, useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { FileUpload, FileUploadHandlerEvent, FileUploadSelectEvent, FileUploadUploadEvent } from "primereact/fileupload"
import { Password } from "primereact/password"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Dropdown } from "primereact/dropdown"
import useAuth from "../hooks/useAuth"
import { Toast } from "primereact/toast"
import { register } from "../services/login.service"
import { Navbar } from "../components"

const RegisterPage = () => {
    const [selectedImage, setSelectedImage] = useState<File>()

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
    const [success, setSuccess] = useState<boolean>(false)
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

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            await register(
                formData.email,
                formData.username,
                formData.password,
                formData.name,
                formData.surname,
                formData.role,
                selectedImage
            )
            await updateAuth()
            sendToast({
                severity: "success",
                summary: "Success!",
                detail: "Check your email for confirmation!",
                life: 10000,
            })
            setSuccess(true)
            setTimeout(() => {
                navigate("/login")
            }, 5000)
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

    const renderForm = () => {
        return (
            <form
                onSubmit={submitForm}
                className="lg:w-[60vw] mx-[5%] mt-[40vh] mb-[10vh] lg:my-0 gap-[2vh] flex flex-col rounded-xl p-[5%] bg-graymedium drop-shadow-xl rounded-t-xl border-graydark border-b-4"
            >
                <div className="m-[5%] flex flex-col gap-2">
                    <span className="text-[4vh] text-center font-semibold text-primary mb-2">Welcome to BytePit</span>
                    <span className="text-[2vh] text-center text-slate-950">
                        Please fill in the form below to create your account.
                    </span>
                </div>
                <div className="flex flex-col items-center w-full justify-center">
                    <span className="p-float-label text-[2vh] w-full lg:w-1/2">
                        <Dropdown
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleValueChange}
                            options={[RegisterRole.CONTESTANT, RegisterRole.ORGANISER]}
                            placeholder="Select a Role"
                            className="w-full text-[2vh] rounded-[1vh]"
                            itemTemplate={roleTemplate}
                            valueTemplate={selectedRoleTemplate}
                        />
                        <label htmlFor="in">Role</label>
                    </span>
                </div>
                <div className="flex flex-col lg:flex-row gap-[3vh] justify-between">
                    <div className="flex flex-col gap-[3vh] lg:w-[45%] lg:max-w-[45%]">
                        <TextInput name="email" value={formData.email} label="Email" onUpdate={handleValueChange} />
                        <TextInput
                            name="username"
                            value={formData.username}
                            label="Username"
                            onUpdate={handleValueChange}
                        />
                        <span className="p-float-label text-2[vh] w-full">
                            <Password
                                name="password"
                                toggleMask
                                value={formData.password}
                                onChange={handleValueChange}
                                feedback
                                className="w-full"
                                inputClassName="text-[2vh] rounded-[1vh] w-full"
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
                    </div>
                    <div className="flex flex-col gap-[3vh] lg:w-[45%] lg:max-w-[45%]">
                        <TextInput name="name" value={formData.name} label="Name" onUpdate={handleValueChange} />
                        <TextInput
                            name="surname"
                            value={formData.surname}
                            label="Surname"
                            onUpdate={handleValueChange}
                        />
                        <FileUpload
                            name="image"
                            accept="image/*"
                            maxFileSize={1000000}
                            pt={{
                                basicButton: {
                                    className: "w-full text-[2vh] bg-white text-primary",
                                },
                                label: {
                                    className: "truncate ",
                                },
                            }}
                            chooseLabel="Upload a picture"
                            mode="basic"
                            customUpload
                            onSelect={(e: FileUploadSelectEvent) => {
                                setSelectedImage(e.files[0])
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-[4vh] justify-center items-center">
                    <Button
                        className="w-full hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                        label="Submit"
                        type="submit"
                    />
                    <span className="text-[2vh] text-center text-slate-950">
                        Already have an account on BytePit?{" "}
                        <Link to="/login" className="text-primary font-semibold">
                            Login
                        </Link>
                    </span>
                </div>
            </form>
        )
    }

    const renderSuccessMessage = () => {
        return (
            <div className="text-center">
                <h5 className="font-bold text-[4vh] text-black">Registration successful!</h5>
                <p className="font-semibold text-[1.5vh]">Please check your email for confirmation!</p>
            </div>
        )
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
                {success ? renderSuccessMessage() : renderForm()}
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
            <InputText
                name={name}
                value={value}
                onChange={(e) => onUpdate(e)}
                className="w-full text-[2vh] rounded-[1vh]"
            />
            <label htmlFor="in">{label}</label>
        </span>
    )
}

export default RegisterPage
