interface ModifyProblem {
    name: string | undefined,
    points: number | undefined,
    description: string | undefined,
    runtimeLimit: number | undefined,
    exampleInput: string | undefined,
    exampleOutput: string | undefined,
    isPrivate: boolean | undefined,
    isHidden: boolean | undefined,
    testFiles?: any[],
}

export default ModifyProblem
