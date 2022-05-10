import React from "react"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Register from "../../model/Register"

interface Column {
    id: "name" | "value"
    label: string
    minWidth?: number
    align?: "center"
    format?: (value: number) => string
}

const columns: readonly Column[] = [
    {id: "name", label: "Name", align: "center"},
    {id: "value", label: "Value", align: "center"}
]

const rows = [
    new Register("$s0", 0),
    new Register("$s1", 0),
    new Register("$s2", 0),
    new Register("$s3", 0),
    new Register("$s4", 0),
    new Register("$s5", 0),
    new Register("$s6", 0),
    new Register("$s7", 0),
    new Register("$s8", 0),
]

export default function RegisterBank() {
    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: 295}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="center"
                                style={{backgroundColor: "#414141", color: "white"}}
                                colSpan={2}
                            >
                                Register bank
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth, backgroundColor: "#414141", color: "white"}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(register => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={register.name}>
                                    {columns.map((column) => {
                                        const value = register[column.id]
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === "number"
                                                    ? column.format(value)
                                                    : value}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
