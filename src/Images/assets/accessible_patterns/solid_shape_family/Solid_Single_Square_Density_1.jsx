// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Solid_Single_Square_Density_1 = ({fill,patternWidth,patternId}) => {
    const pattern = `${patternId}--SolidSingleSquareDensity1` 
    const patternUrl = `url(#${pattern})`
    return(<svg width={patternWidth} height={30}>
        <defs>
          <pattern id={pattern} width={20} height={30} patternUnits="userSpaceOnUse">
            <rect id={patternId} x={5} y={10} width={10} height={10} stroke="none" fill={fill} />
          </pattern>
        </defs>
        <rect fill={patternUrl} width={patternWidth} height={30} />
      </svg>);
}
export default Solid_Single_Square_Density_1
