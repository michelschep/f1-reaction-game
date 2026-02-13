let gameState = 'ready'; // ready, lighting, waiting, green, reacted, false_start
let lights = [false, false, false, false, false];
let currentLight = 0;
let lightTimer = 0;
let greenTimer = 0;
let randomDelay = 0;
let reactionTime = 0;
let times = []; // Array of {time: ms, date: timestamp}
let maxTimes = 10;

// Web Audio API
let audioContext;
let audioReady = false;

// Version
const VERSION = 'v1.0.4';

function setup() {
    createCanvas(windowWidth, windowHeight);
    loadTimes();
}

function initAudio() {
    if (!audioReady) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioReady = true;
    }
}

function draw() {
    background(20);
    
    // Calculate responsive dimensions
    let titleSize = min(width / 20, 32);
    let statusSize = min(width / 30, 20);
    
    // Draw title
    fill(255);
    textAlign(CENTER);
    textSize(titleSize);
    text('F1 REACTION TIME', width / 2, height * 0.07);
    
    // Draw version number in corner
    fill(100);
    textAlign(RIGHT, TOP);
    textSize(min(width / 60, 12));
    text(VERSION, width - 10, 10);
    
    // Draw lights
    drawLights();
    
    // Game logic
    if (gameState === 'lighting') {
        if (millis() - lightTimer > 1000) {
            lights[currentLight] = true;
            playLightBeep();
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
    let lightWidth = min(width / 7, 80);
    let lightHeight = lightWidth * 1.5;
    let spacing = lightWidth * 0.25;
    let totalWidth = (lightWidth * 5) + (spacing * 4);
    let startX = (width - totalWidth) / 2;
    let lightY = height * 0.15;
    
    for (let i = 0; i < 5; i++) {
        let x = startX + (lightWidth + spacing) * i;
        
        // Draw light background
        fill(40);
        stroke(80);
        strokeWeight(3);
        rect(x, lightY, lightWidth, lightHeight, 10);
        
        // Draw light status
        noStroke();
        let circleSize = lightWidth * 0.75;
        if (gameState === 'green') {
            // All lights green
            fill(0, 255, 0);
            ellipse(x + lightWidth / 2, lightY + lightHeight / 2, circleSize, circleSize);
        } else if (lights[i]) {
            // Red light on
            fill(255, 0, 0);
            ellipse(x + lightWidth / 2, lightY + lightHeight / 2, circleSize, circleSize);
        } else {
            // Light off
            fill(60);
            ellipse(x + lightWidth / 2, lightY + lightHeight / 2, circleSize, circleSize);
        }
    }
}

function drawStatus() {
    fill(255);
    let statusSize = min(width / 30, 20);
    let titleSize = min(width / 25, 28);
    let smallSize = min(width / 40, 18);
    textSize(statusSize);
    textAlign(CENTER);
    let statusY = height * 0.48;
    
    if (gameState === 'ready') {
        text('TAP SCREEN or press SPACE/TAB to start', width / 2, statusY);
    } else if (gameState === 'lighting') {
        text('Get ready...', width / 2, statusY);
    } else if (gameState === 'waiting') {
        text('Wait for green...', width / 2, statusY);
    } else if (gameState === 'green') {
        text('GO! TAP NOW!', width / 2, statusY);
        fill(0, 255, 0);
    } else if (gameState === 'reacted') {
        fill(0, 255, 0);
        textSize(titleSize);
        let timeInSeconds = (reactionTime / 1000).toFixed(3);
        text('Reaction Time: ' + timeInSeconds + ' s', width / 2, statusY);
        textSize(smallSize);
        text('TAP or press SPACE/TAB to try again', width / 2, statusY + 30);
    } else if (gameState === 'false_start') {
        fill(255, 0, 0);
        textSize(titleSize);
        text('FALSE START!', width / 2, statusY);
        textSize(smallSize);
        text('You pressed too early. TAP or press SPACE/TAB to try again', width / 2, statusY + 30);
    }
}

function drawLeaderboard() {
    fill(255);
    let titleSize = min(width / 25, 28);
    let textSize14 = min(width / 50, 14);
    textSize(titleSize);
    textAlign(CENTER);
    let boardY = height * 0.65;
    text('TOP 10 BEST TIMES', width / 2, boardY);
    
    textSize(textSize14);
    let startY = boardY + 30;
    let displayTimes = times.slice(0, 10);
    
    for (let i = 0; i < displayTimes.length; i++) {
        let medal = '';
        if (i === 0) medal = '🥇';
        else if (i === 1) medal = '🥈';
        else if (i === 2) medal = '🥉';
        else medal = (i + 1) + '. ';
        
        let timeInSeconds = (displayTimes[i].time / 1000).toFixed(3);
        let dateObj = new Date(displayTimes[i].date);
        let dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        
        // Draw medal/position (left-aligned)
        fill(200);
        textAlign(LEFT);
        text(medal, width / 2 - min(width / 3.5, 180), startY + i * 22);
        
        // Draw time (center)
        textAlign(CENTER);
        text(timeInSeconds + ' s', width / 2, startY + i * 22);
        
        // Draw date/time (right-aligned)
        fill(150);
        textAlign(RIGHT);
        text(dateStr, width / 2 + min(width / 3.5, 180), startY + i * 22);
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

function touchStarted() {
    handleInput();
    return false; // Prevent default
}

function mousePressed() {
    handleInput();
    return false; // Prevent default
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function handleInput() {
    initAudio(); // Initialize audio on first interaction
    
    if (gameState === 'ready' || gameState === 'reacted' || gameState === 'false_start') {
        startRound();
    } else if (gameState === 'lighting' || gameState === 'waiting') {
        // False start
        gameState = 'false_start';
        playFalseStartSound();
    } else if (gameState === 'green') {
        // Calculate reaction time
        reactionTime = millis() - greenTimer;
        gameState = 'reacted';
        
        // Check if it's a new record (best time)
        let isRecord = times.length === 0 || reactionTime < times[0].time;
        
        // Save time with timestamp
        times.push({
            time: reactionTime,
            date: Date.now()
        });
        times.sort((a, b) => a.time - b.time);
        if (times.length > maxTimes) {
            times = times.slice(0, maxTimes);
        }
        saveTimes();
        
        // Play sound based on result
        if (isRecord) {
            playRecordSound();
        } else {
            playSuccessSound();
        }
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
        let parsed = JSON.parse(saved);
        // Handle old format (array of numbers) and convert to new format
        if (parsed.length > 0 && typeof parsed[0] === 'number') {
            times = parsed.map(t => ({ time: t, date: Date.now() }));
        } else {
            times = parsed;
        }
    }
}

function playLightBeep() {
    if (!audioReady) return;
    
    let osc = audioContext.createOscillator();
    let gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = 400;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.15);
}

function playSuccessSound() {
    if (!audioReady) return;
    
    let osc = audioContext.createOscillator();
    let gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(400, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.15);
}

function playRecordSound() {
    if (!audioReady) return;
    
    // Triple beep for record
    [0, 0.1, 0.2].forEach((delay) => {
        let osc = audioContext.createOscillator();
        let gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(600, audioContext.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + delay + 0.1);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.12);
        
        osc.start(audioContext.currentTime + delay);
        osc.stop(audioContext.currentTime + delay + 0.12);
    });
}

function playGreenSound() {
    if (!audioReady) return;
    
    let osc = audioContext.createOscillator();
    let gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(200, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.4, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.3);
}

function playFalseStartSound() {
    if (!audioReady) return;
    
    let osc = audioContext.createOscillator();
    let gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(150, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.4);
    osc.type = 'sawtooth';
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.4);
}
