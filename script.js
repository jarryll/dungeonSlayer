/*************************Dungeon Slayer ***************************************

// The objective of this game is to slay as many dungeon monsters as you in 60 seconds, before player lives are used up.

//Player starts with 3 lives.

// Once player hits start, the start button disappears and the 60 second countdown
 timer is started and displayed. Live counter is displayed. gameOver checking function is activated.
*/

/******************************* Global variables ******************************
*/

// DOM Manipulation
var startInstructions = document.getElementById("start-cue");
var timer = document.getElementById("timer");
var startButton = document.querySelector("#start");
var showLives = document.createElement("h2");
var showScore = document.createElement("h2");
var playerStats = document.querySelector(".playerStats");
var showTimer = document.createElement("h2");
var gameOverHeader = document.getElementById("gameOverHeader");
var gameOverTxt = document.getElementById("gameOver-txt");

// Game Variables
var gameTime = 60;
var gameState = null;
var playerLives = 5;
var playerChoice = null;
var computerChoice = null;
var score = 0;
var playerAttack = "";
var monsterAttack = "";


// Interval ID for checking of gameOver status
var checkStatus = null;
var timeInterval = null;

var defaultState = function (){
    gameTime = 60;
    playerLives = 5;
    score = 0;
}

var startGame = function(){
    // Reset Game States
    defaultState();
    randomiseMonster();
    // displays Game Controls and arena and hides title
    document.querySelector(".game-controls").style.display = "block";
    document.querySelector("h1").style.display = "none";
    document.querySelector(".arena").style.display = "flex";
    document.querySelector(".game-instructions").style.display = "none";
    //starts the game timer function
    startTimer(gameTime);
    //changes the game state to active
    gameState = "active";
    //Hides start button and "push start" instructions
    document.getElementById("start").style.display = "none";
    document.getElementById("start-cue").style.display = "none";
    //displays player lives and score
    displayPlayerStats();
    //Initiates a helper function to constantly check for Game Over conditions
    gameOverCheck();
    checkStatus = setInterval(gameOverCheck, 200);
}

// Function to display player status
var displayPlayerStats = function () {
    showLives.innerHTML = "Lives: " + playerLives;
    showScore.innerHTML = "Score: " + score;
    playerStats.appendChild(showLives);
    playerStats.appendChild(showScore);
}

// Event listener to start the game.
startButton.addEventListener('click', startGame);

// function to display time remaining;
var startTimer = function(timeLeft) {
    timer.appendChild(showTimer);
    timeInterval = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(startTimer);
            gameTime = 0;
            showTimer.innerHTML = "Time's up!"
        } else {
            showTimer.innerHTML = timeLeft + " seconds";
        }
        timeLeft -= 1;
        console.log(timeLeft);
    }, 1000);
}


/************************ Player Selection ************************************
Player can choose 1 of 3 different attacks by pushing the respective buttons:
    "a" for physical attack => converted to 0
    "s" for magical attack => converted to 1
    "d" for sneak attack => converted to 2
*/

// Function to handle player selections

var handleControls = function() {
    if (gameState === "active") {
        console.log(event.code);
        switch (event.code) {
            case "KeyA":
                playerChoice = 0;
                playerAttack = "Physical Attack";
                compChooses();
                compareChoices();
                displayPlayerStats();
                console.log(playerAttack);
                break;
            case "KeyS":
                playerChoice = 1;
                playerAttack = "Magical Attack";
                compChooses();
                compareChoices();
                displayPlayerStats();
                console.log(playerAttack);
                break;
            case "KeyD":
                playerChoice = 2;
                playerAttack = "Sneak Attack";
                compChooses();
                compareChoices();
                displayPlayerStats();
                console.log(playerAttack);
                break;
            default:
                invalidHandler();
                displayPlayerStats();
        }
    }
}

// Event Listener to listen for buttons being pressed
document.addEventListener("keydown", handleControls);


/****************************** Computer Selection **********************************
Once player makes a selection, the monster will make a random selection. Computer will generate a random number from 0 to 2 and perform the corresponding attack.

    if 0, monster uses physical attack
    if 1, monster uses magical attack
-   if 2, monster uses sneak attack
*/

// function for comp to generate random number between 0 to 2
var generateNum = function() {
    var min = Math.ceil(0);
    var max = Math.floor(2);
    computerChoice = Math.floor(Math.random() * (max - min + 1));
}

var compChooses = function () {
    generateNum();
    if (computerChoice === 0) {
        monsterAttack = "Physical Attack";
    } else if (computerChoice === 1) {
        monsterAttack = "Magical Attack";
    } else if (computerChoice === 2) {
        monsterAttack = "Sneak Attack";
    }
    console.log("this worked");
    console.log(computerChoice);
}


/***************************** Helper functions  *********************************
*/

var displayResults = document.createElement("h2");
var results = document.querySelector(".results");

//set a timeout function for result message to disappear after 2 seconds
var resultsHandler = function() {
    results.appendChild(displayResults);
    setTimeout(function (){
        results.removeChild(displayResults);
    }, 1500);
}

// this function triggers in the event of a draw
var drawHandler = function() {
    displayResults.innerText = "Both you and the monster used the same attack. It's a draw. Attack again!";
    resultsHandler();
}

// //Player wins function. Score goes up by 1. Monster image changes
var winHandler = function () {
    displayResults.innerText = "You used " + playerAttack + " and the monster used " + monsterAttack + ". The monster is vanquished!"
    randomiseMonster();
    score += 10;
    resultsHandler();
}

// Monster wins function - player life goes down by 1
var loseHandler = function () {
     displayResults.innerText = "You used " + playerAttack + " and the monster used " + monsterAttack + ". The monster hits you!"
    playerLives -= 1;
    resultsHandler();
    console.log(playerLives);
}

var invalidHandler = function() {
    displayResults.innerText = "No such attack! The monster hits you!"
    playerLives -= 1
    resultsHandler();
}

/**************************Compare Player and Computer Selections *******************
The selections are then compared:
    if playerChoice === monsterChoice, it's a draw and player selects again
    if playerChoice === 0 and monsterChoice === 1, monster wins and player loses 1 life
    if playerChoice === 0 and monsterChoice === 2, player wins and monster is vanquished.
    if playerChoice === 1 and monsterChoice === 0, player wins and monster is vanquished.
    if playerChoice === 1 and monsterChoice === 2, monster wins and player loses 1 life.
    if playerChoice === 2 and monsterChoice === 0, monster wins and player loses 1 life.
    if playerChoice === 2 and monsterChoice === 1, player wins and monster is vanquished.

(Magical attack beats physical attack, physical attack beats sneak attack, and sneak attack beats magical attack.)
*/

var compareChoices = function() {
    //In the event of a draw
    if (playerChoice === computerChoice) {
        drawHandler();
    //In the event of a win
    } else if (playerChoice === 0 && computerChoice === 2 || playerChoice === 1 && computerChoice === 0 || playerChoice === 2 && computerChoice === 1) {
        winHandler();
    } else if (playerChoice === 0 && computerChoice === 1 || playerChoice === 1 && computerChoice === 2 || playerChoice === 2 && computerChoice === 0){
        loseHandler();
    }
}

/************************** Game Over Conditions ********************************
//Game over condition - executed when start button is pushed.
    if time is up OR playerLives === 0, game is over
        1. timer stops
        2. prompt appears: show final score and asks if player wants to play again.
            if playerInput === "Y":
                    prompt disappears
                    timer is restarted
                    score = 0
                    playerLives = 3
            if playerInput === "N"
                    timer doesn't run
                    start button appears again
                    score disappears
                    player score disappears.
*/

//Code the pop-up for Game Over Message

var refreshPage = function (){
    window.location.reload();
}

var replay = function() {
    document.getElementById("gameOver").classList.toggle("active");
    startGame();
}

var endGame = function (){
    clearInterval(checkStatus);
    clearInterval(timeInterval);
    gameState = "inactive";
    document.getElementById("gameOver").classList.toggle("active");
    document.querySelector(".close-btn").addEventListener('click', refreshPage);
    document.getElementById("replay").addEventListener('click', replay);
}

var outOfLives = function(){
    endGame();
    gameOverHeader.innerText = "You are out of lives."
    gameOverTxt.innerText = "Your score: " + score;

}

var outOfTime = function(){
    endGame();
    gameOverHeader.innerText = "You are out of time!"
    gameOverTxt.innerText = "Your score: " + score;
}

var gameOverCheck = function(){
    console.log("checking status");
    if (playerLives === 0) {
        outOfLives();
    } else if (gameTime === 0) {
        outOfTime();
    }
}

/********************** Animation ********************************
*/

var monsterImage = document.getElementById("monster");

//monster 0
var monster1 = {
    src: "images/monster-1.gif"
}

// monster 1
var monster2 = {
    src: "images/monster-2.gif"
}

// monster 2
var monster3 = {
    src: "images/monster-3.gif"
}

//monster 3
var monster4 = {
    src: "images/monster-4.gif"
}

var monsterCollection = [monster1, monster2, monster3, monster4];

var randomiseMonster = function() {
    monsterChoice = Math.floor(Math.random() * 4);
    monsterImage.src = monsterCollection[monsterChoice].src;
    document.querySelector('.monster-image').appendChild(monsterImage);
}