import { defineComponent, getText } from '@semantic-ui/component';
const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  // Character position and game state (reactive)
  x: 200,
  y: 200,
  score: 0,
  highScore: 0,
  activePower: '',
  powerDuration: 0,

  lastUpdateTime: performance.now() * 0.001,
  
  // Collectible items state (reactive)
  collectibles: [],
  
  // Message log for demonstrating key events (reactive)
  messages: [],
  
  // Show/hide tutorial (reactive UI state)
  showTutorial: true
};

const createComponent = ({ self, state, reaction, bindKey, unbindKey }) => ({
  // Non-reactive properties on self
  playerSpeed: 5,
  powerMaxDuration: 5,
  keysHeld: {
    up: false,
    down: false,
    left: false,
    right: false
  },
  spawnTimer: 0,
  render: { lastTime: 0, fps: 0 },
  
  // Getter for template to access powerMaxDuration
  getMaxPowerDuration() {
    return self.powerMaxDuration;
  },
  
  initialize() {
    self.calculatePower();
    self.calculateTutorialKeybindings();

    // Set up the game loop
    self.calculateGame();
  },

  // Set up power activation monitoring
  calculatePower() {
    reaction(() => {
      const activePower = state.activePower.get();
      const duration = state.powerDuration.get();
      if (activePower && duration <= 0) {
        // Power expired
        state.activePower.set('');
        self.playerSpeed = 5;

        // Add message
        self.addMessage(`Power-up '${activePower}' expired`);
      }
    });
  },

  // Tutorial toggle dynamic binding
  calculateTutorialKeybindings() {
    reaction(() => {
      const showTutorial = state.showTutorial.get();

      if (showTutorial) {
        // When tutorial is shown, bind the 'h' key to hide it
        bindKey('h', () => {
          state.showTutorial.toggle(false);
          self.addMessage('Tutorial hidden (press ? to show again)');
        });

        // Unbind the ? key if it was previously bound
        unbindKey('?');
      }
      else {
        // When tutorial is hidden, bind the '?' key to show it
        bindKey('?', () => {
          state.showTutorial.set(true);
          self.addMessage('Tutorial shown (press h to hide)');
        });

        // Unbind the h key if it was previously bound
        unbindKey('h');
      }
    });
  },

  calculateGame() {
    // this is the main render loop, it does not need to call itself
    // as the reactivity handles rerendering
    reaction(() => {
      state.lastUpdateTime.get(); // reactive source
      requestAnimationFrame(self.gameLoop);
    });
  },
  
  // Game loop with proper timing based on advanced-ball-simulation
  gameLoop(currentTime) {
    // Convert to seconds
    currentTime *= 0.001;
    const deltaTime = currentTime - state.lastUpdateTime.peek();
    state.lastUpdateTime.set(currentTime);

    // Update character position based on current state
    self.updatePosition(deltaTime);

    // Update power-up duration
    self.updatePowerUps(deltaTime);

    // Update collectibles
    self.updateCollectibles(deltaTime);

    // Spawn new collectibles
    self.spawnTimer += deltaTime;
    if (self.spawnTimer > 2) { // Spawn every 2 seconds
      console.log('spawning');
      self.spawnCollectible();
      self.spawnTimer = 0;
    }
  },
  
  // Update character position based on key states
  updatePosition(deltaTime) {
    // Get current position and movement parameters
    let x = state.x.get();
    let y = state.y.get();
    
    // Calculate movement vector - this allows diagonal movement
    let dx = 0;
    let dy = 0;
    
    // Add movement for each direction
    if (self.keysHeld.up) dy -= 1;
    if (self.keysHeld.down) dy += 1;
    if (self.keysHeld.left) dx -= 1;
    if (self.keysHeld.right) dx += 1;
    
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx = dx / length;
      dy = dy / length;
    }
    
    // Apply movement with speed and time factor
    x += dx * self.playerSpeed * deltaTime * 60;
    y += dy * self.playerSpeed * deltaTime * 60;
    
    // Boundary checks to keep character in play area
    x = Math.max(20, Math.min(380, x));
    y = Math.max(20, Math.min(380, y));
    
    // Update state with new position
    state.x.set(x);
    state.y.set(y);
  },
  
  // Create a new collectible
  spawnCollectible() {
    // Create at a random position along the edge of the game area
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;
    
    switch (side) {
      case 0: // top edge
        x = Math.floor(Math.random() * 360) + 20; // 20-380 px
        y = 20; // Just inside the top edge
        break;
      case 1: // right edge
        x = 380; // Just inside the right edge
        y = Math.floor(Math.random() * 360) + 20; // 20-380 px
        break;
      case 2: // bottom edge
        x = Math.floor(Math.random() * 360) + 20; // 20-380 px
        y = 380; // Just inside the bottom edge
        break;
      case 3: // left edge
        x = 20; // Just inside the left edge
        y = Math.floor(Math.random() * 360) + 20; // 20-380 px
        break;
    }
    
    // Random type: coin or power-up
    const type = Math.random() < 0.7 ? 'coin' : 'power';
    
    const collectible = {
      x, // Integer position
      y, // Integer position
      type,
      active: true
    };
    
    // Add to state
    state.collectibles.push(collectible);
  },
  
  // Update collectibles position and check collisions
  updateCollectibles(deltaTime) {
    const playerX = state.x.get();
    const playerY = state.y.get();
    const collectibles = state.collectibles.get();
    
    const updatedCollectibles = collectibles
      .filter(item => item.active)
      .map(item => {
        // Move towards player
        const dx = playerX - item.x;
        const dy = playerY - item.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize direction and apply speed
        let moveSpeed = 2; // Base speed
        if (distance > 0) {
          const moveX = (dx / distance) * moveSpeed * deltaTime * 60;
          const moveY = (dy / distance) * moveSpeed * deltaTime * 60;
          
          item.x += moveX;
          item.y += moveY;
        }
        
        // Check collision with player (use a 30px collision radius)
        if (distance < 30) {
          // Collect the item
          item.active = false;
          if (item.type === 'coin') {
            self.collectCoin();
          }
          else {
            self.activateSpeedPower();
          }
        }
        
        return item;
      });
    
    // Remove inactive collectibles
    state.collectibles.set(updatedCollectibles.filter(item => item.active));
  },
  
  // Update power-up durations
  updatePowerUps(deltaTime) {
    // Check if a power-up is active
    if (state.activePower.get()) {
      const duration = state.powerDuration.get();
      
      // Decrease duration based on elapsed time
      if (duration > 0) {
        state.powerDuration.set(duration - deltaTime);
      }
    }
  },
  
  addMessage(message) {
    const messages = [...state.messages.get()];
    messages.unshift(message);
    
    // Keep only latest 5 messages
    if (messages.length > 5) {
      messages.pop();
    }
    
    state.messages.set(messages);
  },

  getPowerPercent() {
    const percent = (state.powerDuration.get() / self.powerMaxDuration) * 100;
    return percent;
  },
  
  // Power-up functions
  activateSpeedPower() {
    state.activePower.set('speed');
    self.playerSpeed = 10;
    state.powerDuration.set(self.powerMaxDuration);
    state.score.increment(10);
    self.addMessage('Speed power-up activated!');
  },
  
  collectCoin() {
    state.score.increment(5);
    self.addMessage('Coin collected! +5 points');
    
    // Update high score if needed
    if (state.score.get() > state.highScore.get()) {
      state.highScore.set(state.score.get());
    }
  },
  
  resetGame() {
    // Reset position
    state.x.set(200);
    state.y.set(200);
    
    // Reset powers
    self.playerSpeed = 5;
    state.activePower.set('');
    state.powerDuration.set(0);
    
    // Reset score
    state.score.set(0);
    
    // Clear collectibles
    state.collectibles.set([]);
    
    // Spawn new collectibles
    self.spawnCollectible();
    self.spawnCollectible();
    
    self.addMessage('Game reset');
  }
});

// Define all various types of key bindings
const keys = {
    // Using repeatedKey parameter to handle continuous key presses
  'w, up': ({ self, repeatedKey, inputFocused }) => {
    // Don't handle movement keys when input is focused
    if (inputFocused) return;
    
    // Set key held state for smooth movement
    self.keysHeld.up = true;
    
    // Only show message for initial press, not held down
    if (!repeatedKey) {
      self.addMessage('Moving up');
    }
  },
  
  's, down': ({ self, repeatedKey, inputFocused }) => {
    if (inputFocused) return;
    self.keysHeld.down = true;
    if (!repeatedKey) {
      self.addMessage('Moving down');
    }
  },
  
  'a, left': ({ self, repeatedKey, inputFocused }) => {
    if (inputFocused) return;
    self.keysHeld.left = true;
    if (!repeatedKey) {
      self.addMessage('Moving left');
    }
  },
  
  'd, right': ({ self, repeatedKey, inputFocused }) => {
    if (inputFocused) return;
    self.keysHeld.right = true;
    if (!repeatedKey) {
      self.addMessage('Moving right');
    }
  },

  'esc': ({ self }) => {
    self.resetGame();
  },

  'ctrl + s': ({ self, event }) => {
    event.preventDefault(); // Prevent browser save dialog
    self.addMessage('Saved game state (Ctrl+S)');
  },

  'shift + r': ({ self }) => {
    self.resetGame();
    self.addMessage('Game reset with Shift+R');
  },

  // Key sequences
  'up up down down left right left right': ({ self, state }) => {
    self.addMessage('Konami code activated! +100 points');
    state.score.increment(100);
  },

  'space': ({ self, inputFocused }) => {
    // Only activate if an input is not focused
    if (!inputFocused) {
      self.activateSpeedPower();
    }
  },
};

// Events for button interactions and keyup handling
const events = {
  'click .speed': ({ self }) => {
    self.activateSpeedPower();
  },
  
  
  'click .reset': ({ self }) => {
    self.resetGame();
  },
  
  'change ui-input.name-input': ({ self, data }) => {
    self.addMessage(`Typing: ${data.value}`);
  },
  
  // Global keyup events to handle key releases
  'global keyup window': ({ event, self }) => {
    // Handle key up events to release movement keys
    // Arrow keys
    if (event.key === 'ArrowUp') self.keysHeld.up = false;
    else if (event.key === 'ArrowDown') self.keysHeld.down = false;
    else if (event.key === 'ArrowLeft') self.keysHeld.left = false;
    else if (event.key === 'ArrowRight') self.keysHeld.right = false;
    
    // WASD keys
    else if (event.key === 'w' || event.key === 'W') self.keysHeld.up = false;
    else if (event.key === 's' || event.key === 'S') self.keysHeld.down = false;
    else if (event.key === 'a' || event.key === 'A') self.keysHeld.left = false;
    else if (event.key === 'd' || event.key === 'D') self.keysHeld.right = false;
  }
};

defineComponent({
  tagName: 'keyboard-master',
  template,
  css,
  keys,
  events,
  createComponent,
  defaultState
});
