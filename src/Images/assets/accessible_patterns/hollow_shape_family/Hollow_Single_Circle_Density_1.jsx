// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Hollow_Single_Circle_Density_1 = ({stroke,patternWidth,patternId}) => {
    const pattern = `${patternId}--HollowSingleCircleDensity1` 
    const patternUrl = `url(#${pattern})`
    return(
        <svg width={patternWidth} height={30} xmlns="http://www.w3.org/2000/svg">
            <defs>
            <pattern
                id={pattern}
                width={20}
                height={30}
                patternUnits="userSpaceOnUse"
                fill="none"
            >
                <circle id={patternId} cx={10} cy={15} r={5} stroke={stroke} fill="none"/>
            </pattern>
            </defs>
            <rect fill={patternUrl} stroke="none" width={patternWidth} height={30} />
        </svg>
  );
}
export default Hollow_Single_Circle_Density_1