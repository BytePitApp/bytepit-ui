import { Navbar } from "./components"
import { Form } from "./components/Form"
import { FormComponentSpecification, FormTypes } from "./Models/Form"
import { useState } from "react"
import { Footer } from "./components"
import { Button } from "primereact/button"

import "./global.css"

// primereact has to be added last, otherwise it won't work
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primeicons/primeicons.css"
import "primereact/resources/primereact.css"
import "./App.css"

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
            <Button label="Click" className="mt-4"/>
            <div className="absolute bottom-0 bg-gray-400 w-full">
                <Footer />
            </div>
        </div>
    )
}

export default App
