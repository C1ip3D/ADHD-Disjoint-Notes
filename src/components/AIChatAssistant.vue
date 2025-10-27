<template>
  <!-- Floating Chat Button -->
  <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
    <!-- Chat Window -->
    <Transition name="chat">
      <div
        v-if="isOpen"
        class="mb-4 w-[calc(100vw-2rem)] sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-blue-200"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-cyan-400 to-blue-500 px-4 sm:px-6 py-3 sm:py-4 text-white flex items-center justify-between"
        >
          <div class="flex items-center gap-2 sm:gap-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-base sm:text-lg">AI Assistant</h3>
              <p class="text-xs text-white/80">Ask me anything!</p>
            </div>
          </div>
          <button
            @click="isOpen = false"
            class="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-br from-gray-50 to-blue-50"
        >
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="text-center py-4 sm:py-8">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
            <h4 class="font-bold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2">
              Hi! I'm your AI Assistant
            </h4>
            <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Ask me about:</p>
            <div class="space-y-2">
              <button
                @click="askQuestion('Summarize my recent notes')"
                class="w-full px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm text-left"
              >
                Summarize my recent notes
              </button>
              <button
                @click="askQuestion('What are the main topics I studied?')"
                class="w-full px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm text-left"
              >
                What topics did I study?
              </button>
              <button
                @click="askQuestion('Give me study tips for ADHD')"
                class="w-full px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm text-left"
              >
                Study tips for ADHD
              </button>
            </div>
          </div>

          <!-- Message List -->
          <div v-for="(message, index) in messages" :key="index">
            <!-- User Message -->
            <div v-if="message.role === 'user'" class="flex justify-end">
              <div
                class="max-w-[85%] bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl sm:rounded-2xl rounded-tr-sm px-3 sm:px-4 py-2 sm:py-3 shadow-lg"
              >
                <p class="text-xs sm:text-sm">{{ message.content }}</p>
              </div>
            </div>

            <!-- AI Message -->
            <div v-else class="flex justify-start">
              <div
                class="max-w-[90%] bg-white rounded-xl sm:rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2 sm:py-3 shadow-lg border border-gray-200"
              >
                <div
                  class="prose prose-xs sm:prose-sm max-w-none"
                  v-html="renderMarkdown(message.content)"
                ></div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="flex justify-start">
            <div
              class="bg-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg border border-gray-200"
            >
              <div class="flex items-center gap-1.5 sm:gap-2">
                <div
                  class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
                ></div>
                <div
                  class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
                  style="animation-delay: 0.1s"
                ></div>
                <div
                  class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-bounce"
                  style="animation-delay: 0.2s"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 sm:p-4 bg-white border-t border-gray-200">
          <div class="flex items-end gap-2">
            <textarea
              v-model="inputMessage"
              @keydown.enter.prevent="sendMessage"
              placeholder="Ask me anything..."
              rows="2"
              class="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-blue-500 focus:outline-none resize-none text-xs sm:text-sm"
            ></textarea>
            <button
              @click="sendMessage"
              :disabled="!inputMessage.trim() || isLoading"
              class="p-2.5 sm:p-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg sm:rounded-xl hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5"
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
          </div>
        </div>
      </div>
    </Transition>

    <!-- Chat Button -->
    <button
      @click="toggleChat"
      class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
    >
      <svg
        v-if="!isOpen"
        class="w-6 h-6 sm:w-8 sm:h-8"
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
      <svg
        v-else
        class="w-6 h-6 sm:w-8 sm:h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>

      <!-- Notification Badge -->
      <div
        v-if="!isOpen && hasUnread"
        class="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full border-2 border-white"
      ></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import { useNotesStore } from "../stores/notes";
import OpenAI from "openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const notesStore = useNotesStore();
const route = useRoute();

const isOpen = ref(false);
const messages = ref<Message[]>([]);
const inputMessage = ref("");
const isLoading = ref(false);
const hasUnread = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// Get current page context
const currentPage = computed(() => {
  const path = route.path;
  if (path === "/editor") return "note editor";
  if (path === "/notes") return "notes list";
  if (path === "/merge") return "AI analysis results";
  return "home";
});

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
        note.content.length > 500 ? note.content.substring(0, 500) + "..." : note.content;
      return `[Note ${index + 1}] Subject: ${note.subject}\nContent: ${preview}`;
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

function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    hasUnread.value = false;
  }
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value) return;

  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    return;
  }

  const userMessage = inputMessage.value.trim();
  messages.value.push({ role: "user", content: userMessage });
  inputMessage.value = "";
  isLoading.value = true;

  await scrollToBottom();

  try {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const systemMessage = `You are an intelligent AI assistant for Focusly, a note-taking app designed for ADHD students.

CURRENT CONTEXT:
- User is on: ${currentPage.value}
- ${fullNotesContext.value}

YOUR CAPABILITIES:
You can see and analyze ALL of the user's notes above. You can:
- Answer specific questions about their notes
- Summarize notes by subject or topic
- Find connections between different notes
- Explain concepts from their notes
- Create practice questions based on their notes
- Provide ADHD-friendly study tips
- Help with homework and assignments
- General academic support

IMPORTANT:
- Reference SPECIFIC notes when answering (e.g., "In your Math note about...")
- Be concise and ADHD-friendly (short paragraphs, bullet points)
- Use markdown formatting for readability
- If they ask about notes you can see, give detailed answers
- Be supportive and encouraging

Current page context: The user is viewing the ${currentPage.value}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        ...messages.value.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage =
      response.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
    messages.value.push({ role: "assistant", content: aiMessage });

    if (!isOpen.value) {
      hasUnread.value = true;
    }

    await scrollToBottom();
  } catch (error: any) {
    console.error("Chat error:", error);
    messages.value.push({
      role: "assistant",
      content: "Sorry, I encountered an error. Please try again.",
    });
  } finally {
    isLoading.value = false;
  }
}

function askQuestion(question: string) {
  inputMessage.value = question;
  sendMessage();
}

function renderMarkdown(text: string): string {
  const result = marked(text);
  return typeof result === "string" ? result : "";
}

async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

watch(messages, scrollToBottom);
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
