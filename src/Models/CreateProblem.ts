interface CreateProblem {
    name: string,
    points: number,
    description: string,
    runtimeLimit: number,
    exampleInput: string,
    exampleOutput: string,
    isPrivate: boolean,
    isHidden: boolean,
    testFiles?: any[],
}

export default CreateProblem
