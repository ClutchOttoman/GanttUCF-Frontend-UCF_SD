// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Hollow_Single_Dot_Density_1 = ({stroke,patternWidth,patternId}) => {
    const pattern = `${patternId}--HollowSingleDotDensity1` 
    const patternUrl = `url(#${pattern})`
    return(
    <svg width={patternWidth} height="30" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id={pattern} width="20" height="30" patternUnits="userSpaceOnUse">
        <rect height="100%" width="100%" fill="none"/>
        <circle
          id={patternId}
          cx="10"
          cy="15"
          r="2"
          fill = "none"
          stroke={stroke}
         />
      </pattern>
    </defs>
    <rect fill={patternUrl} stroke="none" width={patternWidth} height="30" />
  </svg>
    );
}
export default Hollow_Single_Dot_Density_1
