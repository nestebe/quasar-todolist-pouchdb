<template>
  <q-form class="row no-wrap items-center q-gutter-x-sm" @submit="submit">
    <q-input
      v-model="title"
      class="col"
      outlined
      autofocus
      maxlength="200"
      :placeholder="t('form.placeholder')"
      :aria-label="t('form.label')"
    >
      <template #prepend>
        <q-icon name="add_task" />
      </template>
    </q-input>
    <q-btn
      type="submit"
      color="primary"
      icon="add"
      :label="$q.screen.gt.xs ? t('form.add') : undefined"
      :aria-label="t('form.add')"
      unelevated
      class="q-py-sm"
      :disable="!title.trim()"
    />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{ submit: [title: string] }>();

const { t } = useI18n();

const title = ref('');

function submit(): void {
  if (!title.value.trim()) {
    return;
  }
  emit('submit', title.value);
  title.value = '';
}
</script>
