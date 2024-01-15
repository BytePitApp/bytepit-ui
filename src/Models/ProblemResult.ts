export default interface ProblemResult {
    id: string
    problem_id: string
    competition_id: string
    user_id: string
    average_runtime: number
    is_correct: boolean
    num_of_points: number
    max_num_of_points: number
    source_code: string
    language: string
}