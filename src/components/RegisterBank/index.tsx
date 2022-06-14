import React from "react"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import {useSelector} from "react-redux"
import {RootState} from "../../store"
import Register from "../../processor/components/Register"

export default function RegisterBank() {
    const {registerBank} = useSelector<RootState, any>(state => state.mips)

    return <Paper sx={{width: "100%", overflow: "hidden"}}>
        <TableContainer sx={{maxHeight: 390}}>
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
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Name</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {registerBank.map((register: Register) => {
                        return (
                            <TableRow hover tabIndex={-1} key={register.name}>
                                <TableCell align="center">
                                    {register.name}
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        // @ts-ignore
                                        register.value.displayHex()
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
