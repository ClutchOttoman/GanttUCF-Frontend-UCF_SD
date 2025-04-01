// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Diagonal_Woven_Line_Density_1 = ({stroke,patternWidth,patternId}) =>{
    const pattern = `${patternId}--DiagonalWovenLineDensity1` 
    const patternUrl = `url(#${pattern})`
    const patternIds = [`${patternId}_0`,`${patternId}_1`,`${patternId}_2`,`${patternId}_3`,`${patternId}_4`,`${patternId}_5`,`${patternId}_6`]
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
              <path id={patternIds[3]} d="m14.77901,-1.74033l30.44199,33.48066" opacity="undefined"  stroke={stroke} fill="none"/>
                <path id={patternIds[4]} d="m-5.75,-1.74033l30.44198,33.48066" opacity="undefined"  stroke={stroke} fill="none"/>
                <path id={patternIds[5]} d="m30.25,-1.74033l30.44198,33.48066" opacity="undefined"  stroke={stroke} fill="none"/>
                <path id={patternIds[6]} d="m-25.75,-1.74033l30.44198,33.48066" opacity="undefined" stroke={stroke} fill="none"/>
            </pattern>
          </defs>
          <rect width={patternWidth} height={30} fill={patternUrl} />
        </svg>
      );
}
export default Diagonal_Woven_Line_Density_1
