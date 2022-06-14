import React from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import {ListSubheader} from "@mui/material"

import MIPS from "../../processor/MIPS"
import "./style.css"

export default function ParsedInstructionsList() {
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
        {MIPS.parsedInstructions.map(inst => (
                <ListItem key={inst}>
                    <ListItemText primary={inst}
                                  className={inst.endsWith(":")
                                      ? "instruction-label"
                                      : ""}
                    />
                </ListItem>
            )
        )}
    </List>
}
