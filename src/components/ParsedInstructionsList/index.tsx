import React from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import {ListSubheader} from "@mui/material"
import {useSelector} from "react-redux"
import {RootState} from "../../store"
import "./style.css"
import {randomUUID} from "../../util/StringUtils"

export default function ParsedInstructionsList() {
    const {PC, parsedInstructions} = useSelector<RootState, any>(state => state.mips)

    function getItemClass(inst: string, index: number) {
        let className = ""
        if (inst.endsWith(":")) className += "instruction-label "
        if (index === PC) className += "current-instruction"
        return className
    }

    return <List
        className="instructions-list"
        sx={{
            bgcolor: "background.paper",
            overflow: "auto"
        }}
        subheader={<li/>}
    >
        <ListSubheader className="instructions-list-header">
            Instructions
        </ListSubheader>
        {(parsedInstructions as Array<Array<string>>).map((inst, index) => {
                const instruction = inst.join(" ")
                return <ListItem key={randomUUID()} className={getItemClass(instruction, index)}>
                    <ListItemText primary={instruction}/>
                </ListItem>
            }
        )}
    </List>
}
