function onGLC(glc) {
	glc.loop();
    glc.styles.backgroundColor = "black";
    //glc.setMode("single"); // "bounce" | "single"
    glc.styles.strokeStyle = "rgba(0,255,255,100)";
    glc.styles.fillStyle = "cyan";
    glc.styles.lineWidth = 1;
    //glc.setEasing(false);

	var list = glc.renderList,
		width = glc.w,
		height = glc.h;

    var hexmult = 0.5;

    // for(var i=0; i<10; i++){
    //     for(var j=0; j<20; j++){
    //         list.addPoly({
    //             x:(156*i + 78*(j%2))*hexmult,
    //             y:44*j*hexmult,
    //             sides: 6,
    //             radius:[0,50*hexmult],
    //             phase: (i+j)/25,
    //             fillStyle: ["cyan", "magenta"]
    //         });
    //     }
    // }

    for(var i=0; i<10; i++){
        for(var j=0; j<20; j++){
            list.addPoly({
                x:(156*i + 78*(j%2))*hexmult,
                y:44*j*hexmult,
                sides: 6,
                radius: 50*hexmult,
                phase: (i+j)/25,
                fill: false,
                stroke: true,
                strokeStyle: ["black", "cyan"],
                radius:[0, 50*hexmult],
            });
        }
    }
    for(var i=0; i<10; i++){
        for(var j=0; j<20; j++){
            list.addPoly({
                x:(156*i + 78*(j%2))*hexmult,
                y:44*j*hexmult,
                sides: 6,
                radius: 50*hexmult,
                phase: (i+j)/25+0.5,
                fillStyle: ["black", "magenta"],
                radius:[0, 50*hexmult],
            });
        }
    }

}