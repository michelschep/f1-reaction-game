# F1 Reaction Time Game 🏎️

A Formula 1 starting lights reaction game built with p5.js. Test and improve your reaction time just like real F1 drivers!

## 🎮 How to Play

**Live Demo:** [https://michelschep.github.io/f1-reaction-game/](https://michelschep.github.io/f1-reaction-game/)

### Game Rules

1. **Press SPACE or TAB** to start a round
2. Watch the **5 red lights** turn on one by one (1 second each) with a beep sound
3. Wait for all lights to turn **green** (random delay between 1-4 seconds)
4. **React as fast as possible** by pressing SPACE or TAB when the lights turn green
5. Your reaction time is recorded and ranked

### Scoring

- ✅ **Good reaction**: Short success beep
- 🏆 **New record**: Triple beep celebration sound
- ❌ **False start**: Harsh buzzer sound (pressed too early)
- 📊 **Leaderboard**: Top 5 best times displayed (stores up to 10 times)

### Tips

- No sound plays when lights turn green - you must watch carefully!
- Reaction times under 200ms are exceptional
- Times are saved in your browser's localStorage

## 🛠️ Technical Documentation

### Technology Stack

- **p5.js** - Canvas rendering and game loop
- **Web Audio API** - Sound generation using oscillators
- **localStorage** - Persistent score storage

### File Structure

```
f1-reaction-game/
├── index.html          # HTML structure and p5.js imports
├── sketch.js           # Main game logic and rendering
└── README.md           # Documentation
```

### Game Architecture

#### Game States

The game uses a finite state machine with the following states:

- `ready` - Waiting for player to start
- `lighting` - Red lights turning on sequentially
- `waiting` - Random delay before green lights
- `green` - Lights are green, waiting for player reaction
- `reacted` - Player reacted successfully
- `false_start` - Player pressed too early

#### Core Functions

**Setup & Initialization**
- `setup()` - Initializes canvas and loads saved times
- `initAudio()` - Creates Web Audio API context (triggered on first user interaction)

**Game Loop**
- `draw()` - Main game loop (60fps)
  - Renders lights, status text, and leaderboard
  - Manages state transitions
  - Handles timing logic

**Rendering**
- `drawLights()` - Draws 5 light indicators with current state
- `drawStatus()` - Displays game instructions and reaction time
- `drawLeaderboard()` - Shows top 5 times with medal icons

**Input Handling**
- `keyPressed()` - Detects SPACE (32) or TAB (9) key
- `handleInput()` - Processes input based on current game state

**Game Logic**
- `startRound()` - Resets state and begins light sequence
- `saveTimes()` / `loadTimes()` - Persist scores to localStorage

**Audio System**
- `playLightBeep()` - Beep sound for each red light (400 Hz)
- `playSuccessSound()` - Success feedback (400-600 Hz sweep)
- `playRecordSound()` - Triple beep for new records (600-800 Hz)
- `playFalseStartSound()` - Error sound for false starts (150-80 Hz)

### Sound Design

All sounds are generated programmatically using Web Audio API oscillators:

- **Red lights**: Sine wave at 400 Hz (150ms duration)
- **Success**: Sine wave sweep from 400-600 Hz
- **Record**: Three ascending beeps (600-800 Hz)
- **False start**: Sawtooth wave descending from 150-80 Hz

### Visual Design

- **Background**: Dark theme (#1a1a1a) for reduced eye strain
- **Lights**: 80x120px rounded rectangles with circular indicators
- **Colors**: 
  - Red (#FF0000) for active lights
  - Green (#00FF00) for go signal
  - Gray (#3C3C3C) for inactive lights

### Data Persistence

Times are stored as a JSON array in localStorage:
```javascript
localStorage.setItem('f1ReactionTimes', JSON.stringify(times));
```

- Maximum 10 times stored
- Automatically sorted ascending (fastest first)
- Persists across browser sessions

## 🚀 Local Development

1. Clone the repository:
```bash
git clone https://github.com/michelschep/f1-reaction-game.git
cd f1-reaction-game
```

2. Open `index.html` in a web browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

3. Or use a local server (recommended):
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# Then open http://localhost:8000
```

## 📝 Game Mechanics Details

### Light Sequence Timing
- Each red light: 1 second interval
- Total light-up phase: 5 seconds
- Random delay before green: 1-4 seconds (simulates real F1 variance)
- Total round time: 6-9 seconds

### Performance Benchmarks
- **< 200ms**: Professional level
- **200-300ms**: Very good
- **300-400ms**: Good
- **400-500ms**: Average
- **> 500ms**: Room for improvement

### Browser Compatibility
- Modern browsers with Web Audio API support
- Tested on Chrome, Firefox, Edge, Safari
- Requires JavaScript enabled
- localStorage for score persistence

## 🎯 Future Enhancements

Possible improvements:
- Add difficulty modes (shorter random delays)
- Multiplayer support
- Statistics (average, median, standard deviation)
- Visual reaction time graph
- Mobile touch support
- Social sharing of best times

## 📄 License

MIT License - Feel free to use and modify!

## 👨‍💻 Author

Created by Michel Schep
