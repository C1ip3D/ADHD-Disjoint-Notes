<template>
  <div
    class="learning-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4"
    style="
      padding-top: max(env(safe-area-inset-top), 1.5rem);
      padding-bottom: 1.5rem;
    "
  >
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center gap-4 mb-2">
          <div
            class="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Learning Center</h1>
            <p class="text-sm text-gray-600">
              Watch helpful study tips and techniques
            </p>
          </div>
        </div>
      </div>

      <!-- Videos Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="video in videos"
          :key="video.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
          @click="openVideo(video)"
        >
          <!-- Video Thumbnail -->
          <div class="relative w-full" style="padding-bottom: 56.25%">
            <div
              class="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600"
            >
              <div
                class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-10 h-10 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Video Info -->
          <div class="p-5">
            <h3
              class="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors"
            >
              {{ video.title }}
            </h3>
            <p class="text-sm text-gray-600">{{ video.description }}</p>
          </div>
        </div>
      </div>

      <!-- Fullscreen Landscape Video Modal -->
      <Teleport to="body">
        <Transition name="video-modal">
          <div
            v-if="activeVideoId"
            class="fixed inset-0 bg-black z-50 flex items-center justify-center"
            @click="closeVideo"
          >
            <button
              @click="closeVideo"
              class="absolute top-2 right-2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              style="
                top: max(env(safe-area-inset-top), 0.5rem);
                right: max(env(safe-area-inset-right), 0.5rem);
              "
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div class="w-full h-full" @click.stop>
              <iframe
                v-if="activeVideoId"
                :src="getActiveVideoUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Back to Dashboard -->
      <div class="flex justify-center pt-4">
        <router-link
          to="/dashboard"
          class="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Video {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
}

const videos = ref<Video[]>([
  {
    id: "1",
    title: "Study Techniques for Success",
    description:
      "Learn effective study methods to improve retention and understanding.",
    embedUrl:
      "https://drive.google.com/file/d/182J3ZOLN7sWy2F_MKUSp6hwq7yUtzYTF/preview",
  },
  {
    id: "2",
    title: "Note-Taking Strategies",
    description: "Master the art of taking organized and effective notes.",
    embedUrl:
      "https://drive.google.com/file/d/1BuStehk5f5Zpg11ZRby2rh1UK1966E2g/preview",
  },
  {
    id: "3",
    title: "Focus & Concentration Tips",
    description: "Discover techniques to maintain focus during study sessions.",
    embedUrl:
      "https://drive.google.com/file/d/1hZFK7AlKlC6NdH3rl8ucpl_lAMUvFgEq/preview",
  },
  {
    id: "4",
    title: "Time Management Essentials",
    description:
      "Learn how to manage your time effectively for better productivity.",
    embedUrl:
      "https://drive.google.com/file/d/1srfvPfp54G4HoTKCEoZM-WdZQHhS-kch/preview",
  },
]);

const activeVideoId = ref<string | null>(null);

const getActiveVideoUrl = computed(() => {
  if (!activeVideoId.value) return "";
  const video = videos.value.find((v) => v.id === activeVideoId.value);
  return video?.embedUrl || "";
});

function openVideo(video: Video) {
  activeVideoId.value = video.id;
}

function closeVideo() {
  activeVideoId.value = null;
}
</script>

<style scoped>
.learning-center {
  min-height: 100vh;
}

.video-modal-enter-active,
.video-modal-leave-active {
  transition: opacity 0.3s ease;
}

.video-modal-enter-from,
.video-modal-leave-to {
  opacity: 0;
}
</style>
