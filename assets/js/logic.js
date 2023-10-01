var timerEl = document.getElementById("timer");
var pTimerEl = document.getElementById("timeLabel");
var startBtnEl = document.getElementById("startBtn");
var qCardEl = document.getElementById("qCard");
var choicesEl = document.getElementById("choices");
var highScoreEl = document.getElementById("highscores");
var scoresTxt = document.getElementById("scoresTxt");
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
var timesUp = false;


function init() {
    scoreFormEl.style.visibility = "hidden";
    highScoreEl.style.visibility = "hidden";
    getHighScores(); //pull high scores from local storage
}

function startGame() {
    startTimer();
    renderQuestion();
}

function startTimer() { //start timer, reset 90s and 0 score
    timesUp = false;
    score = 0;
    timerCount = 90;
    startBtnEl.style.visibility = "hidden";
    pTimerEl.dataset.state = "visible";
    timerEl.textContent = timerCount + " second(s) left!";

    listOfQs = Array.from(questions);

    //sets timer
    timer = setInterval(function () {
        if (timerCount > 0) {
            timerCount--;
            timerEl.textContent = timerCount + " second(s) left!";
        } else { //clears interval
            clearInterval(timer);
            if(score == 0) { //occurs when user fails to finish
                emptyCard();
                getScore();
            }
            pTimerEl.dataset.state = "hidden";
            timerEl.textContent = "";
        }
    }, 1000);
}

function getHighScores() { //local storage highscore array
    highScores = JSON.parse(localStorage.getItem("highScores"));
    scoresTxt.innerText = "";
    for (var line in highScores) {
        var rank = parseInt(line) + 1;
        scoresTxt.textContent += `${rank}: ${highScores[line].userInitial} -- ${highScores[line].userScore}\n`;
    }
}

function getScore() {
    // emptyCard();
    if(timesUp || timerCount == 0) {
        qCardQuestionEl.textContent = "Game Over!";
        startBtnEl.style.visibility = "visible";
        return;
    } else {
        score = numCorrect / (questions.length) * 1000 + timerCount;
        console.log("Score: " + score);
        qCardQuestionEl.textContent = "Congratulations!\n Score: " + score;
        scoreFormEl.style.visibility = "visible";
    }
    
}

function emptyCard() {
    choicesEl.replaceChildren("");
    qCardQuestionEl.textContent = "";
}

function renderQuestion() { //render onto card class
    currentQ = getQuestion();
    emptyCard();
    if (currentQ === null) { //if all questions was dealt, then conclude with getScore()
        getScore();
        timerCount = 0;
        return;
    }
    qCardQuestionEl.textContent = currentQ.q; 
    qCardEl.appendChild(qCardQuestionEl);
    getChoices(Array.from(currentQ.choices));
}

function getQuestion() { //random question from questions.js
    if (listOfQs.length === 0) {
        return null;
    } else {
        var randomQ = Math.floor(Math.random() * listOfQs.length);
        var questionObj = listOfQs.splice(randomQ, 1).pop();
        return questionObj;
    }
}

function getChoices(ansArray) { //random order of choices for question
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


startBtnEl.addEventListener("click", startGame);
hiScoreLink.addEventListener("click", function (event) { //reveal and call most updated scores
    event.preventDefault();
    if (highScoreEl.style.visibility == "hidden") {
        getHighScores();
        highScoreEl.style.visibility = "visible";
    } else {
        highScoreEl.style.visibility = "hidden";
    }

});

choicesEl.addEventListener("click", function (event) { //user's choice
    var element = event.target;
    if (element.matches("button") === true) {
        if (element.textContent === currentQ.correct) { //tabulate total correct
            timerEl.textContent += " Correct!"
            numCorrect++;
        } else {
            timerEl.textContent += " Incorrect!"  //deduct 5s for wrong answer
            timerCount -= 5;
            if (timerCount <= 0) { //checks timerCount if ran out
                timesUp = true;
                return;
            }
        }
        renderQuestion(); //render next random question
    }
});

scoreFormEl.addEventListener("submit", function (event) { //store score in local storage with highscores
    event.preventDefault();
    if (initialsEl.value !== '') {      
        userScore = {                           //userScore object: initials and score
            userInitial: initialsEl.value.trim(),
            userScore: score
        };
        if (highScores === null) { highScores = []; }   //checks if local storage is empty
        highScores.push(userScore);
        highScores.sort((a, b) => b.userScore - a.userScore); //sorts highscores from large to small

        localStorage.setItem("highScores", JSON.stringify(highScores)); //store data
        scoreFormEl.style.visibility = "hidden";
        startBtnEl.style.visibility = "visible";
        qCardQuestionEl.textContent = "Play Again?";
    } else {
        alert("Please enter your initials."); //needs initials to proceed
    }
});

init();


