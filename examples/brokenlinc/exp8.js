function onGLC(glc) {
	glc.loop();
    glc.styles.backgroundColor = "#f04";
    glc.setMode("single"); // "bounce" | "single"
    glc.styles.strokeStyle = "rgba(0,255,255,100)";
    glc.styles.fillStyle = "black";
    glc.styles.lineWidth = 2;
    glc.setEasing(false);

	var list = glc.renderList,
		w = glc.w,
		h = glc.h;

        glc.renderList.addGear({
            x:200,
            y:200,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 80,
            rotation:[0, 15 * 59/60]
        });

        glc.renderList.addCube({
            x:200,
            y:200,
            strokeStyle: "black",
            size:80,
            rotationX: [0,90],
            rotationY: [0,90],
            rotationZ: [0,90]
        })

        glc.renderList.addCube({
            x:200,
            y:200,
            strokeStyle: "black",
            size:50,
            rotationX: [90,0],
            rotationY: [90,0],
            rotationZ: [90,0]
        })

        glc.renderList.addCube({
            x:200,
            y:200,
            strokeStyle: "black",
            size:20,
            rotationX: [0,90],
            rotationY: [0,90],
            rotationZ: [0,90]
        })


        glc.renderList.addGear({
            x:400,
            y:200,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 10,
            rotation:[17 * 59/60, 2]
        });
        glc.renderList.addGear({
            x:0,
            y:200,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 10,
            rotation:[17 * 59/60, 2]
        });
        glc.renderList.addGear({
            x:200,
            y:0,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 10,
            rotation:[17 * 59/60, 2]
        });
        glc.renderList.addGear({
            x:200,
            y:400,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 10,
            rotation:[17 * 59/60, 2]
        });

        glc.renderList.addGear({
            x:0,
            y:0,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 10,
            rotation:[0, 15 * 59/60]
        });
        glc.renderList.addGear({
            x:0,
            y:400,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 10,
            rotation:[0, 15 * 59/60]
        });
        glc.renderList.addGear({
            x:400,
            y:0,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 10,
            rotation:[0, 15 * 59/60]
        });
        glc.renderList.addGear({
            x:400,
            y:400,
            radius:104,
            teeth: 24,
            toothHeight:10,
            toothAngle:1/5,
            hub: 10,
            rotation:[0, 15 * 59/60]
        });

}