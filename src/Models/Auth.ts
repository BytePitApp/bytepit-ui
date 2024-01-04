import { Role } from "../Models"

export default interface Auth {
    id: string
    username: string
    role: Role
    image: string
}
