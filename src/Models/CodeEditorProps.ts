import { CodeEditorLanguages } from "./"

export default interface CodeEditorProps {
    currentLanguage: CodeEditorLanguages | null
    currentAnswer: string
    onAnswerChange: (answer: string | undefined, language: CodeEditorLanguages | null) => void
}
