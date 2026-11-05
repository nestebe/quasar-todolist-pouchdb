<template>
  <q-btn-dropdown
    flat
    dense
    no-caps
    icon="translate"
    :label="current.toUpperCase().slice(0, 2)"
    :aria-label="t('layout.language')"
  >
    <q-list>
      <q-item
        v-for="code in codes"
        :key="code"
        v-close-popup
        clickable
        :active="code === current"
        @click="select(code)"
      >
        <q-item-section>{{ locales[code].label }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { applyLocale } from '@/boot/i18n';
import { locales, saveLocale, type AppLocale } from '@/i18n';

const { t, locale } = useI18n();

const codes = Object.keys(locales) as AppLocale[];

const current = computed(() => locale.value as AppLocale);

function select(code: AppLocale): void {
  applyLocale(code);
  saveLocale(code);
}
</script>
