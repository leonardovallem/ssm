import React from "react"
import RGL, {WidthProvider} from "react-grid-layout"
import CodeEditor from "./components/CodeEditor"
import RegisterBank from "./components/RegisterBank"

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import "./App.css"

const GridLayout = WidthProvider(RGL)

function App() {
    const resizeHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"]

    const layout = [
        {i: "a", x: 0, y: 0, w: 9, h: 9, minW: 5, minH: 5, isBounded: true, resizeHandles},
        {i: "b", x: 9, y: 0, w: 3, h: 9, minH: 5, maxH: 10, isBounded: true, resizeHandles},
        {i: "c", x: 4, y: 0, w: 1, h: 2, isBounded: true, resizeHandles}
    ]

    return <GridLayout
        className="layout"
        cols={12}
        margin={[3, 3]}
        // @ts-ignore
        layout={layout}
        rowHeight={30}
    >
        <div key="a"><CodeEditor/></div>
        <div key="b"><RegisterBank/></div>
    </GridLayout>
}

export default App
