# Persona-GenAI

A **persona-based conversational AI** built using the **Gemini API**, designed for the GenAI course assignment. This application enables custom-personality interactions—making the chat experience engaging, context-aware, and human-like.

---

## 🚀 Features

- **Persona-driven responses** – Customize tone, style, and behavior per persona.
- **Gemini API integration** – Leverages Gemini for natural and contextually rich replies.
- **Live chat interface** – Smooth and responsive UI using modern frontend technologies.
- **Modular architecture** – Clean separation between UI, persona logic, and API services.

---

## 📂 Project Structure

```
├── app/                 # Main application entry
├── components/          # Reusable UI components
├── lib/                 # Utility modules (e.g., API clients, persona handlers)
├── public/              # Static assets
├── styles/              # Global and component-specific styles
├── package.json         # Project metadata, scripts, and dependencies
├── pnpm-lock.yaml       # Dependency lockfile
├── tsconfig.json        # TypeScript configuration
├── next.config.mjs      # Next.js configuration
└── README.md            # This documentation
```

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) **v14 or higher**
- [pnpm](https://pnpm.io/) (or npm/yarn)
- **Gemini API key** from [Google AI Studio](https://makersuite.google.com/)

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sandeep5shetty/persona-genai.git
   cd persona-genai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   or with npm:
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root and add:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   or with npm:
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 💡 Usage

1. Choose or create a persona in the UI.
2. Start chatting — the AI will respond in the persona’s tone and style.
3. Modify or extend personas via `lib/` to experiment with different behaviors.

---

## 🌐 Deployment

You can deploy easily with [Vercel](https://vercel.com/):

1. Push your project to GitHub.
2. Import the repository into Vercel.
3. Add your `GEMINI_API_KEY` in Vercel’s environment variables.
4. Deploy — your app will be live in seconds.

---

## 🤝 Contributing

Pull requests are welcome! If you’d like to improve the UI, add more personas, or enhance functionality, fork the repo and submit a PR.  
Please make sure your code follows the existing style and passes all checks.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📧 Contact

**Author:** Sandeep Shetty  
📩 Email: your.email@example.com  
🔗 GitHub: [sandeep5shetty](https://github.com/sandeep5shetty)
