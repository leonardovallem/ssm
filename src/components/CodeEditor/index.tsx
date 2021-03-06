import React from "react"
import Editor from "@monaco-editor/react"
import {Alert, Snackbar, Stack} from "@mui/material"
import CodeEditorToolbar from "../CodeEditorToolbar"
import MonacoThemes from "../../util/MonacoThemes"
import {editor} from "monaco-editor"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../../store"
import {editorActions} from "../../store/features/editor"
import {mipsActions} from "../../store/features/mips"
import ProgramState from "../../util/EditorState"

export default function CodeEditor() {
    const dispatch = useDispatch()

    const themeNames = Object.keys(MonacoThemes)
    const themes = Object.values(MonacoThemes)

    const {state, theme, zoom, error} = useSelector<RootState, any>(state => state.editor)
    const {PC} = useSelector<RootState, any>(state => state.mips)
    const [program, setProgram] = React.useState("")

    const handleKeyboardZoom = React.useCallback((e: KeyboardEvent) => {
        if (!e.ctrlKey && !e.metaKey) return

        if (["=", "+"].includes(e.key)) {
            e.preventDefault()
            dispatch(editorActions.increaseZoom())
        } else if (e.key === "-") {
            e.preventDefault()
            dispatch(editorActions.decreaseZoom())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyboardZoom)
        return () => document.removeEventListener("keydown", handleKeyboardZoom)
    }, [handleKeyboardZoom])

    React.useEffect(() => {
        if (state === ProgramState.LOADING_RUN || state === ProgramState.LOADING_DEBUG) {
            dispatch(mipsActions.loadProgram(program))
            if (state === ProgramState.LOADING_RUN) dispatch(editorActions.programRunning())
            else dispatch(editorActions.programDebugging())
        }
    }, [state, program])

    function getErrorMessage() {
        const err = error instanceof Error ? error.message : error
        return `#${PC + 1} - ${err}`
    }

    return <Stack height="100%" direction="column">
        <CodeEditorToolbar />
        <Editor
            options={{
                fontSize: zoom,
                theme: theme,
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
            value={program}
            theme={theme}
            onChange={(value) => setProgram(value!!)}
            defaultLanguage="mips"/>

        <Snackbar open={error != null}
                  autoHideDuration={5000}
                  onClose={() => dispatch(editorActions.noticeError(null))}
                  sx={{width: "calc(100% - 3em)"}}
        >
            <Alert severity="error" sx={{width: "100%"}}>{getErrorMessage()}</Alert>
        </Snackbar>
    </Stack>
}