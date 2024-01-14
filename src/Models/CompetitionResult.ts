import ProblemResult from "./ProblemResult";

export default interface CompetitionResult {
    user_id: string,
    username: string,
    total_points: number,
    problem_results: ProblemResult[],
}