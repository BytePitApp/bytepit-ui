import { FormComponentSpecification } from "../../Models/Form"
import { PasswordInput, TextInput } from "../"
import { FormTypes } from "../../Models/Form"

type FormProps = {
    props: FormComponentSpecification[]
    styleClass: string
}

const Form = ({ props, styleClass }: FormProps) => {
    return (
        <div className={styleClass}>
            {props.map((component: FormComponentSpecification) => {
                switch (component.type) {
                    case FormTypes.TEXT:
                        return (
                            <div key={component.key} className={`${styleClass} flex flex-col gap-4`}>
                                <div className="text-lg">{component.label}</div>
                                <TextInput {...component} />
                            </div>
                        )
                    case FormTypes.PASSWORD:
                        return (
                            <div key={component.key} className={`${styleClass} relative flex gap-4`}>
                                <div className="text-lg">{component.label}</div>
                                <PasswordInput {...component} />
                            </div>
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
}

export default Form
