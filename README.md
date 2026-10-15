# Rainbow Tools 🌈

**Rainbow Tools** is a lightweight, responsive collection of web-based mini-tools designed for everyday tasks. All tools run directly in your browser with zero server side processing required.

---

## 🛠️ Features & Included Tools

Rainbow Tools provides 6 handy utilities in a single fast, privacy-focused web app:

1. **Quick Calculator** (`MATH`): Perform everyday arithmetic calculations (+, −, ×, ÷, %).
2. **Word Counter** (`WRITING`): Count words, characters, and lines in real-time as you type or paste text.
3. **Color Generator** (`DESIGN`): Discover fresh HEX color codes, preview them, and copy them to your clipboard.
4. **Focus Timer** (`TIME`): Set customizable countdown timers for work, study, or focus sessions.
5. **To-do List** (`ORGANIZE`): Manage tasks with completion checkmarks and persistent storage in your browser (`localStorage`).
6. **Password Generator** (`PRIVACY`): Generate secure, random passwords on your device with configurable character sets (uppercase, lowercase, numbers, symbols).

### General Features
- 🔍 **Real-time Search**: Filter tools by name or keywords.
- 🌙 **Dark Mode**: Seamless toggle between light and dark themes.
- 🔊 **Sound Effects**: Optional sound feedback powered by the Web Audio API.
- 📱 **Responsive & Accessible**: Optimized for desktop, tablet, and mobile browsers.
- 🔒 **Privacy-First**: No data leaves your machine; settings and tasks remain in browser storage.

---

## 📁 Project Structure

```
.
├── index.html   # Main HTML page structure and semantic markup
├── style.css    # Responsive styles, theme variables, and dark mode support
└── script.js     # Client-side logic for tools, sound synthesis, and state management
```

---

## 🚀 Getting Started

Since Rainbow Tools is built using vanilla web technologies (HTML, CSS, JavaScript), no build tools or package installations are required!

### Running Locally

1. **Clone or download** this repository.
2. Open `index.html` directly in your web browser:
   - **Double-click** `index.html`, or
   - **Right-click** `index.html` > *Open With* > *Your Browser*.

Alternatively, you can serve the project using a simple static file server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000` or `http://localhost:3000` in your web browser.

---

## 📄 License

This project is free to use and modify for personal or commercial projects.
