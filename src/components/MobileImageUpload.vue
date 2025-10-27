<template>
  <div class="space-y-4">
    <!-- Camera Actions -->
    <div class="grid grid-cols-2 gap-3">
      <button
        @click="takePhoto"
        class="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg active:scale-95"
      >
        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <span class="font-semibold">Take Photo</span>
      </button>

      <button
        @click="pickFromGallery"
        class="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg active:scale-95"
      >
        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span class="font-semibold">Gallery</span>
      </button>
    </div>

    <!-- Upload Area (fallback for web) -->
    <div
      v-if="!isNativePlatform"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      :class="[
        'border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer',
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50',
      ]"
      @click="fileInput?.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="text-center">
        <div class="mx-auto w-12 h-12 mb-3 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-700">Drop or click to upload</p>
      </div>
    </div>

    <!-- Image Previews -->
    <div v-if="images.length > 0" class="grid grid-cols-2 gap-3">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative group rounded-xl overflow-hidden shadow-lg"
      >
        <img :src="image.preview" :alt="`Note ${index + 1}`" class="w-full h-40 object-cover" />
        <div
          class="absolute inset-0 bg-black/50 opacity-0 group-active:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <button
            @click.stop="analyzeImage(index)"
            :disabled="isAnalyzing"
            class="p-3 bg-white rounded-xl active:scale-95 transition-transform"
            title="Analyze with AI"
          >
            <svg
              class="w-6 h-6 text-blue-600"
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
            class="p-3 bg-white rounded-xl active:scale-95 transition-transform"
            title="Remove"
          >
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          class="absolute top-2 right-2 p-2 bg-green-500 rounded-xl shadow-lg"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-200"
    >
      <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
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
      <div class="text-gray-700 whitespace-pre-wrap mb-4 max-h-48 overflow-y-auto">
        {{ analyzedText }}
      </div>
      <button
        @click="insertText"
        class="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
      >
        Insert into Note
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useSettingsStore } from "../stores/settings";
import OpenAI from "openai";

interface UploadedImage {
  file?: File;
  preview: string;
  analyzed: boolean;
  isAnalyzing: boolean;
}

const emit = defineEmits<{
  (e: "text-extracted", text: string): void;
}>();

const settingsStore = useSettingsStore();
const images = ref<UploadedImage[]>([]);
const isDragging = ref(false);
const isAnalyzing = ref(false);
const analyzedText = ref("");
const isNativePlatform = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  isNativePlatform.value = Capacitor.isNativePlatform();
});

async function takePhoto() {
  try {
    await vibrate();

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (image.dataUrl) {
      images.value.push({
        preview: image.dataUrl,
        analyzed: false,
        isAnalyzing: false,
      });
    }
  } catch (error) {
    console.error("Error taking photo:", error);
  }
}

async function pickFromGallery() {
  try {
    await vibrate();

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    if (image.dataUrl) {
      images.value.push({
        preview: image.dataUrl,
        analyzed: false,
        isAnalyzing: false,
      });
    }
  } catch (error) {
    console.error("Error picking from gallery:", error);
  }
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
  vibrate();
  images.value.splice(index, 1);
}

async function analyzeImage(index: number) {
  if (!settingsStore.isApiKeySet) {
    alert("Please set your OpenAI API key in Settings first!");
    return;
  }

  await vibrate();

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
    await vibrate(ImpactStyle.Medium);
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    alert(`Failed to analyze image: ${error.message}`);
  } finally {
    image.isAnalyzing = false;
    isAnalyzing.value = false;
  }
}

function insertText() {
  vibrate();
  emit("text-extracted", analyzedText.value);
  analyzedText.value = "";
}

async function vibrate(style: ImpactStyle = ImpactStyle.Light) {
  if (isNativePlatform.value) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      // Haptics not available, ignore
    }
  }
}
</script>
