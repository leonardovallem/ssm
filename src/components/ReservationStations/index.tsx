import React from "react"
import Paper from "@mui/material/Paper"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import ReservationStation from "../../processor/components/tomasulo/ReservationStations"
import {normalizeBoolean, randomUUID} from "../../util/StringUtils"
import {useSelector} from "react-redux"
import {RootState} from "../../store"

export default function ReservationStations() {
    const {reservationStations} = useSelector<RootState, any>(state => state.mips)

    return <Paper sx={{width: "100%", overflow: "hidden"}}>
        <TableContainer sx={{maxHeight: 390}}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                            colSpan={8}
                        >
                            Reservation Stations
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
                        >Busy</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Instruction</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Vi</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Vj</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Qj</TableCell>
                        <TableCell
                            align="center"
                            style={{backgroundColor: "#414141", color: "white"}}
                        >Qk</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ReservationStation.from(reservationStations).map((rs) => {
                        return (
                            <TableRow hover tabIndex={-1} key={randomUUID()}>
                                <TableCell align="center">
                                    {rs.name}
                                </TableCell>
                                <TableCell align="center">
                                    {normalizeBoolean(rs.busy)}
                                </TableCell>
                                <TableCell align="center">
                                    {rs.instruction?.toString() ?? ""}
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        // @ts-ignore
                                        rs.vi?.displayHex() ?? ""
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        // @ts-ignore
                                        rs.vj?.displayHex() ?? ""
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        // @ts-ignore
                                        rs.qk ?? ""
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        // @ts-ignore
                                        rs.qj ?? ""
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