export default interface ModifyCompetition {
    name: string | undefined,
    description: string | undefined,
    startTime: string | undefined,
    endTime: string | undefined,
    problems: string[],
    firstPlaceTrophyImage: any | undefined,
    secondPlaceTrophyImage: any | undefined,
    thirdPlaceTrophyImage: any | undefined
}
