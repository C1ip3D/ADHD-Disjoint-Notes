# 🎨 NoteFlow - AI-Powered Note Taking for ADHD Students

A beautifully designed Vue 3 application that helps ADHD students capture, organize, and analyze their notes using cutting-edge AI technology. Upload images, extract text, and let AI find the connections you missed.

## ✨ Features

### 📝 **Intelligent Note Taking**
- **Text Editor**: Distraction-free markdown editor with live preview
- **Image Upload**: Snap photos of handwritten notes and upload them
- **AI Text Extraction**: Automatically extract and transcribe text from images using GPT-4 Vision
- **Auto-Save**: Never lose your work with automatic background saving
- **Draft Recovery**: Resume where you left off with localStorage drafts

### 🤖 **AI-Powered Analysis**
- **Smart Insights**: AI analyzes your notes to find connections between concepts
- **Knowledge Gap Detection**: Identify areas that need more study
- **Study Suggestions**: Get personalized recommendations for deeper understanding
- **Subject-Based Analysis**: Tailored analysis for Math, History, Science, and more

### 🎯 **ADHD-Friendly Design**
- **Minimal UI**: Clean, Apple/Cluely-inspired interface
- **Smooth Animations**: Delightful transitions that don't distract
- **Visual Organization**: Color-coded subjects and clear hierarchies
- **Quick Actions**: Everything is just one click away

### 🔐 **Privacy & Security**
- **Local API Key Storage**: Your OpenAI API key stays on your device
- **Firebase Authentication**: Secure user accounts
- **Cloud Sync**: Access your notes from anywhere

## 🚀 Quick Start

### Web App

### Prerequisites

- **Node.js** 20.19.0 or higher
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **Firebase Project** (Optional) - For authentication and cloud storage

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### 📱 Mobile App (iOS/Android)

NoteFlow is also available as a **native mobile app**! 

**Quick Setup:**
```bash
npm run build
npx cap add ios      # For iOS
npx cap add android  # For Android
npm run mobile:ios   # Open in Xcode
```

See **[MOBILE_QUICK_START.md](MOBILE_QUICK_START.md)** for detailed instructions.

**Mobile Features:**
- 📷 Native camera integration
- 📁 Photo gallery access
- 📳 Haptic feedback
- 🔌 Works offline
- 🚀 Native performance

## 🔧 Configuration

### OpenAI Setup (Required for AI Features)

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. In the app, click the **Settings** ⚙️ button in the navigation
3. Paste your API key and click **Save**
4. Your key is stored locally and never sent to our servers

### Firebase Setup (Optional - For Full Features)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** and **Authentication**
3. Update `src/services/firebase.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 📱 How to Use

### 1. **Create Your First Note**
- Click **"✍️ Take Notes"** in the navigation
- Choose between:
  - **Write** - Type your notes with markdown support
  - **Image** - Upload photos of handwritten notes
  - **Preview** - See how your notes will look

### 2. **Upload & Extract Images**
- Switch to the **📷 Image** tab
- Drag & drop images or click to browse
- Click **Analyze** button on any image
- AI will extract the text automatically
- Click **Insert into Note** to add it to your note

### 3. **Organize Your Notes**
- Notes are automatically categorized by subject
- Choose from: Math, History, Science, Literature, or General
- All notes are saved with timestamps

### 4. **AI Analysis**
- Go to **"📚 My Notes"**
- Click **"AI Analyze"** on any subject group
- AI will:
  - Create a structured summary
  - Find connections between concepts
  - Identify knowledge gaps
  - Suggest study questions
- Export the analysis as a Markdown file

## 🎨 Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: TailwindCSS v4 with custom animations
- **State Management**: Pinia
- **Routing**: Vue Router
- **Backend**: Firebase (Firestore + Auth)
- **AI**: OpenAI GPT-4 & GPT-4 Vision
- **Markdown**: marked.js

## 📂 Project Structure

```
src/
├── components/
│   ├── NoteEditor.vue       # Main editor with tabs (Write/Image/Preview)
│   ├── ImageUpload.vue      # Image upload & AI text extraction
│   ├── NotesList.vue        # Beautiful note cards with subjects
│   ├── MergeViewer.vue      # AI analysis results display
│   ├── SettingsModal.vue    # API key configuration
│   └── SubjectSelector.vue  # Subject categorization
├── stores/
│   ├── notes.ts            # Notes state management
│   ├── auth.ts             # Authentication state
│   └── settings.ts         # API key management
├── services/
│   ├── firebase.ts         # Firebase configuration
│   ├── aiProvider.ts       # AI provider interface
│   └── openaiProvider.ts   # OpenAI implementation
└── views/
    ├── HomeView.vue        # Landing page with animations
    ├── EditorView.vue      # Note editor page
    ├── NotesView.vue       # Notes list page
    └── MergeView.vue       # Analysis results page
```

## 🎯 Key Features Explained

### Image to Text (OCR)
Uses GPT-4 Vision API to:
- Extract handwritten or printed text
- Preserve formatting and structure
- Convert equations to LaTeX
- Describe diagrams and charts

### AI Note Analysis
Uses GPT-3.5/4 to:
- Summarize multiple notes
- Find conceptual relationships
- Identify missing information
- Generate study questions

### Smart Auto-Save
- Saves draft every 2 seconds while typing
- Recovers drafts on page reload
- Clears after successful save

## 💻 Development

### Web Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Mobile Development
```bash
# Setup mobile platforms
npm run mobile:setup

# Open iOS in Xcode
npm run mobile:ios

# Open Android in Android Studio
npm run mobile:android

# Run on iOS device/simulator
npm run mobile:run:ios

# Run on Android device/emulator
npm run mobile:run:android
```

📱 **Full mobile guide:** [MOBILE_SETUP.md](MOBILE_SETUP.md)

## 🎨 Design Philosophy

Inspired by **Apple** and **Cluely**, NoteFlow features:
- 🌈 Gradient accents (blue → purple → pink)
- 🪟 Frosted glass effects (backdrop-blur)
- ⚡ Smooth micro-interactions
- 🎭 Thoughtful animations
- 📐 Generous whitespace
- 🎯 Clear visual hierarchy

## 🤝 Tips for ADHD Users

1. **Use Image Upload**: Don't transcribe - just snap and let AI handle it
2. **Auto-Save Has Your Back**: Don't worry about saving manually
3. **One Note at a Time**: Focus on capturing ideas, organize later
4. **Let AI Connect the Dots**: Review analysis to see the big picture
5. **Subject Colors**: Use visual cues to navigate your notes quickly

## 📝 Roadmap

- [ ] Voice-to-text notes
- [ ] Spaced repetition flashcards
- [ ] Study timer with breaks
- [ ] Note templates
- [ ] Collaborative notes
- [ ] Mobile app

## 🐛 Troubleshooting

**AI not working?**
- Check that your OpenAI API key is set in Settings
- Ensure you have credits on your OpenAI account

**Images not uploading?**
- Supported formats: JPG, PNG, WebP, GIF
- Max size: varies by browser

**Notes not syncing?**
- Check Firebase configuration
- Ensure you're signed in

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Credits

Built with ❤️ for students with ADHD who deserve better tools for learning.

---

**Ready to transform your note-taking?** 🚀 Start the server and visit `http://localhost:5173`
