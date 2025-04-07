// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Single_Vertical_Line_Density_1 = ({stroke,patternWidth,patternId}) => {
    const pattern = `${patternId}--SingleVerticalLineDensity1` 
    const patternUrl = `url(#${pattern})`
    return(
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={patternWidth}
          height={30}
        >
          <defs>
            <pattern
              id={pattern}
              width={20}
              height={30}
              patternUnits="userSpaceOnUse"
            >
                <line stroke={stroke} stroke-linecap="undefined" stroke-linejoin="undefined" id={patternId} y2="31.85844" x2="10" y1="-1.62826" x1="10" fill="none"/>
            </pattern>
          </defs>
          <rect width={patternWidth} height={30} fill={patternUrl} />
        </svg>
      );
}
export default Single_Vertical_Line_Density_1
