import React from "react"
import Editor from "@monaco-editor/react"
import {Stack} from "@mui/material"
import CodeEditorToolbar from "../CodeEditorToolbar"
import MonacoThemes from "../../util/MonacoThemes"
import {editor} from "monaco-editor"

const MAX_FONT_SIZE = 48
const MIN_FONT_SIZE = 8

export default function CodeEditor() {
    const themeNames = Object.keys(MonacoThemes)
    const themes = Object.values(MonacoThemes)

    const [theme, setTheme] = React.useState(themeNames[0])

    const [fontSize, setFontSize] = React.useState(16)
    const [minFontSizeReached, setMinFontSizeReached] = React.useState(false)
    const [maxFontSizeReached, setMaxFontSizeReached] = React.useState(false)

    const handleFontSizeChange = React.useCallback((increase = true) => {
        if (increase && !maxFontSizeReached) {
            setFontSize(prev => prev + 1)
            setMinFontSizeReached(false)
            setMaxFontSizeReached(fontSize === MAX_FONT_SIZE)
        } else if (!increase && !minFontSizeReached) {
            setFontSize(prev => prev - 1)
            setMaxFontSizeReached(false)
            setMinFontSizeReached(fontSize === MIN_FONT_SIZE)
        }
    }, [fontSize, minFontSizeReached, maxFontSizeReached])

    const handleKeyboardZoom = React.useCallback((e: KeyboardEvent) => {
        if (!e.ctrlKey && !e.metaKey) return

        if (["=", "+"].includes(e.key)) {
            e.preventDefault()
            handleFontSizeChange()
        } else if (e.key === "-") {
            e.preventDefault()
            handleFontSizeChange(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyboardZoom)
        return () => document.removeEventListener("keydown", handleKeyboardZoom)
    }, [handleKeyboardZoom])

    return <Stack height="100%" direction="column">
        <CodeEditorToolbar
            minFontSizeReached={minFontSizeReached}
            maxFontSizeReached={maxFontSizeReached}
            onFontSizeDecrease={() => handleFontSizeChange(false)}
            onFontSizeIncrease={() => handleFontSizeChange()}
            theme={theme}
            setTheme={setTheme}
        />
        <Editor
            options={{
                fontSize: fontSize,
                theme: theme
            }}
            onMount={(_editor, monaco) => {
                themes.forEach((theme, index) => {
                    monaco.editor.defineTheme(themeNames[index], theme as editor.IStandaloneThemeData)
                })
                monaco.editor.setTheme(themeNames[0])
                monaco.editor.EditorOptions.fontSize.defaultValue = 16
            }}
            theme="vs-dark"
            defaultLanguage="mips"/>
    </Stack>
}