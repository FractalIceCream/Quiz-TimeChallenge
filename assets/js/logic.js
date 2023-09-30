var timerEl = document.getElementById("timer");
var pTimerEl = document.getElementById("timeLabel");
var startBtnEl = document.getElementById("startBtn");
var qCardEl = document.getElementById("qCard");
var choicesEl = document.getElementById("choices");
var highScoreEl = document.getElementById("highscores");
var hiScoreLink = document.querySelector("a");

var scoreFormEl = document.getElementById("scoreForm");
var initialsEl = document.querySelector("#initials");

var qCardQuestionEl = document.createElement("pre");

var timer, timerCount;
var listOfQs = [];
var currentQ = {};

var numCorrect = 0,
    score = 0;
var userScore = {};
var highScores = [];


choicesEl.addEventListener("click", function(event) {
    var element = event.target;

    if (element.matches("button") === true) {
        if (element.textContent === currentQ.correct) {
            console.log("correct!");
            numCorrect++;
        } else {
            console.log("Wrong!");
            timerCount -=5;
        }
        
        renderQuestion();
    }
});

scoreFormEl.addEventListener("submit", function() {
    userScore = {
        userInitial: initialsEl.value.trim(),
        userScore: score
    };
    if (highScores === null){ highScores = [];}

    console.log(userScore);
    console.log(highScores);
    highScores.push(userScore);
    highScores.sort((a, b) => b.userScore - a.userScore);

    console.log(highScores);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    // localStorage.setItem("highScores", JSON.stringify(highScores));
});

function getScore() {
    score = numCorrect/(questions.length) * 1000 + timerCount;
    console.log("Score: " + score);
    scoreFormEl.style.visibility = "visible";
}
function renderQuestion() {
    currentQ = getQuestion();
    choicesEl.replaceChildren("");
    if (currentQ === null) {
        qCardQuestionEl.textContent = "";
        console.log(timerCount);
        getScore();
        timerCount = 0;
        return;
    }
    qCardQuestionEl.textContent = currentQ.q;
    qCardEl.appendChild(qCardQuestionEl);
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
    do {
        randomOrder = Math.floor(Math.random() * ansArray.length);
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.textContent = ansArray.splice(randomOrder, 1).pop();
        li.appendChild(btn);
        choicesEl.appendChild(li);
    } while (ansArray.length > 0)
    qCardEl.appendChild(choicesEl);
    return;
}


function startTimer() {
    timerCount = 90;
    startBtnEl.style.visibility = "hidden";
    pTimerEl.dataset.state = "visible";
    timerEl.textContent = timerCount + " second(s) left!";
    
    listOfQs = Array.from(questions);

    //sets timer
    timer = setInterval(function() {
        if(timerCount > 0) {
            timerCount--;
            timerEl.textContent = timerCount + " second(s) left!";
        } else { //clears interval
            clearInterval(timer);
            startBtnEl.style.visibility = "visible";
            pTimerEl.dataset.state = "hidden";
            timerEl.textContent = ""; 
        }
    }, 1000);
}

function startGame() {
    startTimer();
    renderQuestion();
}


init();
startBtnEl.addEventListener("click", startGame);
hiScoreLink.addEventListener("click", function(event) {
    event.preventDefault();
    if (highScoreEl.style.visibility == "hidden") {
        getHighScores();
        highScoreEl.style.visibility = "visible";
    } else {
        highScoreEl.style.visibility = "hidden";
    }
    
});

function getHighScores() {
    highScores = JSON.parse(localStorage.getItem("highScores"));
    console.log(highScores);
    highScoreEl.children[1].replaceChildren("");
    
    for (var line in highScores) {
        var li = document.createElement("li");
        li.textContent = highScores[line].userInitial + " -- " + highScores[line].userScore;
        highScoreEl.children[1].appendChild(li);
    }
}
function init() {
    scoreFormEl.style.visibility = "hidden";
    highScoreEl.style.visibility = "hidden";
    getHighScores();
    console.log("starts here");
}