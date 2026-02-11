window.onload = () => {
    calculator = new Desmos.Calculator(document.getElementById('calculator'), {expressions: false, settingsMenu: false});
    newProblem();
}

function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomCategory(categories){
    return categories[Math.floor(Math.random() * categories.length)];
}

function getVal(id) {
    return Number(document.getElementById(id).value);
}

function nearlyEqual(a, b, tolerance = 0.01) {
    return Math.abs(a - b) < tolerance;
}

function pointEqual(p, q) {
    return nearlyEqual(p[0], q[0]) && nearlyEqual(p[1], q[1]);
}

function unorderedPointPairEqual(user, correct) {
    return (
        (pointEqual(user[0], correct[0]) && pointEqual(user[1], correct[1])) ||
        (pointEqual(user[0], correct[1]) && pointEqual(user[1], correct[0]))
    );
}

function generateEllipseQuestion(){
    var a = randInt(2, 10);
    var b = randInt(1, a-1);
    var h = randInt(-10, 10);
    var k = randInt(-10, 10);
    var c = Math.sqrt(a**2 - b**2);


    const categories = ["Foci", "Vertices", "Major Axis", "Minor Axis"];
    const category = pickRandomCategory(categories);

    const orientations = ["horizontal", "vertical"];
    const orientation = pickRandomCategory(orientations);
    let equation, vertices, foci;

    if (orientation == "horizontal") {
        equation = `(x - ${h})^2 / ${a**2} + (y - ${k})^2 / ${b**2} = 1`;
        vertices = [[h+a, k],[h-a, k]];
        foci = [[h+c, k],[h-c, k]];
    } else {
        equation = `(x - ${h})^2 / ${b**2} + (y - ${k})^2 / ${a ** 2} = 1`;
        vertices = [[h, k+a],[h, k-a]];
        foci = [[h, k+c],[h, k-c]];
    }

    const majorAxis = 2*a;
    const minorAxis = 2*b;

    return {
        type: "ellipse",
        equation,
        category,
        h, k, a, b,
        vertices,
        foci,
        majorAxis,
        minorAxis,
    }
}

function generateParabolaQuestion(){
    let p = randInt(-5, 5)
    while (p == 0) {
        p = randInt(-5, 5);
    }
    const h = randInt(-5, 5);
    const k = randInt(-5, 5);

    const orientations = ["horizontal", "vertical"];
    const orientation = pickRandomCategory(orientations);


    const categories = ["Focus", "Directrix", "Axis of Symmetry", "Focal Length", "Focal Width"];
    const category = pickRandomCategory(categories);
    let equation, directrix, focus;

    if (orientation == "vertical"){
        focus = [h, k+p]
        directrix = ["y", k-p]

        equation = `(x - ${h})^2 = ${4*p}(y - ${k})`;
    }
    else{
        focus = [h+p, k]
        directrix = ["x", h-p]
        equation = `(y - ${k})^2 = ${4*p}(x - ${h})`;
    }

    return {
        type: "parabola",
        equation,
        category,
        orientation,
        h, k, p,
        focus,
        directrix,
        focalWidth: Math.abs(4*p),
        focalLength: p,
    }
}

function generateHyperbolaQuestion(){
    const h = randInt(-10, 10);
    const k = randInt(-10, 10);
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    const c = Math.sqrt(a**2 + b**2);

    const categories = ["Foci", "Vertices", "Transverse Axis", "Conjugate Axis"];
    const category = pickRandomCategory(categories);

    const orientations = ["horizontal", "vertical"];
    const orientation = pickRandomCategory(orientations);
    const transverseAxis = 2*a;
    const conjugateAxis = 2*b;

    let equation, vertices, foci;

    if (orientation == "horizontal") {
        equation = `(x - ${h})^2 / ${a**2} - (y - ${k})^2 / ${b**2} = 1`;
        vertices = [[h+a, k],[h-a, k]];
        foci = [[h+c, k],[h-c, k]];
    }else {
        equation = `(y - ${k})^2 / ${a**2} - (x - ${h})^2 / ${b**2} = 1`;
        vertices = [[h, k+a],[h, k-a]];
        foci = [[h, k+c],[h, k-c]];
    }

    return {

        type: "hyperbola",
        equation,
        category, 
        h, k, a, b,
        vertices,
        foci,
        transverseAxis,
        conjugateAxis,

    }
        

}

function renderQuestion(question){
    calculator.setExpression({ id: 'ellipse', latex: question.equation });
    equationArea = document.getElementById("equation");
    equationArea.innerHTML = `
        <span class="text-muted">Equation:</span>
        <span class="fs-5">${question.equation}</span>
    `;
    renderInputs(question);
}

function renderInputs(question){
    const inputArea = document.getElementById("inputs");
    const promptArea = document.getElementById("prompt");
    inputArea.innerHTML = "";
    
    if (problem.type == "ellipse") {
        if (question.category == "Foci") {
            promptArea.innerText = "What are the coordinates of the foci?";
            inputArea.innerHTML = `
            <label>Focus 1 </label> ( <input id="fx1" class="form-control d-inline-block w-25 text-center"> ,
            <input id="fy1" class="form-control d-inline-block w-25 text-center"> )
            <label>Focus 2 </label> (<input id="fx2" class="form-control d-inline-block w-25 text-center">,
            <input id="fy2" class="form-control d-inline-block w-25 text-center">)
          `;
        }
        else if (question.category == "Vertices") {
            promptArea.innerText = "What are the coordinates of the vertices?";
            inputArea.innerHTML = `
            <label>Vertex 1 </label> ( <input id="vx1" class="form-control d-inline-block w-25 text-center"> ,
            <input id="vy1" class="form-control d-inline-block w-25 text-center"> )
            <label>Vertex 2 </label> (<input id="vx2" class="form-control d-inline-block w-25 text-center">,
            <input id="vy2" class="form-control d-inline-block w-25 text-center">)
          `;
        }
        else if (question.category == "Major Axis") {
            promptArea.innerText = "What is the length of the major axis?";
            inputArea.innerHTML = `<input id="majorAxis" class="form-control d-inline-block w-25 text-center">`;
        }
        else if (question.category == "Minor Axis") {
            promptArea.innerText = "What is the length of the minor axis?";
            inputArea.innerHTML = `<input id="minorAxis" class="form-control d-inline-block w-25 text-center">`;
        }
    } else if (question.type == "parabola") {
        if (question.category == "Focus") {
            promptArea.innerText = "What are the coordinates of the focus?";
            inputArea.innerHTML = `
            <label>Focus </label> ( <input id="fx" class="form-control d-inline-block w-25 text-center"> ,
            <input id="fy" class="form-control d-inline-block w-25 text-center"> )
          `;
        } else if (question.category == "Directrix"){
            promptArea.innerText = "What is the equation for the Directrix?";
            inputArea.innerHTML = `
            <input id="x/y" class="form-control d-inline-block w-25 text-center"> = 
            <input id="directrixCord" class="form-control d-inline-block w-25 text-center">
          `;
        } else if (question.category == "Axis of Symmetry"){
            promptArea.innerText = "What is the equation for the Axis of Symmetry?";
            inputArea.innerHTML = `
            <input id="axisVar" class="form-control d-inline-block w-25 text-center"> = 
            <input id="axisCord" class="form-control d-inline-block w-25 text-center">
          `;
        } else if (question.category == "Focal Length"){
            promptArea.innerText = "What is the focal length?";
            inputArea.innerHTML = `
            <input id="focalLength" class="form-control d-inline-block w-25 text-center">
          `;
        } else if (question.category == "Focal Width"){
            promptArea.innerText = "What is the focal width?";
            inputArea.innerHTML = `
            <input id="focalWidth" class="form-control d-inline-block w-25 text-center">
          `;

        }
    
    } else if (question.type == "hyperbola") {
        if (question.category == "Foci") {
            promptArea.innerText = "What are the coordinates of the foci?";
            inputArea.innerHTML = `
            <label>Focus 1 </label> ( <input id="fx1" class="form-control d-inline-block w-25 text-center"> ,
            <input id="fy1" class="form-control d-inline-block w-25 text-center"> )
            <label>Focus 2 </label> (<input id="fx2" class="form-control d-inline-block w-25 text-center">,
            <input id="fy2" class="form-control d-inline-block w-25 text-center">)
          `;

        } else if (question.category == "Vertices") {
                promptArea.innerText = "What are the coordinates of the vertices?";
                inputArea.innerHTML = `
                <label>Vertex 1 </label> ( <input id="vx1" class="form-control d-inline-block w-25 text-center"> ,
                <input id="vy1"> )
                <label>Vertex 2 </label> (<input id="vx2" class="form-control d-inline-block w-25 text-center">,
                <input id="vy2">)
            `;
    
        } else if (question.category == "Transverse Axis"){
            promptArea.innerText = "What is the length of the transverse axis?";
            inputArea.innerHTML = `
            <input id="transverseAxis" class="form-control d-inline-block w-25 text-center">
        `;

        } else if (question.category == "Conjugate Axis"){
            promptArea.innerText = "What is the length of the conjugate axis?";
            inputArea.innerHTML = `
            <input id="conjugateAxis" class="form-control d-inline-block w-25 text-center">
        `;
        }
    }
}

function newProblem(){
    type = Math.floor(Math.random() * 3);

    if (type == 0) { // ellipse
        problem = generateEllipseQuestion();
        renderQuestion(problem);
        document.getElementById("feedback").innerText = "";
    }
    else if (type == 1) {
        problem = generateParabolaQuestion();
        renderQuestion(problem);
        document.getElementById("feedback").innerText = "";
    }
    else{
        problem = generateHyperbolaQuestion();
        renderQuestion(problem);
        document.getElementById("feedback").innerText = "";
    }
}

function checkAnswer(){
    let correct = false;

    if (problem.type === "ellipse"){
        correct = checkEllipse(problem);
    } else if (problem.type === "parabola"){
        correct = checkParabola(problem);
    } else if (problem.type === "hyperbola"){
        correct = checkHyperbola(problem);
    }

    const feedback = document.getElementById("feedback");
    feedback.innerText = correct ? "Correct!" : "Try again";
    feedback.className = correct
    ? "text-success mt-3"
    : "text-danger mt-3";
}

function checkEllipse(question){
    if (question.category == "Foci"){
        const userFoci = [[ getVal ("fx1"), getVal("fy1")], [getVal("fx2"), getVal("fy2")]];
        return unorderedPointPairEqual(userFoci, question.foci);
    } else if (question.category == "Vertices"){
        const userVertices = [[ getVal ("vx1"), getVal("vy1")], [getVal("vx2"), getVal("vy2")]];
        return unorderedPointPairEqual(userVertices, question.vertices);
    } else if (question.category == "Major Axis"){
        const userMajorAxis = getVal("majorAxis");
        return nearlyEqual(userMajorAxis, question.majorAxis);
    } else if (question.category == "Minor Axis"){
        const userMinorAxis = getVal("minorAxis");
        return nearlyEqual(userMinorAxis, question.minorAxis);
    }
    return false
}

function checkParabola(question){
    if (question.category == "Focus"){
        const resp = [ getVal ("fx"), getVal("fy")];
        return pointEqual(resp, question.focus);
    }
    else if (question.category == "Directrix"){
        const axis = document.getElementById("x/y").value.trim();
        const coord = getVal("directrixCord");
        return axis === question.directrix[0] && nearlyEqual(coord, question.directrix[1]);
    } else if (question.category == "Axis of Symmetry"){
        const varType = document.getElementById("axisVar").value.trim();
        const coord = getVal("axisCord");
        if (question.orientation == "vertical"){
            return varType === "x" && nearlyEqual(coord, question.h);
        }
        else{
            return varType === "y" && nearlyEqual(coord, question.k);
        }
    } else if (question.category == "Focal Length"){
        const focalLength = getVal("focalLength");
        return nearlyEqual(focalLength, question.focalLength);
    } else if (question.category == "Focal Width"){
        const focalWidth = getVal("focalWidth");
        return nearlyEqual(focalWidth, question.focalWidth);
    }
    return false;
}

function checkHyperbola(question){
    if (question.category == "Foci"){
        const userFoci = [[ getVal ("fx1"), getVal("fy1")], [getVal("fx2"), getVal("fy2")]];
        return unorderedPointPairEqual(userFoci, question.foci);
    } else if (question.category == "Vertices"){
        const userVertices = [[ getVal ("vx1"), getVal("vy1")], [getVal("vx2"), getVal("vy2")]];
        return unorderedPointPairEqual(userVertices, question.vertices);
    } else if (question.category == "Transverse Axis") {
        const userTransverse = getVal("transverseAxis");
        return nearlyEqual(userTransverse, question.transverseAxis);
    } else if (question.category == "Conjugate Axis") {
        const userConjugate = getVal("conjugateAxis");
        return nearlyEqual(userConjugate, question.conjugateAxis);
    }
}