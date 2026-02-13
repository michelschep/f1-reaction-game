let gameState = 'ready'; // ready, lighting, waiting, green, reacted, false_start
let lights = [false, false, false, false, false];
let currentLight = 0;
let lightTimer = 0;
let greenTimer = 0;
let randomDelay = 0;
let reactionTime = 0;
let times = [];
let maxTimes = 10;

function setup() {
    createCanvas(800, 600);
    loadTimes();
}

function draw() {
    background(20);
    
    // Draw title
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text('F1 REACTION TIME', width / 2, 60);
    
    // Draw lights
    drawLights();
    
    // Game logic
    if (gameState === 'lighting') {
        if (millis() - lightTimer > 1000) {
            lights[currentLight] = true;
            currentLight++;
            lightTimer = millis();
            
            if (currentLight >= 5) {
                gameState = 'waiting';
                randomDelay = random(1000, 4000);
                greenTimer = millis();
            }
        }
    } else if (gameState === 'waiting') {
        if (millis() - greenTimer > randomDelay) {
            gameState = 'green';
            greenTimer = millis();
        }
    }
    
    // Draw instructions and status
    drawStatus();
    
    // Draw leaderboard
    drawLeaderboard();
}

function drawLights() {
    let lightWidth = 80;
    let lightHeight = 120;
    let spacing = 20;
    let totalWidth = (lightWidth * 5) + (spacing * 4);
    let startX = (width - totalWidth) / 2;
    let lightY = 150;
    
    for (let i = 0; i < 5; i++) {
        let x = startX + (lightWidth + spacing) * i;
        
        // Draw light background
        fill(40);
        stroke(80);
        strokeWeight(3);
        rect(x, lightY, lightWidth, lightHeight, 10);
        
        // Draw light status
        noStroke();
        if (gameState === 'green') {
            // All lights green
            fill(0, 255, 0);
            ellipse(x + lightWidth / 2, lightY + lightHeight / 2, 60, 60);
        } else if (lights[i]) {
            // Red light on
            fill(255, 0, 0);
            ellipse(x + lightWidth / 2, lightY + lightHeight / 2, 60, 60);
        } else {
            // Light off
            fill(60);
            ellipse(x + lightWidth / 2, lightY + lightHeight / 2, 60, 60);
        }
    }
}

function drawStatus() {
    fill(255);
    textSize(20);
    textAlign(CENTER);
    
    if (gameState === 'ready') {
        text('Press SPACE or TAB to start', width / 2, 330);
    } else if (gameState === 'lighting') {
        text('Get ready...', width / 2, 330);
    } else if (gameState === 'waiting') {
        text('Wait for green...', width / 2, 330);
    } else if (gameState === 'green') {
        text('GO! PRESS SPACE OR TAB!', width / 2, 330);
        fill(0, 255, 0);
    } else if (gameState === 'reacted') {
        fill(0, 255, 0);
        textSize(28);
        text('Reaction Time: ' + reactionTime + ' ms', width / 2, 330);
        textSize(18);
        text('Press SPACE or TAB to try again', width / 2, 360);
    } else if (gameState === 'false_start') {
        fill(255, 0, 0);
        textSize(28);
        text('FALSE START!', width / 2, 330);
        textSize(18);
        text('You pressed too early. Press SPACE or TAB to try again', width / 2, 360);
    }
}

function drawLeaderboard() {
    fill(255);
    textSize(24);
    textAlign(CENTER);
    text('BEST TIMES', width / 2, 420);
    
    textSize(16);
    textAlign(LEFT);
    let startY = 450;
    let displayTimes = times.slice(0, 5);
    
    for (let i = 0; i < displayTimes.length; i++) {
        let medal = '';
        if (i === 0) medal = '🥇';
        else if (i === 1) medal = '🥈';
        else if (i === 2) medal = '🥉';
        else medal = (i + 1) + '.';
        
        fill(200);
        text(medal + '  ' + displayTimes[i] + ' ms', width / 2 - 100, startY + i * 25);
    }
    
    if (displayTimes.length === 0) {
        textAlign(CENTER);
        fill(150);
        text('No times yet - start playing!', width / 2, startY);
    }
}

function keyPressed() {
    if (keyCode === 32 || keyCode === 9) { // SPACE or TAB
        handleInput();
        return false; // Prevent default behavior for TAB
    }
}

function handleInput() {
    if (gameState === 'ready' || gameState === 'reacted' || gameState === 'false_start') {
        startRound();
    } else if (gameState === 'lighting' || gameState === 'waiting') {
        // False start
        gameState = 'false_start';
    } else if (gameState === 'green') {
        // Calculate reaction time
        reactionTime = millis() - greenTimer;
        gameState = 'reacted';
        
        // Save time
        times.push(reactionTime);
        times.sort((a, b) => a - b);
        if (times.length > maxTimes) {
            times = times.slice(0, maxTimes);
        }
        saveTimes();
    }
}

function startRound() {
    gameState = 'lighting';
    lights = [false, false, false, false, false];
    currentLight = 0;
    lightTimer = millis();
    reactionTime = 0;
}

function saveTimes() {
    localStorage.setItem('f1ReactionTimes', JSON.stringify(times));
}

function loadTimes() {
    let saved = localStorage.getItem('f1ReactionTimes');
    if (saved) {
        times = JSON.parse(saved);
    }
}
