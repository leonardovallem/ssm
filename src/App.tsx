import React from "react"
import RGL, {WidthProvider} from "react-grid-layout"
import CodeEditor from "./components/CodeEditor"
import RegisterBank from "./components/RegisterBank"
import Mips from "./components/Mips"
import Memory from "./components/Memory"

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import "./App.css"
import ReorderBuffer from "./components/ReorderBuffer"

const GridLayout = WidthProvider(RGL)

function App() {
    const resizeHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"]

    const layout = [
        {i: "a", x: 0, y: 0, w: 9, h: 12, minW: 5, minH: 5, isBounded: true, resizeHandles},
        {i: "b", x: 9, y: 0, w: 3, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "c", x: 9, y: 13, w: 3, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
        {i: "d", x: 0, y: 13, w: 6, h: 12, minH: 7, maxH: 15, isBounded: true, resizeHandles},
    ]

    return <>
        <GridLayout
            className="layout"
            cols={12}
            margin={[3, 3]}
            // @ts-ignore
            layout={layout}
            rowHeight={30}
        >
            <div key="a"><CodeEditor/></div>
            <div key="b"><RegisterBank/></div>
            <div key="c"><Memory/></div>
            <div key="d"><ReorderBuffer/></div>
        </GridLayout>
        <Mips/>
    </>
}

export default App
