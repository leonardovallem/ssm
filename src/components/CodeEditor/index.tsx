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
                monaco.languages.registerCompletionItemProvider("mips", {
                    // @ts-ignore
                    provideCompletionItems: () => {
                        const suggestions = [
                            {
                                label: "addi",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "add immediate",
                                insertText: "addi $, $, 0\t\t\t# $1 = $2 + 0\n"
                            },
                            {
                                label: "add",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "add",
                                insertText: "add $, $, $\t\t# $1 = $2 + $3\n"
                            },
                            {
                                label: "and",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "and",
                                insertText: "and $, $, $\t\t# $1 = $2 & $3\n"
                            },
                            {
                                label: "andi",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "and immediate",
                                insertText: "andi $, $, 0\t\t\t# $1 = $2 & 0\n"
                            },
                            {
                                label: "beq",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "branch if equal",
                                insertText: "beq $, $, \t# if $1 == $2 then label\n"
                            },
                            {
                                label: "bge",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "branch if greater then or equal",
                                insertText: "bge $, $, \t# if $1 >= $2 then label\n"
                            },
                            {
                                label: "bgt",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "branch if greater then",
                                insertText: "bgt $, $, \t# if $1 > $2 then label\n"
                            },
                            {
                                label: "ble",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "branch if less then or equal",
                                insertText: "ble $, $, \t# if $1 <= $2 then $3\n"
                            },
                            {
                                label: "blt",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "branch if less then",
                                insertText: "blt $, $, \t# if $1 < $2 then label\n"
                            },
                            {
                                label: "bne",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "branch if not equal",
                                insertText: "bne $, $, \t# if $1 != $2 then label\n"
                            },
                            {
                                label: "b",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "branch uncodnitional",
                                insertText: "b \t\t\t# branch to label\n"
                            },
                            {
                                label: "div",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "divide",
                                insertText: "div $, $\t\t\t# $1 / $2\nmflo $\t\t\t\t# $3 = floor($1 / $2) \nmfhi $\t\t\t\t# $4 = $1 mod $2 \n"
                            },
                            {
                                label: "jal",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "jump and link",
                                insertText: "jal \t\t\t\t# jump to label and save position to \\$ra\n"
                            },
                            {
                                label: "jr",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "jump register",
                                insertText: "jr $ra\t\t\t\t\t# jump to $ra\n"
                            },
                            {
                                label: "j",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "jump",
                                insertText: "j label\t\t\t\t# jump to label\n"
                            },
                            {
                                label: "la",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "load address",
                                insertText: "la $, $\t\t# \n"
                            },
                            {
                                label: "lb",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "load byte",
                                insertText: "lb $, 0($)}\t\t# \n"
                            },
                            {
                                label: "li",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "load immediate",
                                insertText: "li $, 0\t\t# $1 = 0\n"
                            },
                            {
                                label: "lw",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "load word",
                                insertText: "lw $, 0($)\t\t# \n"
                            },
                            {
                                label: "move",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "move",
                                insertText: "move \t$, $\t\t# $1 = $2"
                            },
                            {
                                label: "mult",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "multiply",
                                insertText: "mult $, $\t\t\t# $1 * $2 = Hi and Lo registers\nmflo $\t\t\t\t# copy Lo to $3\n"
                            },
                            {
                                label: "nor",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "nor",
                                insertText: "nor $, $, $\t\t# $1 = ~($2 | $3)\n"
                            },
                            {
                                label: "or",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "or",
                                insertText: "or $, $, $\t\t# $1 = $2 | $3\n"
                            },
                            {
                                label: "ori",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "or immediate",
                                insertText: "ori $, $, 0\t\t\t# $1 = $2 | 0\n"
                            },
                            {
                                label: "sb",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "store byte",
                                insertText: "sb $, 0($)\t\t# \n"
                            },
                            {
                                label: "sll",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "shift left",
                                insertText: "sll $, $, $\t\t\t# $1 = $2 << $3\n"
                            },
                            {
                                label: "slt",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "set on less than",
                                insertText: "slt $, $, $\t\t# $1 = ($2 < $3) ? 1 : 0\n"
                            },
                            {
                                label: "slti",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "set on less than immediate",
                                insertText: "slti $, $, 0\t\t\t# $1 = ($2 < 0) ? 1 : 0\n"
                            },
                            {
                                label: "srl",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "shift right",
                                insertText: "srl $, $, $\t\t\t# $1 = $2 >> $3\n"
                            },
                            {
                                label: "sw",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "store word",
                                insertText: "sw $, 0($)}\t\t# \n"
                            },
                            {
                                label: "sub",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "subtract",
                                insertText: "sub $, $, $\t\t# $1 = $2 - $3\n"
                            },
                            {
                                label: "var",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "variable",
                                insertText: "var: .word $3"
                            },
                            {
                                label: "xor",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "xor",
                                insertText: "xor $, $, $\t\t# $1 = $2 ^ $3\n"
                            },
                            {
                                label: "xori",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                documentation: "xor immediate",
                                insertText: "xori\t$, $, 0\t\t\t# $1 = $2 ^ 0\n"
                            }
                        ]
                        return {suggestions}
                    }
                })
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