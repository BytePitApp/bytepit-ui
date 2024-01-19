export default interface Problem {
    id: string
    name: string
    example_input: string
    example_output: string
    is_hidden: boolean
    num_of_points: number
    runtime_limit: number
    description: string
    organiser_id: string
    is_private: boolean
    created_on: string

    organiser_username?: string
    organiser_image?: any
    created_on_date?: Date
}
