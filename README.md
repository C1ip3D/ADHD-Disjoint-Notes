# Note Coherence Tool

A Vue 3 application designed to help ADHD students organize and analyze their notes using AI-powered insights.

## Features

- **Quick Note Capture**: Distraction-free note-taking with auto-save
- **Markdown Support**: Rich text formatting with live preview
- **Subject Organization**: Categorize notes by subject (Math, History, Science, etc.)
- **AI Analysis**: Process notes to find connections and identify knowledge gaps
- **Visual Connections**: See relationships between concepts
- **Export Functionality**: Download analyzed notes as markdown files

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Backend**: Firebase (Firestore + Auth)
- **AI**: OpenAI API (with mock provider for MVP)
- **Markdown**: marked.js

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- Firebase project (optional for MVP)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Firebase Setup (Optional)

To enable full functionality:

1. Create a Firebase project
2. Update `src/services/firebase.ts` with your Firebase config
3. Set up Firestore database
4. Configure authentication if needed

### OpenAI Setup (Optional)

To enable AI analysis:

1. Get an OpenAI API key
2. Update the OpenAI provider configuration
3. Replace the mock provider in `MergeViewer.vue`

## Project Structure

```
src/
├── components/
│   ├── NoteEditor.vue          # Main note-taking interface
│   ├── NotesList.vue           # Display and manage notes
│   ├── MergeViewer.vue         # AI analysis results
│   └── SubjectSelector.vue     # Subject categorization
├── services/
│   ├── firebase.ts             # Firebase configuration
│   ├── aiProvider.ts           # AI provider interface
│   └── openaiProvider.ts       # OpenAI implementation
├── stores/
│   └── notes.ts                # Pinia store for notes
├── views/
│   ├── HomeView.vue            # Landing page
│   ├── EditorView.vue          # Note-taking page
│   ├── NotesView.vue           # Notes management
│   └── MergeView.vue           # Analysis results
└── router/
    └── index.ts                # Vue Router configuration
```

## Usage

1. **Take Notes**: Use the editor to quickly capture thoughts and ideas
2. **Organize**: Assign subjects to your notes for better organization
3. **Analyze**: Select multiple notes to see AI-generated insights
4. **Export**: Download structured summaries and analysis

## ADHD-Friendly Features

- Minimal, distraction-free interface
- Auto-save functionality
- Visual indicators for different note types
- Clear progress feedback
- Simple navigation

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT License
