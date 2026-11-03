<template>
  <q-form class="row no-wrap items-center q-gutter-x-sm" @submit="submit">
    <q-input
      v-model="title"
      class="col"
      outlined
      autofocus
      maxlength="200"
      placeholder="Que faut-il faire ?"
      aria-label="Nouvelle tâche"
    >
      <template #prepend>
        <q-icon name="add_task" />
      </template>
    </q-input>
    <q-btn
      type="submit"
      color="primary"
      icon="add"
      :label="$q.screen.gt.xs ? 'Ajouter' : undefined"
      aria-label="Ajouter"
      unelevated
      class="q-py-sm"
      :disable="!title.trim()"
    />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ submit: [title: string] }>();

const title = ref('');

function submit(): void {
  if (!title.value.trim()) {
    return;
  }
  emit('submit', title.value);
  title.value = '';
}
</script>
