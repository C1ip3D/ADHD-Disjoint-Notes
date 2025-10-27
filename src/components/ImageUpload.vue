<template>
  <div class="space-y-4">
    <!-- Quick Action Buttons -->
    <div class="grid grid-cols-3 gap-3">
      <button
        @click="openCamera"
        class="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
      >
        <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <span class="text-sm font-semibold">Camera</span>
      </button>

      <button
        @click="imageInput?.click()"
        class="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
      >
        <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span class="text-sm font-semibold">Images</span>
      </button>

      <button
        @click="docInput?.click()"
        class="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
      >
        <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          ></path>
        </svg>
        <span class="text-sm font-semibold">Documents</span>
      </button>
    </div>

    <!-- Hidden File Inputs -->
    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />
    <input
      ref="docInput"
      type="file"
      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xlsx,.xls,.csv,.md,.rtf,.odt,.ods,.odp"
      multiple
      class="hidden"
      @change="handleDocumentSelect"
    />

    <!-- Upload Area -->
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      :class="[
        'border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer',
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50',
      ]"
      @click="imageInput?.click()"
    >
      <div class="text-center">
        <div class="mx-auto w-12 h-12 mb-3 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-700 mb-1">
          {{ isDragging ? "Drop files here" : "Upload files" }}
        </p>
        <p class="text-xs text-gray-500">Images, PDFs, Word, Excel, PowerPoint, Text files</p>
      </div>
    </div>

    <!-- Camera Modal -->
    <Teleport to="body">
      <div
        v-if="showCamera"
        class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      >
        <div class="max-w-4xl w-full">
          <div class="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white flex items-center justify-between"
            >
              <h3 class="text-xl font-bold">Take Photo</h3>
              <button
                @click="closeCamera"
                class="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="p-6">
              <video
                ref="videoElement"
                autoplay
                playsinline
                class="w-full rounded-2xl bg-black mb-4"
              ></video>
              <canvas ref="canvasElement" class="hidden"></canvas>
              <div class="flex justify-center gap-4">
                <button
                  @click="capturePhoto"
                  class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg flex items-center gap-2"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                  </svg>
                  Capture Photo
                </button>
                <button
                  @click="closeCamera"
                  class="px-8 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Image Previews -->
    <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative group rounded-xl overflow-hidden shadow-lg"
      >
        <img :src="image.preview" :alt="`Note ${index + 1}`" class="w-full h-32 object-cover" />
        <div
          class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <button
            @click.stop="analyzeImage(index)"
            :disabled="isAnalyzing"
            class="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            title="Analyze with AI"
          >
            <svg
              class="w-5 h-5 text-blue-600"
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
          </button>
          <button
            @click.stop="removeImage(index)"
            class="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            title="Remove"
          >
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Analysis Status -->
        <div
          v-if="image.isAnalyzing"
          class="absolute inset-0 bg-blue-500/90 flex items-center justify-center"
        >
          <div class="text-center text-white">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"
            ></div>
            <p class="text-sm font-medium">Analyzing...</p>
          </div>
        </div>

        <div
          v-else-if="image.analyzed"
          class="absolute top-2 right-2 p-1.5 bg-green-500 rounded-lg"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Analyzed Text -->
    <div
      v-if="analyzedText"
      class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
    >
      <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        AI-Extracted Text
      </h3>
      <div class="prose max-w-none text-gray-700 whitespace-pre-wrap">{{ analyzedText }}</div>
      <button
        @click="insertText"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
      >
        Insert into Note
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "../stores/settings";
import OpenAI from "openai";

interface UploadedImage {
  file?: File;
  preview: string;
  analyzed: boolean;
  isAnalyzing: boolean;
  type?: string;
}

const emit = defineEmits<{
  (e: "text-extracted", text: string): void;
}>();

const settingsStore = useSettingsStore();
const images = ref<UploadedImage[]>([]);
const isDragging = ref(false);
const isAnalyzing = ref(false);
const analyzedText = ref("");
const showCamera = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);
const docInput = ref<HTMLInputElement | null>(null);

async function openCamera() {
  try {
    showCamera.value = true;
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for modal to render

    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, // Use back camera on mobile
    });

    if (videoElement.value) {
      videoElement.value.srcObject = stream.value;
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Could not access camera. Please check permissions.");
    closeCamera();
  }
}

function closeCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }
  showCamera.value = false;
}

function capturePhoto() {
  if (!videoElement.value || !canvasElement.value) return;

  const canvas = canvasElement.value;
  const video = videoElement.value;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    images.value.push({
      preview: dataUrl,
      analyzed: false,
      isAnalyzing: false,
      type: "image",
    });
  }

  closeCamera();
}

function handleDocumentSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push({
        file,
        preview: getDocumentIcon(file.type),
        analyzed: false,
        isAnalyzing: false,
        type: "document",
      });

      // Auto-analyze documents
      analyzeImage(images.value.length - 1);
    };
    reader.readAsDataURL(file);
  });
}

function getDocumentIcon(mimeType: string): string {
  // Return data URL for document icon based on type
  if (mimeType.includes("pdf")) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ef4444' viewBox='0 0 24 24'%3E%3Cpath d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'/%3E%3C/svg%3E";
  } else if (mimeType.includes("word") || mimeType.includes("document")) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%232563eb' viewBox='0 0 24 24'%3E%3Cpath d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'/%3E%3C/svg%3E";
  } else if (mimeType.includes("sheet") || mimeType.includes("excel") || mimeType.includes("csv")) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2316a34a' viewBox='0 0 24 24'%3E%3Cpath d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'/%3E%3C/svg%3E";
  } else if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ea580c' viewBox='0 0 24 24'%3E%3Cpath d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'/%3E%3C/svg%3E";
  } else if (mimeType.includes("text")) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%239333ea' viewBox='0 0 24 24'%3E%3Cpath d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'/%3E%3C/svg%3E";
  }
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%236b7280' viewBox='0 0 24 24'%3E%3Cpath d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'/%3E%3C/svg%3E";
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer?.files || []);
  addImages(files);
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  addImages(files);
}

function addImages(files: File[]) {
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  imageFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push({
        file,
        preview: e.target?.result as string,
        analyzed: false,
        isAnalyzing: false,
      });
    };
    reader.readAsDataURL(file);
  });
}

function removeImage(index: number) {
  images.value.splice(index, 1);
}

async function analyzeImage(index: number) {
  if (!settingsStore.isApiKeySet) {
    alert("Please set your OpenAI API key in Settings first!");
    return;
  }

  const image = images.value[index];
  if (!image) return;

  image.isAnalyzing = true;
  isAnalyzing.value = true;

  try {
    const openai = new OpenAI({
      apiKey: settingsStore.apiKey,
      dangerouslyAllowBrowser: true,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract and transcribe all text from this image of notes. Format it clearly and maintain the structure. If there are diagrams or equations, describe them or convert them to markdown/LaTeX format.",
            },
            {
              type: "image_url",
              image_url: {
                url: image.preview,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    const extractedText = response.choices[0]?.message?.content || "";
    analyzedText.value = extractedText;
    image.analyzed = true;
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    alert(`Failed to analyze image: ${error.message}`);
  } finally {
    image.isAnalyzing = false;
    isAnalyzing.value = false;
  }
}

function insertText() {
  emit("text-extracted", analyzedText.value);
  analyzedText.value = "";
}
</script>
