import UserTrophies from "./UserTrophies";

export default interface UserStatistics {
    total_submissions: number,
    correct_submissions: number,
    trophies: UserTrophies[],
}
