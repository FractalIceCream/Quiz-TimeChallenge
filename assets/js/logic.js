var timerEle = document.getElementById("timer");
var pTimer = document.getElementById("timeLabel");
var startBtn = document.getElementById("startBtn");
var qCard = document.getElementById("qCard");
var choices = document.getElementById("choices");

var qCardQuestion = document.createElement("p");

var timer, timerCount;
var listOfQs = [];
var currentQ = {};


choices.addEventListener("click", function(event) {
    var element = event.target;

    if (element.matches("button") === true) {
        if (element.textContent === currentQ.correct) {
            console.log("correct!");
        } else {
            console.log("Wrong!");
            timerCount -=10;
        }
        
        renderQuestion();
    }
});

function renderQuestion() {
    currentQ = getQuestion();
    choices.replaceChildren("");
    if (currentQ === null) {
        qCardQuestion.textContent = "";
        timerCount = 0;
        return;
    }
    qCardQuestion.textContent = currentQ.q;
    qCard.appendChild(qCardQuestion);
    getChoices(Array.from(currentQ.choices));
}

function getQuestion() {
    if (listOfQs.length === 0) {
        return null;
    } else {
        var randomQ = Math.floor(Math.random() * listOfQs.length);
        var questionObj = listOfQs.splice(randomQ, 1).pop();
        return questionObj;
    }
}

function getChoices(ansArray) {
    var randomOrder;
    var li = document.createElement("li");
    do {
        randomOrder = Math.floor(Math.random() * ansArray.length);
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.textContent = ansArray.splice(randomOrder, 1).pop();
        li.appendChild(btn);
        choices.appendChild(li);
    } while (ansArray.length > 0)
    qCard.appendChild(choices);
    return;
}


function startTimer() {
    timerCount = 90;
    startBtn.style.visibility = "hidden";
    pTimer.dataset.state = "visible";
    timerEle.textContent = timerCount + " second(s) left!";
    
    listOfQs = Array.from(questions)

    //sets timer
    timer = setInterval(function() {
        if(timerCount > 0) {
            timerCount--;
            timerEle.textContent = timerCount + " second(s) left!";
        } else { //clears interval
            clearInterval(timer);
            startBtn.style.visibility = "visible";
            pTimer.dataset.state = "hidden";
            timerEle.textContent = ""; 
        }
    }, 1000);
}

function startGame() {
    startTimer();
    renderQuestion();
}


init();
startBtn.addEventListener("click", startGame);
function init() {

    console.log("starts here");
}