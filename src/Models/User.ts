export default interface User {
    id: string
    username: string
    email: string
    role: string
    name: string
    surname: string
    is_verified: boolean
    approved_by_admin: boolean
    image: any
}