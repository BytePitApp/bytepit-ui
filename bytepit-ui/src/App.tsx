import { Form } from "./components/Form"
import { FormComponentSpecification, FormTypes } from "./Models/Form"
import { useState } from "react"

function App() {
    const [name, setName] = useState("")

    const formConfigurations: FormComponentSpecification[] = [
        {
            label: "Name",
            type: FormTypes.TEXT,
            key: "name",
            value: "",
            styleClass: "bg-gray-500 p-2 rounded-md",
            updateValue: setName,
            required: true,
            placeholder: "Enter your name",
        },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
            <Form props={formConfigurations} styleClass={""} />
            <p>{name}</p>
        </div>
    )
}

export default App
