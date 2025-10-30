<template>
  <div
    class="h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex flex-col overflow-hidden"
    style="padding-top: max(env(safe-area-inset-top), 0)"
  >
    <!-- Header -->
    <div class="bg-white shadow-lg p-4 sm:p-6">
      <div class="max-w-4xl mx-auto flex items-center gap-3">
        <button
          @click="goBack"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            class="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <div
          class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
            AI Chat Assistant
          </h1>
          <p class="text-xs sm:text-sm text-gray-600">
            Ask me anything about your studies
          </p>
        </div>
      </div>
    </div>

    <!-- Chat Container -->
    <div
      class="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto pb-40"
    >
      <!-- Messages -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">
            Welcome to AI Assistant!
          </h3>
          <p class="text-gray-600 text-sm">
            Ask me anything about your notes, studies, or learning!
          </p>
        </div>

        <!-- Messages -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start',
          ]"
        >
          <div
            :class="[
              'max-w-[80%] rounded-2xl px-4 py-3 shadow-md',
              message.role === 'user'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-800',
            ]"
          >
            <div
              v-if="message.role === 'assistant'"
              v-html="renderMarkdown(message.content)"
              class="prose prose-sm max-w-none"
            ></div>
            <p v-else class="whitespace-pre-wrap">{{ message.content }}</p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-white rounded-2xl px-4 py-3 shadow-md">
            <div class="flex gap-2">
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0ms"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 150ms"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 300ms"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div
        class="bg-[#C4E0F9] border-t border-gray-300 p-4 fixed left-0 right-0 z-40"
        style="
          bottom: 100px;
          padding-bottom: 1rem;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        "
      >
        <form
          @submit.prevent="sendMessage"
          class="flex gap-2 max-w-4xl mx-auto"
        >
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Ask me anything about your studies..."
            :disabled="isLoading"
            class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isLoading"
            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { marked } from "marked";
import { useNotesStore } from "../stores/notes";
import { secureAI } from "../services/secureAIProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const router = useRouter();
const notesStore = useNotesStore();

const messages = ref<Message[]>([]);
const inputMessage = ref("");
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

function goBack() {
  router.push("/dashboard");
}

// Get full notes context for AI
const fullNotesContext = computed(() => {
  const allNotes = notesStore.notes;

  if (allNotes.length === 0) {
    return "The user has no saved notes yet.";
  }

  // Provide comprehensive context
  const notesSummary = allNotes
    .slice(0, 20) // Last 20 notes
    .map((note, index) => {
      const preview =
        note.content.length > 500
          ? note.content.substring(0, 500) + "..."
          : note.content;
      return `[Note ${index + 1}] Subject: ${
        note.subject
      }\nContent: ${preview}`;
    })
    .join("\n\n");

  const subjectStats = allNotes.reduce((acc, note) => {
    acc[note.subject] = (acc[note.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statsText = Object.entries(subjectStats)
    .map(([subject, count]) => `${subject}: ${count} notes`)
    .join(", ");

  return `Total Notes: ${allNotes.length}
Subjects: ${statsText}

Recent Notes:
${notesSummary}`;
});

function renderMarkdown(content: string): string {
  return marked(content) as string;
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = inputMessage.value.trim();
  inputMessage.value = "";

  // Add user message
  messages.value.push({
    role: "user",
    content: userMessage,
  });

  scrollToBottom();
  isLoading.value = true;

  try {
    // Build context-aware system prompt
    const systemPrompt = `You are a helpful AI study assistant. You have access to the user's notes and can help with studying, organizing thoughts, and understanding concepts.

Context about user's notes:
${fullNotesContext.value}

Be helpful, encouraging, and provide study tips when relevant. If the user asks about their notes, reference them specifically.`;

    const response = await secureAI.chat([
      { role: "system", content: systemPrompt },
      ...messages.value.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]);

    messages.value.push({
      role: "assistant",
      content: response,
    });

    scrollToBottom();
  } catch (error) {
    console.error("Chat error:", error);
    messages.value.push({
      role: "assistant",
      content:
        "I apologize, but I encountered an error. Please try again later.",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.prose {
  color: inherit;
}
.prose p {
  margin-bottom: 0.5rem;
}
.prose ul,
.prose ol {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
}
.prose code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>
