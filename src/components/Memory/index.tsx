import React from "react"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import {useSelector} from "react-redux"
import Paper from "@mui/material/Paper"
import TableContainer from "@mui/material/TableContainer"
import TableBody from "@mui/material/TableBody"
import {TableVirtuoso} from "react-virtuoso"
import {RootState} from "../../store"

export default function Memory() {
    const {memory} = useSelector<RootState, any>(state => state.mips)

    // @ts-ignore
    return (
        <TableVirtuoso
            initialItemCount={memory.table.length}
            components={{
                Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref}/>),
                Table: (props) => <Table {...props}
                                         style={{borderCollapse: "separate"}}
                                         stickyHeader
                                         aria-label="sticky table"/>,
                // @ts-ignore
                TableHead: TableHead,
                TableRow: TableRow,
                TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref}/>)
            }}
            fixedHeaderContent={() => <>
                <TableRow>
                    <TableCell
                        align="center"
                        style={{backgroundColor: "#414141", color: "white"}}
                        colSpan={2}
                    >
                        Memory
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell
                        align="center"
                        style={{backgroundColor: "#414141", color: "white"}}
                    >Address</TableCell>
                    <TableCell
                        align="center"
                        style={{backgroundColor: "#414141", color: "white"}}
                    >Value</TableCell>
                </TableRow>
            </>}
            itemContent={(index) => <>
                <TableCell align="center">
                    {
                        // @ts-ignore
                        index.displayHex(4)
                    }
                </TableCell>
                <TableCell align="center">
                    {
                        // @ts-ignore
                        memory.table[index].displayHex()
                    }
                </TableCell>
            </>}
        />
    )
}
