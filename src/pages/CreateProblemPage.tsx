import { Navbar } from "../components"
import { useState, useRef, FormEvent, useEffect } from "react"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { CreateProblem } from "../Models"
import { createProblem } from "../services/problem.service"
import { Toast } from "primereact/toast"
import { RadioButton } from "primereact/radiobutton"
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber"
import { ToggleButton, ToggleButtonChangeEvent } from "primereact/togglebutton"

const CreateProblemPage = () => {
    const [selectedTestFiles, setSelectedTestFiles] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast>(null)

    const [formData, setFormData] = useState<CreateProblem>({
        name: "",
        description: "",
        points: 0,
        runtimeLimit: 0,
        exampleInput: "",
        exampleOutput: "",
        isPrivate: false,
        isHidden: false,
    })

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

    const navigateToHome = () => {
        window.location.href = "/organiser/home"
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            let files: any = undefined
            if (selectedTestFiles) {
                files = Array.from(selectedTestFiles)
            }
            const problem: CreateProblem = {
                name: formData.name,
                description: formData.description,
                points: formData.points,
                runtimeLimit: formData.runtimeLimit,
                exampleInput: formData.exampleInput,
                exampleOutput: formData.exampleOutput,
                isPrivate: formData.isPrivate,
                isHidden: formData.isHidden,
                testFiles: files,
            }
            await createProblem(problem)
            sendToast({
                severity: "success",
                summary: "Success!",
                detail: "Problem created successfully!",
                life: 10000,
            })
            setTimeout(() => {
                navigateToHome()
            }, 1000)
        } catch (err: any) {
            console.log(err)
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
                <form
                    onSubmit={submitForm}
                    className="mx-[5%] rounded-xl px-[5%] bg-graymedium drop-shadow-xl rounded-t-xl border-graydark border-b-4 overflow-hidden"
                >
                    <div className="flex flex-col gap-[3vh] h-[85vh] items-center overflow-y-auto scrollbar-hide">
                        <div className="m-[5%] flex flex-col gap-2 pt-20">
                            <span className="text-[4vh] text-center font-semibold text-primary mb-2">New problem</span>
                        </div>
                        <TextInput name="name" value={formData.name} label="Name" onUpdate={handleValueChange} />
                        <span className="p-float-label">
                            <InputTextarea
                                id="description"
                                className="w-[20rem] lg:w-[24rem] text-sm rounded-[1vh]"
                                autoResize
                                name="description"
                                value={formData.description}
                                rows={5}
                                cols={30}
                                onChange={handleValueChange}
                            />
                            <label htmlFor="description">Description</label>
                        </span>
                        <NumberInput
                            value={formData.points}
                            label="Points"
                            onValueChange={(value) => setFormData({ ...formData, points: value })}
                        />
                        <TimeInput
                            value={formData.runtimeLimit}
                            label="Runtime limit"
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    runtimeLimit: value,
                                })
                            }
                        />
                        <span className="p-float-label">
                            <InputTextarea
                                id="exampleInput"
                                className="w-[20rem] lg:w-[24rem] text-sm rounded-[1vh]"
                                autoResize
                                name="exampleInput"
                                value={formData.exampleInput}
                                rows={5}
                                cols={30}
                                onChange={handleValueChange}
                            />
                            <label htmlFor="description">Example Input</label>
                        </span>
                        <span className="p-float-label">
                            <InputTextarea
                                id="exampleOutput"
                                className="w-[20rem] lg:w-[24rem] text-sm rounded-[1vh]"
                                autoResize
                                name="exampleOutput"
                                value={formData.exampleOutput}
                                rows={5}
                                cols={30}
                                onChange={handleValueChange}
                            />
                            <label htmlFor="description">Example Output</label>
                        </span>
                        <div className="flex justify-center items-center flex-col space-y-4">
                            <div className="flex flex-col">
                                <span>Test files should have the following format:</span>
                                <code>{"{test_no}_in.txt, {test_no}_out.txt"}</code>
                                <span className="mt-4">Example:</span>
                                <code>{"1_in.txt, 1_out.txt"}</code>
                                <code>{"2_in.txt, 2_out.txt"}</code>
                            </div>
                            <div className="relative pointer-events-none">
                                <label
                                    htmlFor="testFiles"
                                    className="text-xs text-gray-800 text-center absolute top-1/2 -translate-y-1/2 left-0 w-1/2 flex items-center justify-center"
                                >
                                    Select Test Files:
                                </label>
                                <input
                                    id="testFiles"
                                    className="w-[20rem] lg:w-[24rem] pointer-events-none rounded-[1vh] file:w-1/2 block text-sm file:text-white/0 file:rounded-[1vh] file:bg-gray-300 file:hover:bg-gray-200 file:transition-all file:ease-in-out file:duration-300 file:border-none select-none file:cursor-pointer cursor-defualt file:text-gray-800 file:p-3 file:pointer-events-auto bg-gray-50 text-gray-600"
                                    type="file"
                                    multiple={true}
                                    onChange={(e: any) => setSelectedTestFiles(e.target.files)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:w-[24rem] gap-4 justify-between">
                            <ToggleButton
                                onLabel="Private"
                                offLabel="Public"
                                onIcon="pi pi-lock"
                                offIcon="pi pi-lock-open"
                                checked={formData.isPrivate}
                                onChange={(e: ToggleButtonChangeEvent) =>
                                    setFormData({ ...formData, isPrivate: e.value })
                                }
                                className="w-[8rem] py-2"
                            />
                            <ToggleButton
                                onLabel="Hidden"
                                offLabel="Visible"
                                onIcon="pi pi-eye-slash"
                                offIcon="pi pi-eye"
                                checked={formData.isHidden}
                                onChange={(e: ToggleButtonChangeEvent) =>
                                    setFormData({ ...formData, isHidden: e.value })
                                }
                                className="w-[8rem] py-2"
                            />
                        </div>
                        <div className="lg:w-[50rem]">
                            <div className="flex justify-between items-center mt-4 mb-8 px-2">
                                <Button
                                    label="Back"
                                    icon="pi pi-arrow-left"
                                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                    type="button"
                                    onClick={navigateToHome}
                                />
                                <Button
                                    label="Submit"
                                    icon="pi pi-check"
                                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                    type="submit"
                                />
                            </div>
                        </div>
                    </div>
                </form>
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

type NumberInputProps = {
    value: number
    label: string
    onValueChange: (value: number) => void
}

const TextInput = ({ name, value, label, onUpdate }: TextInputProps) => {
    return (
        <span className="p-float-label">
            <InputText
                name={name}
                value={value}
                onChange={(e) => onUpdate(e)}
                className="w-[20rem] lg:w-[24rem] text-sm rounded-[1vh]"
            />
            <label htmlFor="in">{label}</label>
        </span>
    )
}

const NumberInput = ({ value, label, onValueChange }: NumberInputProps) => {
    return (
        <span className="p-float-label">
            <InputNumber
                inputId="minmaxfraction"
                minFractionDigits={1}
                maxFractionDigits={1}
                value={value}
                onValueChange={(e: InputNumberValueChangeEvent) => {
                    onValueChange(e.value ? e.value : 0)
                }}
                mode="decimal"
                showButtons
                step={0.5}
                min={0}
                className="w-[20rem] lg:w-[24rem] text-sm rounded-[1vh]"
            />
            <label htmlFor="in">{label}</label>
        </span>
    )
}

const TimeInput = ({ value, label, onValueChange }: NumberInputProps) => {
    return (
        <span className="p-float-label">
            <InputNumber
                inputId="minmaxfraction"
                minFractionDigits={1}
                maxFractionDigits={1}
                value={value}
                onValueChange={(e: InputNumberValueChangeEvent) => {
                    onValueChange(e.value ? e.value : 0)
                }}
                suffix=" s"
                mode="decimal"
                showButtons
                step={0.5}
                min={0}
                className="w-[20rem] lg:w-[24rem] text-sm rounded-[1vh]"
            />
            <label htmlFor="in">{label}</label>
        </span>
    )
}

export default CreateProblemPage
