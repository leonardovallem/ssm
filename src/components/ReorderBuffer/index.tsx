import React from "react"
import Paper from "@mui/material/Paper"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import ReorderBuffers, {ReorderBuffer as ReorderBufferUnit} from "../../processor/components/tomasulo/ReorderBuffers"
import {normalizeBoolean} from "../../util/StringUtils";

export default function ReorderBuffer() {
    const reorderBuffer = new ReorderBuffers()

    return <Paper sx={{width: "100%", overflow: "hidden"}}>
        <TableContainer sx={{maxHeight: 390}}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                            colSpan={7}
                        >
                            ReorderBuffer
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Entry</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Busy</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Instruction</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >State</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Destination</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reorderBuffer.map((buffer: ReorderBufferUnit) => {
                        return (
                            <TableRow hover tabIndex={-1} key={buffer.entry}>
                                <TableCell align="center">
                                    {normalizeBoolean(buffer.busy)}
                                </TableCell>
                                <TableCell align="center">
                                    {buffer.instruction.toString()}
                                </TableCell>
                                <TableCell align="center">
                                    {buffer.state.toString()}
                                </TableCell>
                                <TableCell align="center">
                                    {buffer.destination.name}
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        // @ts-ignore
                                        buffer.value.displayHex()
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
}