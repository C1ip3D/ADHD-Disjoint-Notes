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
          <router-link
            to="/dashboard"
            class="px-6 py-3 bg-[#C4E0F9] text-black rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
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
          </router-link>
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
              class="absolute inset-0 w-full h-full flex items-center justify-center bg-[#266DD3]"
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
    title: "How to take Math Notes",
    description: "Learn quick metho",
    embedUrl:
      "https://drive.google.com/file/d/182J3ZOLN7sWy2F_MKUSp6hwq7yUtzYTF/preview",
  },
  {
    id: "2",
    title: "What is Focusly?",
    description:
      "Discover how Focusly helps you stay focused and study smarter.",
    embedUrl:
      "https://drive.google.com/file/d/1BuStehk5f5Zpg11ZRby2rh1UK1966E2g/preview",
  },
  {
    id: "3",
    title: "What is the optimal Study Time",
    description:
      "Find the best times and durations to study for maximum retention.",
    embedUrl:
      "https://drive.google.com/file/d/1hZFK7AlKlC6NdH3rl8ucpl_lAMUvFgEq/preview",
  },
  {
    id: "4",
    title: "How to take Science Notes",
    description:
      "Capture experiments and concepts effectively using structured notes.",
    embedUrl:
      "https://drive.google.com/file/d/1srfvPfp54G4HoTKCEoZM-WdZQHhS-kch/preview",
  },
  {
    id: "5",
    title: "How to take English Notes",
    description:
      "Learn to record themes, quotes, and ideas for essays efficiently.",
    embedUrl:
      "https://drive.google.com/file/d/1yi7-XHCTQlbRe-kyhJp0MgpZsLq5b0-z/preview",
  },
  {
    id: "6",
    title: "How to take History Notes",
    description:
      "Master timeline-based note-taking to connect events and causes easily.",
    embedUrl:
      "https://drive.google.com/file/d/1yvTvL7-ewqHBKBLcZNne_DPba7IOORHA/preview",
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
