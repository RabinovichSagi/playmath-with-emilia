# PlayMath with Emilia

A web-based collection of interactive math games designed for 2nd-grade students, created with love for Emilia to make learning math fun and engaging.

## Project Overview

PlayMath with Emilia is a modular web application that provides a collection of custom-tailored math games. The application is designed to help children practice various math concepts while tracking their progress and performance. The system includes both student and parent interfaces to ensure a complete learning experience.

## Features

### Student Interface
- Interactive menu to select different math games
- Engaging and child-friendly UI
- Progress tracking and achievements
- Adaptive difficulty levels
- Immediate feedback on answers
- Fun animations and rewards

### Parent Interface
- Performance statistics and progress reports
- Game settings and difficulty adjustments
- Learning path customization
- Achievement tracking
- Time spent on each concept

### Core Math Concepts (Initial Release)
- Basic addition and subtraction
- Number recognition and place value
- Simple multiplication concepts
- Basic geometry
- Time and money
- Measurement basics

## Technical Stack

- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Data Storage**: Local Storage (for offline functionality)
- **No External Dependencies**: Pure vanilla implementation for simplicity and performance

## Implementation Guidelines
Colors - see ./color-palette.md


## Game Modules

Each game module will be self-contained and follow a consistent interface:
- Game initialization
- Difficulty settings
- Progress tracking
- Performance metrics
- Parent controls

### Game Flow Requirements
- Each question allows for multiple attempts:
  1. First attempt: Check answer
  2. If wrong: "נסה שוב" (Try Again) button appears, allowing a second attempt
  3. If wrong again: "הצג תשובה" (Show Answer) button appears
  4. After showing answer: "המשך" (Continue) button appears to move to next question
- Immediate feedback on answers (correct/incorrect)
- Clear visual indication of correct/incorrect answers
- Progress tracking between attempts


## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required

## Contributing

This is a personal project, but suggestions and improvements are welcome. Please feel free to submit issues or pull requests.

## License

This project is private and personal.

## Contact

For any questions or suggestions, please contact the repository owner. 