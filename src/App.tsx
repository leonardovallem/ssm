import React from "react"
import RGL, {WidthProvider} from "react-grid-layout"
import {useSelector} from "react-redux"

import CodeEditor from "./components/CodeEditor"
import RegisterBank from "./components/RegisterBank"
import Mips from "./components/Mips"
import ReorderBuffer from "./components/ReorderBuffer"
import ReservationStations from "./components/ReservationStations"
import {RootState} from "./store"
import ParsedInstructionsList from "./components/ParsedInstructionsList"
import {configureStringUtils} from "./util/StringUtils"
import Memory from "./components/Memory"

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import "./App.css"

const GridLayout = WidthProvider(RGL)
configureStringUtils()

function App() {
    const resizeHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"]
    const {parsedInstructions} = useSelector<RootState, any>(state => state.mips)

    function ifBuiltElse<T>(p: T, n: T) {
        return parsedInstructions.length === 0 ? n : p
    }

    const layout = [
        {i: "code-editor", x: 0, y: 0, w: ifBuiltElse(15, 20), h: 12, minW: 5, minH: 5, isBounded: true, resizeHandles},
        {i: "instructions-list", x: 15, y: 0, w: 5, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "register-bank", x: 0, y: 13, w: 6, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "reservation-stations", x: 6, y: 13, w: 14, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "reorder-buffer", x: 5, y: 25, w: 15, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "f", x: 0, y: 25, w: 5, h: 12, minW: 4, minH: 5, isBounded: true, resizeHandles},
    ]

    return <>
        <GridLayout
            className="layout"
            cols={20}
            margin={[3, 3]}
            // @ts-ignore
            layout={layout}
            rowHeight={30}
        >
            <div key="code-editor"><CodeEditor/></div>
            {ifBuiltElse(<div key="instructions-list"><ParsedInstructionsList/></div>, null)}
            <div key="register-bank"><RegisterBank/></div>
            <div key="reservation-stations"><ReservationStations/></div>
            <div key="reorder-buffer"><ReorderBuffer/></div>
            <div key="f"><Memory/></div>
        </GridLayout>
        <Mips/>
    </>
}

export default App
