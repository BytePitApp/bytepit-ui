import { RegisterRole } from "."

interface FormDataRegister {
    username: string,
    email: string,
    password: string,
    name: string,
    surname: string,
    role: RegisterRole,
}

export default FormDataRegister
