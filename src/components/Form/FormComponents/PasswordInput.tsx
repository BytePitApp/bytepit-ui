import React, { useState } from "react"
import { FormComponentSpecification } from "../../../Models/Form"

const PasswordInput = (props: FormComponentSpecification) => {
    const [value, setValue] = useState(props.value)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        props.updateValue(event.target.value)
    }

    return (
        <>
            <input
                type={showPassword ? "text" : "password"}
                required={props.required}
                placeholder={props.placeholder}
                className={props.styleClass}
                value={value}
                onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 bottom-2 cursor-pointer">
                <i className={`pi ${showPassword ? "pi-lock-open" : "pi-lock"}`} style={{ fontSize: '1rem' }}></i>
            </span>
        </>
    )
}

export default PasswordInput
