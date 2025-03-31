// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Hollow_Single_Square_Density_1 = ({stroke,patternWidth,patternId}) => {
    const pattern = `${patternId}--HollowSingleSquareDensity1` 
    const patternUrl = `url(#${pattern})`
    return(<svg width={patternWidth} height={30}>
        <defs>
          <pattern id={pattern} width={20} height={30} patternUnits="userSpaceOnUse">
            <rect id={patternId} x={5} y={10} width={10} height={10} stroke={stroke} fill="none" />
          </pattern>
        </defs>
        <rect fill={patternUrl} width={patternWidth} height={30} />
      </svg>);
}
export default Hollow_Single_Square_Density_1
