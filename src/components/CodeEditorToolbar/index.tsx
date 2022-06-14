import React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import PlayIcon from "@mui/icons-material/PlayArrow"
import StopIcon from "@mui/icons-material/Dangerous"
import StepOverIcon from "@mui/icons-material/East"
import DebugIcon from "@mui/icons-material/BugReport"
import ClearIcon from "@mui/icons-material/ClearAll"
import {Chip, Fade, FormControl, InputLabel, LinearProgress, MenuItem, Select, Stack, Tooltip} from "@mui/material"
import {useDispatch, useSelector} from "react-redux"
import MonacoThemes from "../../util/MonacoThemes"
import ProgramState, {isInExecution} from "../../util/EditorState"
import {RootState} from "../../store"
import {editorActions} from "../../store/features/editor"
import "./style.css"
import {mipsActions} from "../../store/features/mips"
import {nextPhase} from "../../processor/components/tomasulo/ReorderBuffers";
import { canDebug, canExecuteEntirely } from "../../util/Constants"

const MAX_FONT_SIZE = 48
const MIN_FONT_SIZE = 8

export default function CodeEditorToolbar() {
    const dispatch = useDispatch()
    const {state, zoom, error} = useSelector<RootState, any>(state => state.editor)
    const {cycles, phase} = useSelector<RootState, any>(state => state.mips)

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Stack direction="row"
                           alignItems="center"
                           flexGrow={1}
                           gap="1em">
                        <Stack direction="row"
                               alignItems="center"
                               className="font-size-controls white-text">
                            <IconButton aria-label="decrease editor font size"
                                        component="span"
                                        disabled={zoom === MIN_FONT_SIZE}
                                        onClick={() => dispatch(editorActions.decreaseZoom())}
                            >
                                <RemoveIcon/>
                            </IconButton>
                            <Typography variant="h6" component="div" className="zoom-label">
                                Zoom
                            </Typography>
                            <IconButton aria-label="increase editor font size"
                                        component="span"
                                        disabled={zoom === MAX_FONT_SIZE}
                                        onClick={() => dispatch(editorActions.increaseZoom())}
                            >
                                <AddIcon/>
                            </IconButton>
                        </Stack>

                        <ThemeSelector/>

                        <Stack direction="row"
                               justifyContent="end"
                               alignItems="center"
                               flexGrow={1}
                        >
                            <Tooltip title="Clear memory and registers">
                                <IconButton aria-label="clear memory and registers"
                                            component="span"
                                            onClick={() => dispatch(mipsActions.reset())}
                                            style={{marginRight: "2em"}}
                                >
                                    <ClearIcon color="secondary"
                                               fontSize="large"/>
                                </IconButton>
                            </Tooltip>

                            <IconButton aria-label="Run next phase"
                                        component="span"
                                        className="font-size-controls"
                                        onClick={() => {
                                            dispatch(mipsActions.runPhase(nextPhase(phase)))
                                            dispatch(editorActions.loadRun())
                                        }}
                            >
                                <PlayIcon color="success"
                                          fontSize="large"
                                />
                                <Typography variant="h6" component="span" className="white-text">
                                    {nextPhase(phase)}
                                </Typography>
                            </IconButton>

                            {canExecuteEntirely && <Fade
                                in={state === ProgramState.NOT_RUNNING || state === ProgramState.DEBUGGING || state === ProgramState.WAITING_FOR_NEXT_INSTRUCTION}>
                                <Tooltip title={state === ProgramState.NOT_RUNNING
                                    ? "Run program"
                                    : "Execute next instruction"}>
                                    <IconButton aria-label="run program"
                                                component="span"
                                                onClick={() => {
                                                    if (state === ProgramState.NOT_RUNNING) {
                                                        dispatch(editorActions.loadRun())
                                                    } else {
                                                        dispatch(editorActions.executeNextInstruction())
                                                    }
                                                }}
                                    >
                                        {state === ProgramState.NOT_RUNNING
                                            ? <PlayIcon color="success"
                                                        fontSize="large"
                                            /> : null
                                        }

                                        {state === ProgramState.DEBUGGING || state === ProgramState.WAITING_FOR_NEXT_INSTRUCTION
                                            ? <StepOverIcon color="primary"
                                                            fontSize="large"
                                            /> : null
                                        }
                                    </IconButton>
                                </Tooltip>
                            </Fade>}

                            { canDebug && <Tooltip title={state === ProgramState.NOT_RUNNING
                                ? "Debug program"
                                : "Stop execution"}>
                                <IconButton aria-label="run program"
                                            component="span"
                                            onClick={() => {
                                                if (state === ProgramState.NOT_RUNNING) {
                                                    dispatch(editorActions.loadDebug())
                                                } else {
                                                    dispatch(editorActions.stopExecution())
                                                }
                                            }}
                                >
                                    {
                                        state === ProgramState.NOT_RUNNING
                                            ? <DebugIcon color="success"
                                                         fontSize="large"/>
                                            : <StopIcon color="error"
                                                        fontSize="large"/>
                                    }
                                </IconButton>
                            </Tooltip>}

                            {
                                (isInExecution(state) || cycles !== 0) &&
                                <Chip className="cycle-counter" label={`Cycles: ${cycles}`}/> // TODO add button to increase single cycle
                            }
                        </Stack>
                    </Stack>
                </Toolbar>

                <Fade in={state === ProgramState.LOADING_RUN || state === ProgramState.LOADING_DEBUG}>
                    <LinearProgress color="inherit"/>
                </Fade>
                <Fade in={error != null}>
                    <LinearProgress variant="determinate" color="error" value={100}/>
                </Fade>
            </AppBar>
        </Box>
    )
}

function ThemeSelector() {
    const dispatch = useDispatch()
    const {theme} = useSelector<RootState, any>(state => state.editor)

    return (
        <Box sx={{minWidth: 120, paddingY: "10px"}}>
            <FormControl fullWidth>
                <InputLabel id="theme-selector">Theme</InputLabel>
                <Select
                    labelId="theme-selector"
                    value={theme}
                    label="Theme"
                    className="theme-selector white-text"
                >
                    {Object.keys(MonacoThemes).map(t => <MenuItem
                        key={t}
                        value={t}
                        onClick={() => dispatch(editorActions.changeTheme(t))}
                    >
                        {t}
                    </MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    )
}
