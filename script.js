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


function generateEllipseQuestion(){
    var a = randInt(1, 10);
    var b = randInt(1, 10);
    var h = randInt(0, 10);
    var k = randInt(0, 10);
    var c = Math.sqrt(a**2 - b**2);


    const categories = ["Foci", "Vertices", "Major Axis", "Minor Axis"];
    const category = pickRandomCategory(categories);

    const orientations = ["horizontal", "vertical"];
    const orientation = pickRandomCategory(orientations);

    if (orientation == "horizontal") {
        equation = `(x - ${h})^2 / ${a**2} + (y - ${k})^2 / ${b**2} = 1`;
        vertices = [[h+a, k][h-a, k]]
        foci = [[h+c, k][h-c, k]]
    } else {
        equation = `(x - ${h})^2 / ${b**2} + (y - ${k})^2 / ${a ** 2} = 1`;
        vertices = [[h, k+a][h, k-a]]
        foci = [[h, k+c][h, k-c]];
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

function renderQuestion(question){
    calculator.setExpression({ id: 'ellipse', latex: question.equation });
    equationArea = document.getElementById("equation");
    equationArea.innerText = `Equation: ${question.equation}`;
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
            <label>Focus 1 </label> ( <input id="fx1"> ,
            <input id="fy1"> )
            <label>Focus 2 </label> (<input id="fx2">,
            <input id="fy2">)
          `;
        }
        else if (question.category == "Vertices") {
            promptArea.innerText = "What are the coordinates of the vertices?";
            inputArea.innerHTML = `
            <label>Vertex 1 </label> ( <input id="fx1"> ,
            <input id="fy1"> )
            <label>Vertex 2 </label> (<input id="fx2">,
            <input id="fy2">)
          `;
        }
        else if (question.category == "Major Axis") {
            promptArea.innerText = "What is the length of the major axis?";
            inputArea.innerHTML = `<input id="majorAxis">`;
        }
        else if (question.category == "Minor Axis") {
            promptArea.innerText = "What is the length of the major axis?";
            inputArea.innerHTML = `<input id="minorAxis">`;
        }
    }
}

function newProblem(){
    type = Math.floor(Math.random() * 1);

    if (type == 0) { // ellipse
        problem = generateEllipseQuestion();
        renderQuestion(problem);
        document.getElementById("feedback").innerText = "";
    }
    else if (type == 1) {

    }
    else{

    }
}

function checkAnswer(){
    pass
}