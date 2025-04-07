// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Hollow_Single_Triangle_Density_1 = ({stroke,patternWidth,patternId}) => {
    const pattern = `${patternId}--HollowSingleTriangleDensity1` 
    const patternUrl = `url(#${pattern})`

    return(
        <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width={patternWidth}
          height="30px"
        >
          <defs>
            <pattern
              id={pattern}
              width={20}
              height={30}
              patternUnits="userSpaceOnUse"
            >
              <path
                stroke={stroke}
                id={patternId}
                d="m2.01657,21.9855l7.98343,-13.971l7.98343,13.971l-15.96685,0z"
                strokeWidth={1}
                fill="none"
              />
            </pattern>
          </defs>
          <rect width={patternWidth} height={30} fill={patternUrl} />
        </svg>
      );
}
export default Hollow_Single_Triangle_Density_1
