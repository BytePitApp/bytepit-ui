import ProblemResult from "./ProblemResult";

export default interface CompetitionResult {
    user_id: string,
    user_name: string,
    user_surname: string,
    total_points: number,
    problem_results: ProblemResult[],
}