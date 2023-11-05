import React, { useState } from "react"
import { FormComponentSpecification } from "../../../Models/Form"

const TextInput = (props: FormComponentSpecification) => {
    const [value, setValue] = useState(props.value)

    const hnadleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        props.updateValue(event.target.value)
    }

    return (
        <input
            type="text"
            required={props.required}
            placeholder={props.placeholder}
            className={props.styleClass}
            value={value}
            onChange={hnadleChange}
        />
    )
}

export default TextInput