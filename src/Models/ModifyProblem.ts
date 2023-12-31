interface ModifyProblem {
    name: string | undefined,
    description: string | undefined,
    points: number | undefined,
    runtimeLimit: number | undefined,
    exampleInput: string | undefined,
    exampleOutput: string | undefined,
    isPrivate: boolean | undefined,
    isHidden: boolean | undefined,
    testFiles?: any[],
}

export default ModifyProblem
