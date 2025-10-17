<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">Note Coherence Tool</h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Transform your scattered notes into organized, coherent knowledge. Perfect for students
          with ADHD who need help structuring their thoughts and finding connections.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/auth"
            class="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-semibold shadow-lg inline-block"
          >
            <span class="text-black">Start Taking Notes</span>
          </router-link>
          <router-link
            to="/auth"
            class="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold shadow-lg border-2 border-primary-600 inline-block"
          >
            <span class="text-primary-600">View Your Notes</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Designed for ADHD Students</h2>
        <p class="text-lg text-gray-600">
          Simple, distraction-free tools that help you organize and understand your notes
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="bg-white rounded-lg p-6 shadow-lg">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Quick Note Capture</h3>
          <p class="text-gray-600">
            Take notes quickly with auto-save and minimal distractions. Markdown support for rich
            formatting.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white rounded-lg p-6 shadow-lg">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-green-600"
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
          <h3 class="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
          <p class="text-gray-600">
            AI analyzes your notes to find connections, identify gaps, and create structured
            summaries.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white rounded-lg p-6 shadow-lg">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Visual Connections</h3>
          <p class="text-gray-600">
            See how your ideas connect with visual diagrams and highlighted relationships between
            concepts.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-primary-600 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to organize your notes?</h2>
        <p class="text-xl text-primary-100 mb-8">
          Start taking notes and let AI help you find the connections you missed.
        </p>
        <router-link
          to="/auth"
          class="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold shadow-lg border-2 border-white"
        >
          <span class="text-primary-600 font-bold">Get Started Now</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional setup needed for the home page
</script>
