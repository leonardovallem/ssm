import React from "react"
import RGL, {WidthProvider} from "react-grid-layout"
import CodeEditor from "./components/CodeEditor"
import RegisterBank from "./components/RegisterBank"
import Mips from "./components/Mips"

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import "./App.css"
import ReorderBuffer from "./components/ReorderBuffer"
import ReservationStations from "./components/ReservationStations"
import {useSelector} from "react-redux"
import {RootState} from "./store"
import ParsedInstructionsList from "./components/ParsedInstructionsList"
import {configureStringUtils} from "./util/StringUtils"

const GridLayout = WidthProvider(RGL)
configureStringUtils()

function App() {
    const resizeHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"]
    const {parsedInstructions} = useSelector<RootState, any>(state => state.mips)

    function ifBuiltElse<T>(p: T, n: T) {
        return parsedInstructions.length === 0 ? n : p
    }

    const layout = [
        {i: "a", x: 0, y: 0, w: ifBuiltElse(15, 20), h: 12, minW: 5, minH: 5, isBounded: true, resizeHandles},
        {i: "b", x: 15, y: 0, w: 5, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "c", x: 0, y: 13, w: 4, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "d", x: 4, y: 13, w: 8, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "e", x: 12, y: 13, w: 8, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "f", x: 0, y: 0, w: 3, h: 12, minW: 5, minH: 5, isBounded: true, resizeHandles},
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
            <div key="a"><CodeEditor/></div>
            {ifBuiltElse(<div key="b"><ParsedInstructionsList/></div>, null)}
            <div key="c"><RegisterBank/></div>
            <div key="d"><ReservationStations/></div>
            <div key="e"><ReorderBuffer/></div>
            {/*<div key="f"><Memory/></div>*/}
        </GridLayout>
        <Mips/>
    </>
}

export default App
