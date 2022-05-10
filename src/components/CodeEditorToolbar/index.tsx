import React, {Dispatch, SetStateAction} from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import PlayIcon from "@mui/icons-material/PlayArrow"
import StopIcon from "@mui/icons-material/Dangerous"
import {FormControl, InputLabel, LinearProgress, MenuItem, Select, SelectChangeEvent, Stack} from "@mui/material"
import MonacoThemes from "../../util/MonacoThemes"
import "./style.css"

interface CodeEditorToolbarProps {
    onFontSizeIncrease: Function
    onFontSizeDecrease: Function
    minFontSizeReached: boolean
    maxFontSizeReached: boolean
    theme: string
    setTheme: Dispatch<SetStateAction<string>>
}

export default function CodeEditorToolbar(props: CodeEditorToolbarProps) {
    const [programRunning, setProgramRunning] = React.useState(false)

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
                                        disabled={props.minFontSizeReached}
                                        onClick={() => props.onFontSizeDecrease()}
                            >
                                <RemoveIcon/>
                            </IconButton>
                            <Typography variant="h6" component="div" className="zoom-label">
                                Zoom
                            </Typography>
                            <IconButton aria-label="increase editor font size"
                                        component="span"
                                        disabled={props.maxFontSizeReached}
                                        onClick={() => props.onFontSizeIncrease()}
                            >
                                <AddIcon/>
                            </IconButton>

                        </Stack>

                        <ThemeSelector theme={props.theme} setTheme={props.setTheme}/>

                        <Stack direction="row"
                               justifyContent="end"
                               alignItems="center"
                               flexGrow={1}
                        >
                            <IconButton aria-label="run program"
                                        component="span"
                                        onClick={() => setProgramRunning(!programRunning)}
                            >
                                {programRunning
                                    ? <StopIcon color="error"
                                                fontSize="large"
                                    />
                                    : <PlayIcon color="success"
                                                fontSize="large"
                                    />
                                }
                            </IconButton>
                        </Stack>
                    </Stack>
                </Toolbar>

                {programRunning ? <LinearProgress color="inherit" /> : null}
            </AppBar>
        </Box>
    )
}

interface ThemeSelectorProps {
    theme: string
    setTheme: Dispatch<SetStateAction<string>>
}

function ThemeSelector(props: ThemeSelectorProps) {

    const handleChange = (event: SelectChangeEvent) => {
        props.setTheme(event.target.value as string)
    }

    return (
        <Box sx={{minWidth: 120, paddingY: "10px"}}>
            <FormControl fullWidth>
                <InputLabel id="theme-selector">Theme</InputLabel>
                <Select
                    labelId="theme-selector"
                    value={props.theme}
                    label="Theme"
                    onChange={handleChange}
                    className="theme-selector white-text"
                >
                    {Object.keys(MonacoThemes).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    )
}
