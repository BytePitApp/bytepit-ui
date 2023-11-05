import { FormComponentSpecification } from "../../Models/Form"
import { TextInput } from "./FormComponents"

type FormProps = {
    props: FormComponentSpecification[]
    styleClass: string
}

const Form = ({ props, styleClass }: FormProps) => {
    return (
        <div className={styleClass}>
            {props.map((component: FormComponentSpecification) => {
                switch (component.type) {
                    case "text":
                        return (
                            <div key={component.key} className={`${styleClass} flex flex-col gap-4`}>
                                <div className="text-lg">{component.label}</div>
                                <TextInput {...component} />
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
