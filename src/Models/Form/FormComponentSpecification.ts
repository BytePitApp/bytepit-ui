import { FormTypes } from "../Form"

export interface FormComponentSpecification {
    value: any
    label: string
    type: FormTypes
    key: string
    required: boolean
    styleClass: string
    updateValue: (value: any) => void
    placeholder?: string
    // add more optional properties if needed
}
