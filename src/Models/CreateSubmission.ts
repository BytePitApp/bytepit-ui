import { CodeEditorLanguages } from "./"

export default interface CreateSubmission {
    problemId: string
    sourceCode: string
    language: CodeEditorLanguages
    competitionId?: string
}
