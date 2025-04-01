const forcePatternColorChange = (newColor, pattern, patternId) => {
    console.log("Forcing color change for pattern: " + pattern + " with Id: "+patternId+" to color: " + newColor)
    var patternMarkup = document.getElementById(patternId);
    if(!patternMarkup){
        console.log("Could not find pattern with Id: " + patternId)
    }
    if(pattern.charAt(0) == 'S'){
        if(pattern.charAt(1) == 'i'){
            patternMarkup?.setAttribute("stroke",newColor);
        }
        else if(pattern.charAt(1) == 'o'){
            patternMarkup?.setAttribute("fill",newColor)
        }
    }
    else{
        if(pattern.charAt(0) == 'H')
            patternMarkup?.setAttribute("stroke",newColor);
        else if(pattern.charAt(9) == "L"){
            var i = 0
            for(i =0 ;i< 4;i++){
                patternMarkup = document.getElementById(`${patternId}_${i}`)
                patternMarkup?.setAttribute("stroke",newColor);
            }

        }
        else if(pattern.charAt(9) == "R"){
            var i = 0
            for(i =0 ;i< 3;i++){
                patternMarkup = document.getElementById(`${patternId}_${i}`)
                patternMarkup?.setAttribute("stroke",newColor);
            }

        }
        else if(pattern.charAt(9) == "W"){
            var i = 0
            for(i =0 ;i< 7;i++){
                patternMarkup = document.getElementById(`${patternId}_${i}`)
                patternMarkup?.setAttribute("stroke",newColor);
            }

        }
    }
    return null;
}
export default forcePatternColorChange;