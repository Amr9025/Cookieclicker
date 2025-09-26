# 🍪 Cookie Clicker Start Menu

A beautiful and interactive start menu for a Cookie Clicker game with modern UI design and smooth animations.

## Features

### Main Menu
- **Start New Game** - Begin a fresh cookie clicking adventure
- **Load Game** - Load from up to 3 save slots with progress tracking
- **Settings** - Customize sound, music, and game preferences
- **Credits** - View game information and credits

### Visual Effects
- Animated gradient background
- Falling cookie rain animation
- Smooth button hover effects
- Bouncing cookie logo
- Particle effects on button clicks

### Functionality
- **Save System**: Supports 3 save slots with automatic save data detection
- **Settings**: Volume controls, auto-save toggle, animation toggle
- **Keyboard Shortcuts**: 
  - `1` - Start New Game
  - `2` - Load Game
  - `3` - Settings  
  - `4` - Credits
  - `ESC` - Close any open modal
  - `ENTER` - Start New Game
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Saves settings and game progress locally

## Files

- `index.html` - Main start menu page
- `Game.css` - Styling and animations
- `menu.js` - Interactive functionality and game logic
- `game.html` - Simple demo game page
- `README.md` - This documentation

## How to Use

1. Open `index.html` in a web browser
2. Use the menu buttons to navigate:
   - **Start New Game**: Begins a new game session
   - **Load Game**: Opens modal to select from saved games
   - **Settings**: Adjust volume, auto-save, and animations
   - **Credits**: View game information

## Technical Details

### Browser Compatibility
- Modern browsers with ES6+ support
- CSS Grid and Flexbox support required
- Local Storage support for save functionality

### Customization
- Easy to modify colors in `Game.css`
- Button styles and animations can be customized
- Add new menu options by extending the HTML and JavaScript

### Save System
The menu automatically detects and displays save data from localStorage:
- Save slots show date, cookie count, and cookies per second
- Empty slots are clearly marked
- Load buttons are disabled for empty slots

## Demo Features

The included demo game (`game.html`) shows:
- Basic cookie clicking mechanics
- Auto-save functionality every 5 seconds
- Navigation back to the start menu

## Future Enhancements

Potential additions for a full game:
- Sound effects and background music
- More detailed save information
- Achievement system
- Multiple game modes
- Online leaderboards

## Installation

1. Place all files in your web server directory (e.g., `htdocs` for XAMPP)
2. Access via `http://localhost/Cookieclicker/`
3. No additional dependencies required - uses vanilla HTML, CSS, and JavaScript

Enjoy clicking those cookies! 🍪
