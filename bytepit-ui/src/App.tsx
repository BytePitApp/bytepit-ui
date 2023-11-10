import { Navbar } from "./components"
import { Form } from "./components/Form"
import { FormComponentSpecification, FormTypes } from "./Models/Form"
import { useState } from "react"
import { Footer } from "./components"

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
        <div className="static">
            <Navbar />
            <Form props={formConfigurations} styleClass={""} />
            <p>{name}</p>
            <div className="absolute bottom-0 bg-gray-400 w-full">
                <Footer />
            </div>
        </div>
    )
}

export default App
