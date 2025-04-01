// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Hollow_Single_Rhombus_Density_1 = ({stroke,patternWidth,patternId}) => {
    const pattern = `${patternId}--HollowSingleRhombusDensity1` 
    const patternUrl = `url(#${pattern})`
    return(
        <svg
    width={patternWidth}
    height={30}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    >
    <defs>
      <pattern
        id={pattern}
        width={20}
        height={30}
        patternUnits="userSpaceOnUse"
        fill="none"
      >
        <rect
        id={patternId}
          x={12}
          y={-2}
          width={10}
          height={10}
          fill="none"
          stroke={stroke}
          strokeWidth={1}
          transform="rotate(45)"
        />
      </pattern>
    </defs>
    <rect fill={patternUrl} width={patternWidth} height={30} />
  </svg>
       );
}
export default Hollow_Single_Rhombus_Density_1
