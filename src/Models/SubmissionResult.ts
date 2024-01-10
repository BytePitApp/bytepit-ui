interface InccorectOutput {
    output: string
    expectedOutput: string
}

export default interface SubmissionResult {
    isCorrect: boolean
    isRuntimeOk: boolean
    hasImproved: boolean
    points: number
    incorrectOutputs: InccorectOutput[]
    exception: string | null
}
