# Minecraft Study Buddy 🎮📚

A beautiful, static website that transforms complex study materials into easy-to-understand Minecraft analogies using Google's Gemini API with Grounded Search and advanced reasoning capabilities.

## Features

- **AI-Powered Analogies**: Uses Gemini 2.5 Flash model with thinking capabilities for intelligent, creative analogies
- **Grounded Search**: Leverages Google Search integration to ensure accurate, up-to-date information
- **Beautiful UI**: Minecraft-themed design with smooth animations and responsive layout
- **Source Citations**: Displays sources used by the AI for transparency
- **Copy to Clipboard**: Easily copy generated analogies for use in notes
- **API Key Storage**: Securely stores your API key in browser's local storage
- **Keyboard Shortcuts**: Press Ctrl+Enter to quickly generate analogies

## How It Works

1. **Enter Study Material**: Paste any definition, concept, or study material you want to understand better
2. **Generate**: Click the button or press Ctrl+Enter
3. **Learn**: Read your custom Minecraft analogy that makes the concept easier to understand!

## Getting Started

### Prerequisites

- A modern web browser
- A Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. Clone or download this repository
2. Open `script.js` and replace `'YOUR_API_KEY_HERE'` with your actual Gemini API key:
   ```javascript
   const GEMINI_API_KEY = 'your-actual-api-key-here';
   ```
3. Open `index.html` in your web browser
4. Start creating analogies!

## API Configuration

This project uses:
- **Model**: `gemini-2.5-flash`
- **Tools**: Google Search grounding for accurate, real-time information
- **Reasoning**: Advanced thinking capabilities for better analogy creation
- **Safety**: Built-in content safety filters

## Files

- `index.html` - Main HTML structure
- `styles.css` - Beautiful Minecraft-themed styling
- `script.js` - JavaScript for API integration and interactivity
- `README.md` - This file

## Example Use Cases

- **Biology**: Understanding photosynthesis through Minecraft farming mechanics
- **Chemistry**: Learning about chemical reactions using crafting recipes
- **Physics**: Grasping gravity concepts through Minecraft physics
- **Computer Science**: Understanding algorithms via redstone circuits
- **Mathematics**: Learning mathematical concepts through Minecraft building patterns

## Privacy & Security

- API key is embedded in the JavaScript file (not exposed in the UI)
- No data is sent to any server except Google's Gemini API
- This is a completely client-side application
- **Note**: For production use, consider implementing a backend to keep your API key secure

## Technologies Used

- HTML5
- CSS3 (with custom animations)
- Vanilla JavaScript
- Google Gemini API
- Google Search Grounding

## Contributing

Feel free to fork this project and customize it for your needs! Some ideas:
- Add support for different themes (not just Minecraft)
- Implement analogy history
- Add export to PDF functionality
- Create preset study topics

## License

This project is open source and available for educational purposes.

## Credits

- Powered by Google Gemini AI
- Minecraft is a trademark of Mojang Studios
- Created to help students learn more effectively

---

**Note**: This is a static website that runs entirely in your browser. Your API key and study materials are never stored on any server.
