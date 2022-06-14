import React, {useEffect, useState} from "react"
import Paper from "@mui/material/Paper"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import {ReorderBuffer as RB} from "../../processor/components/tomasulo/ReorderBuffers"
import {normalizeBoolean} from "../../util/StringUtils"
import {useSelector} from "react-redux"
import {RootState} from "../../store"

export default function ReorderBuffer() {
    const [data, setData] = useState<Array<RB>>([])
    const {reorderBuffers} = useSelector<RootState, any>(state => state.mips)

    useEffect(() => {
        setData(reorderBuffers)
    }, [reorderBuffers])


    return <Paper sx={{width: "100%", overflow: "hidden"}}>
        <TableContainer sx={{maxHeight: 390}}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                            colSpan={5}
                        >
                            Reorder Buffer
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
                        >Instruction</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Busy</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >State</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((buffer) => {
                        return (
                            <TableRow hover tabIndex={-1} key={buffer.entry}>
                                <TableCell align="center">
                                    {buffer.entry}
                                </TableCell>
                                <TableCell align="center">
                                    {buffer.instruction}
                                </TableCell>
                                <TableCell align="center">
                                    {normalizeBoolean(buffer.busy)}
                                </TableCell>
                                <TableCell align="center">
                                    {buffer.state.toString()}
                                </TableCell>
                                <TableCell align="center">
                                    {buffer.value}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
}