// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Solid_Single_Star_Density_1 = ({fill,patternWidth,patternId}) => {
    const pattern = `${patternId}--SolidSingleStarDensity1` 
    const patternUrl = `url(#${pattern})`
    return(
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
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
              <path
                stroke="none"
                strokeWidth={0.5}
                id={patternId}
                d="m1.43646,13.07952l6.54201,0l2.02153,-6.21488l2.02153,6.21488l6.542,0l-5.29258,3.84096l2.02163,6.21488l-5.29259,-3.84107l-5.29259,3.84107l2.02164,-6.21488l-5.29259,-3.84096z"
                fill={fill}
              />
            </pattern>
          </defs>
          <rect width={patternWidth} height={30} fill={patternUrl} />
        </svg>
      );
}
export default Solid_Single_Star_Density_1
