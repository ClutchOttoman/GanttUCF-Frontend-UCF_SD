// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Diagonal_Right_Single_Line_Density_1 = ({stroke,patternWidth,patternId}) => {
    const pattern = `${patternId}--DiagonalRightSingleLineDensity1` 
    const patternUrl = `url(#${pattern})`
    const patternIds = [`${patternId}_0`,`${patternId}_1`,`${patternId}_2`]
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
              <line
                stroke={stroke}
                strokeLinecap="undefined"
                strokeLinejoin="undefined"
                id={patternIds[0]}
                y2={-1.70472}
                x2={30}
                y1={30.05434}
                x1={-2}
                fill="none"
              />
              <line
                stroke={stroke}
                strokeLinecap="undefined"
                strokeLinejoin="undefined"
                id={patternIds[1]}
                y2={-1.70472}
                x2={10}
                y1={30.05434}
                x1={-22}
                fill="none"
              />
              <line
                stroke={stroke}
                strokeLinecap="undefined"
                strokeLinejoin="undefined"
                id={patternIds[2]}
                y2={-1.70472}
                x2={50}
                y1={55.04591}
                x1={-7.18116}
                fill="none"
              />
            </pattern>
          </defs>
          <rect width={patternWidth} height={30} fill={patternUrl} />
        </svg>
      );
}
export default Diagonal_Right_Single_Line_Density_1
