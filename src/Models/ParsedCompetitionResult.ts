export default interface ParsedCompetitionResult {
    user_id: string
    total_points: number
    [key: string]: number | string
}
