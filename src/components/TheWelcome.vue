<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Documentación</template>
      La
      <a href="https://vuejs.org/" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">documentación oficial de Vue</a>
      te brinda toda la información para comenzar.
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <ToolingIcon />
      </template>
      <template #heading>Herramientas</template>
      Este proyecto usa
      <a href="https://vite.dev/guide/features.html" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">Vite</a>.
      El IDE recomendado es
      <a href="https://code.visualstudio.com/" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">VSCode</a>
      +
      <a href="https://github.com/vuejs/language-tools" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">Vue - Official</a>.
      Para pruebas, revisa
      <a href="https://vitest.dev/" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">Vitest</a>,
      <a href="https://www.cypress.io/" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">Cypress</a>
      y
      <a href="https://playwright.dev/" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">Playwright</a>.
      <br />
      Más instrucciones en
      <a href="javascript:void(0)" @click="openReadmeInEditor"
        class="text-gray-700 underline hover:text-gray-900"><code>README.md</code></a>.
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <EcosystemIcon />
      </template>
      <template #heading>Ecosistema</template>
      Herramientas oficiales:
      <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener"
        class="text-green-600 underline hover:text-green-800">Pinia</a>,
      <a href="https://router.vuejs.org/" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">Vue Router</a>,
      <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener"
        class="text-purple-600 underline hover:text-purple-800">Vue Test Utils</a>,
      <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener"
        class="text-gray-700 underline hover:text-gray-900">Vue Dev Tools</a> y más en
      <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener"
        class="text-pink-600 underline hover:text-pink-800">Awesome Vue</a>.
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <CommunityIcon />
      </template>
      <template #heading>Comunidad</template>
      ¿Dudas? Pregunta en
      <a href="https://chat.vuejs.org" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">Vue Land</a>,
      <a href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank" rel="noopener"
        class="text-orange-600 underline hover:text-orange-800">StackOverflow</a>,
      o sigue
      <a href="https://bsky.app/profile/vuejs.org" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">@vuejs.org</a>
      y
      <a href="https://x.com/vuejs" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">@vuejs</a>
      para novedades.
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <SupportIcon />
      </template>
      <template #heading>Apoya Vue</template>
      Vue depende de la comunidad para su sostenibilidad. Puedes ayudar
      <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener"
        class="text-yellow-600 underline hover:text-yellow-800">convirtiéndote en patrocinador</a>.
    </WelcomeItem>
  </div>
</template>
