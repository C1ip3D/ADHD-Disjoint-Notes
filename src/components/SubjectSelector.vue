<template>
  <div class="space-y-3">
    <div class="flex items-center space-x-3">
      <label class="text-sm font-medium text-gray-700">
        {{ hasCanvasCourses ? "Class:" : "Subject:" }}
      </label>
      <div class="flex-1">
        <select
          :value="selectedSubject"
          @change="
            $emit(
              'update:selectedSubject',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white text-gray-900"
        >
          <!-- Canvas Courses if available -->
          <template v-if="hasCanvasCourses">
            <option value="General" class="text-gray-900">
              General (No Class)
            </option>
            <option
              v-for="course in canvasCourses"
              :key="course.id"
              :value="course.name"
              class="text-gray-900"
            >
              {{ course.name }}
            </option>
          </template>
          <!-- Fallback to default subjects -->
          <template v-else>
            <option value="General" class="text-gray-900">General</option>
            <option value="Math" class="text-gray-900">Math</option>
            <option value="Science" class="text-gray-900">Science</option>
            <option value="History" class="text-gray-900">History</option>
            <option value="Literature" class="text-gray-900">Literature</option>
            <option value="Language" class="text-gray-900">Language</option>
            <option value="Other" class="text-gray-900">Other</option>
          </template>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "../stores/settings";

const props = defineProps<{
  selectedSubject: string;
  noteContent: string;
}>();

const emit = defineEmits<{
  "update:selectedSubject": [value: string];
}>();

const settingsStore = useSettingsStore();

// Canvas integration
const hasCanvasCourses = computed(() => {
  return settingsStore.settings.canvasCourses.length > 0;
});

const canvasCourses = computed(() => {
  return settingsStore.settings.canvasCourses;
});

function selectSubject(subject: string) {
  emit("update:selectedSubject", subject);
}
</script>
