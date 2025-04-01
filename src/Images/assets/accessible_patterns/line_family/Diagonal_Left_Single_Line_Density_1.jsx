// SVG converted to JSX using SVGR Playground.
import * as React from "react"
const Diagonal_Left_Single_Line_Density_1 = ({stroke,patternWidth,patternId}) => {
    const pattern = `${patternId}--DiagonalLeftSingleLineDensity1` 
    const patternUrl = `url(#${pattern})`
    const patternIds = [`${patternId}_0`,`${patternId}_1`,`${patternId}_2`,`${patternId}_3`]
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
                <path id={patternIds[0]} d="m14.77901,-1.74033l30.44199,33.48066" opacity="undefined" stroke={stroke} fill="none"/>
                <path id={patternIds[1]} d="m-5.75,-1.74033l30.44198,33.48066" opacity="undefined" stroke={stroke} fill="none"/>
                <path id={patternIds[2]} d="m30.25,-1.74033l30.44198,33.48066" opacity="undefined" stroke={stroke} fill="none"/>
                <path id={patternIds[3]} d="m-25.75,-1.74033l30.44198,33.48066" opacity="undefined"  stroke={stroke} fill="none"/>
            </pattern>
        </defs>
        <rect width={patternWidth} height={30} fill={patternUrl}/>
        </svg>
    );
}
export default Diagonal_Left_Single_Line_Density_1
