export default interface ModifyCompetition {
    name: string
    description: string
    startTime: string
    endTime: string
    problems: string[]
    firstPlaceTrophyImage: any | undefined
    secondPlaceTrophyImage: any | undefined
    thirdPlaceTrophyImage: any | undefined
}
