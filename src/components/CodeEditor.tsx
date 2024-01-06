import { Editor } from "@monaco-editor/react"
import { useState, useCallback, useEffect } from "react"
import { Dropdown } from "primereact/dropdown"
import { CodeEditorTheme, CodeEditorLanguages, CodeEditorProps } from "../Models"

const CodeEditor: React.FC<CodeEditorProps> = ({ currentLanguage, currentAnswer, onAnswerChange }) => {
    const [theme, setTheme] = useState<CodeEditorTheme>(CodeEditorTheme.DARK)
    const [language, setLanguage] = useState<CodeEditorLanguages | null>(null)
    const [code, setCode] = useState<string>("")

    const setFirstLetterToUpperCase = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const handleThemeValueChange = (e: any) => {
        setTheme(e.value)
    }

    const handleLanguageValueChange = (e: any) => {
        setLanguage(e.value)
    }

    const themeTemplate = (option: string) => {
        return <div className="text-semibold">{setFirstLetterToUpperCase(option)}</div>
    }

    const selectedThemeTemplate = (option: string) => {
        return <div className="text-semibold">{setFirstLetterToUpperCase(option)}</div>
    }

    const languageTemplate = (option: string) => {
        return <div className="text-semibold">{option.toUpperCase()}</div>
    }

    const selectedLanguageTemplate = (option: string) => {
        if (option === null) return <div className="text-semibold">Select a Language</div>
        else return <div className="text-semibold">{option.toUpperCase()}</div>
    }

    useEffect(() => {
        setLanguage(currentLanguage)
    }, [currentLanguage])

    useEffect(() => {
        setCode(currentAnswer)
    }, [currentAnswer])

    return (
        <div className="h-full ml-4 pt-4">
            <div className="h-[10%] flex justify-between">
                <div className="flex w-full lg:w-1/5 flex-col items-start justify-center">
                    <span className="p-float-label w-full text-[2vh] flex justify-center items-center">
                        <Dropdown
                            value={theme}
                            onChange={handleThemeValueChange}
                            options={[CodeEditorTheme.DARK, CodeEditorTheme.LIGHT]}
                            placeholder="Select a Theme"
                            className="text-[2vh] w-full rounded-[1vh]"
                            itemTemplate={themeTemplate}
                            valueTemplate={selectedThemeTemplate}
                        />
                        <label htmlFor="in">Theme</label>
                    </span>
                </div>
                <div className="flex w-full lg:w-1/5 flex-col items-end justify-center">
                    <span className="p-float-label w-full text-[2vh]">
                        <Dropdown
                            value={language}
                            onChange={handleLanguageValueChange}
                            options={[
                                CodeEditorLanguages.C,
                                CodeEditorLanguages.CPP,
                                CodeEditorLanguages.JAVA,
                                CodeEditorLanguages.PYTHON,
                                CodeEditorLanguages.JAVASCRIPT,
                                CodeEditorLanguages.NODE,
                            ]}
                            placeholder="Select a Language"
                            className="text-[2vh] w-full rounded-[1vh]"
                            itemTemplate={languageTemplate}
                            valueTemplate={selectedLanguageTemplate}
                        />
                        <label htmlFor="in">Language</label>
                    </span>
                </div>
            </div>
            <div
                className={`${
                    theme === CodeEditorTheme.DARK ? "bg-vsdark border-vsdark" : "bg-white border-white"
                } p-2 rounded-lg border-2 h-[90%]`}>
                <Editor
                    height="100%"
                    options={{
                        autoDetectHighContrast: false,
                        minimap: {
                            maxColumn: 100,
                        },
                        lineNumbersMinChars: 0,
                        folding: true,
                        overviewRulerLanes: 0,
                        scrollbar: {
                            alwaysConsumeMouseWheel: false,
                        },
                        showUnused: true,
                    }}
                    theme={theme === CodeEditorTheme.DARK ? "vs-dark" : "vs"}
                    language={language ?? "plaintext"}
                    value={code}
                    onChange={(value) => {
                        onAnswerChange(value, language)
                    }}
                />
            </div>
        </div>
    )
}

export default CodeEditor
