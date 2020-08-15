/*************************Dungeon Slayer ***************************************

// The objective of this game is to slay as many dungeon monsters as you in 60 seconds, before player lives are used up.

//Player starts with 3 lives.

// Once player hits start, the start button disappears and the 60 second countdown
 timer is started and displayed. Live counter is displayed. gameOver checking function is activated.
*/


var startInstructions = document.getElementById("start-cue");
var timer = document.getElementById("timer");
var startButton = document.querySelector("#start");
var showLives = document.createElement("h2");
var showScore = document.createElement("h2");
var gameTime = 0;
var gameState = null;
var playerLives = 3;
var playerChoice = null;
var computerChoice = null;
var score = 0;
var playerAttack = "";
var monsterAttack = "";


var startGame = function(){
    //starts the game timer function
    gameTime = 60;
    playerLives = 3;
    score = 0;
    startTimer(gameTime);
    //changes the game state to active
    gameState = "active";
    //removes start button and instructions
    document.querySelector(".start-button").removeChild(startButton);
    document.querySelector(".push-start").removeChild(startInstructions);
    //displays player lives and score
    displayPlayerStats();
}

// Function to display player status
var displayPlayerStats = function () {
    showLives.innerHTML = "Lives: " + playerLives;
    showScore.innerHTML = "Score: " + score;
    document.querySelector(".playerStats").appendChild(showLives);
    document.querySelector(".playerStats").appendChild(showScore);
}


// Event listener to start the game.
startButton.addEventListener('click', startGame);

// function to display time remaining;
var startTimer = function(timeLeft) {
    setInterval(function() {
        if (timeLeft <= 0) {
            gameTime = 0;
            clearInterval(startTimer);
            gameState = "inactive";
            timer.innerHTML = "Time's up!"
        } else {
            timer.innerHTML = timeLeft + " seconds";
        }
        timeLeft--;
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
    }, 2000);
}

// this function triggers in the event of a draw
var drawHandler = function() {
    displayResults.innerText = "Both you and the monster used the same attack. It's a draw. Attack again!";
    resultsHandler();
}

// //Player wins function. Score goes up by 1. Monster image changes
var winHandler = function () {
    displayResults.innerText = "You used " + playerAttack + " and the monster used " + monsterAttack + ". The monster is vanquished!"
    score += 1;
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

// var gameStatus = function() {
//     if (playerLives === 0) {
//         clearInterval(startTimer);

//     }
// }

//Code the pop-up for Game Over Message

// var gameOver = function(){

// }