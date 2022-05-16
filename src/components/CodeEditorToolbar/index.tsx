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
import {Fade, FormControl, InputLabel, LinearProgress, MenuItem, Select, Stack} from "@mui/material"
import {useDispatch, useSelector} from "react-redux"
import MonacoThemes from "../../util/MonacoThemes"
import ProgramState from "../../util/EditorState"
import {RootState} from "../../store"
import {editorActions} from "../../store/features/editor"
import "./style.css"
import {mipsActions} from "../../store/features/mips";

const MAX_FONT_SIZE = 48
const MIN_FONT_SIZE = 8

export default function CodeEditorToolbar() {
    const dispatch = useDispatch()
    const {state, zoom, error} = useSelector<RootState, any>(state => state.editor)

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
                            <IconButton aria-label="clear memory and registers"
                                        component="span"
                                        onClick={() => dispatch(mipsActions.reset())}
                                        style={{marginRight: "2em"}}
                            >
                                <ClearIcon color="secondary"
                                           fontSize="large"/>
                            </IconButton>

                            <Fade in={state === ProgramState.NOT_RUNNING || state === ProgramState.DEBUGGING}>
                                <IconButton aria-label="run program"
                                            component="span"
                                            onClick={() => {
                                                if (state === ProgramState.NOT_RUNNING) {
                                                    dispatch(editorActions.loadProgram())
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

                                    {state === ProgramState.DEBUGGING
                                        ? <StepOverIcon color="primary"
                                                        fontSize="large"
                                        /> : null
                                    }
                                </IconButton>
                            </Fade>

                            <IconButton aria-label="run program"
                                        component="span"
                                        onClick={() => {
                                            if (state === ProgramState.NOT_RUNNING) {
                                                dispatch(editorActions.loadProgram())
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
