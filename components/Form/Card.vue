<template>
  <UForm :state="formState" :schema="CardSchema" @submit="handleSummit">
    <UFormGroup name="title" label="标题" class="mb-4">
      <UInput v-model="formState.title" />
    </UFormGroup>

    <UFormGroup name="description" label="描述" class="mb-4">
      <ClientOnly>
        <QuillEditor
          v-model:content="formState.description"
          content-type="html"
          toolbar="minimal"
        />
      </ClientOnly>
    </UFormGroup>

    <div class="flex flex-col gap-2">
      <UButton v-if="initialData &&type === '更新'" type="button" block variant="soft" color="red" @click="handleDelete">删除 </UButton>

      <UButton type="submit" block :loading="isLoading">
      {{ props.type === "新建" ? "新建" : "更新" }}
    </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import type { QuillEditor } from "@vueup/vue-quill";
import type { z } from "zod";
import type { FormSubmitEvent } from "~/node_modules/@nuxt/ui/dist/runtime/types/form";
import CardSchema from "~/schemas/Card.schema";
import type { CardDocument } from "~/server/models/Card.model";

interface Props {
  type?: "新建" | "更新";
  initialData?: CardDocument;
  listId: string;
  onCreate?: () => void;
  onUpdate?: () => void;
}
const {destroy} = useCard()

const props = withDefaults(defineProps<Props>(), {
  type: "新建",
});

const formState = reactive<Partial<CardDocument>>({
  title: undefined,
  description: undefined,
  list: props.listId,
});

async function handleSummit(
  event: FormSubmitEvent<z.output<typeof CardSchema>>
) {
  try {
    isLoading.value = true;
    if (props.type === "更新" && props.initialData) {
      await useFetch(
        `/api/lists/${props.listId}/cards/${props.initialData._id}`,
        {
          method: "PUT",
          body: JSON.stringify(event.data),
          watch: false,
        }
      );
      props.onUpdate?.();
      return;
    }
    await useFetch(`/api/lists/${props.listId}/cards`, {
      method: "POST",
      body: JSON.stringify(event.data),
      watch: false,
    });
    props.onCreate?.();
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
}

async function handleDelete() {
  destroy(props.listId,props.initialData?._id)

  props.onUpdate?.();
}

watchEffect(() => {
  if (props.type === "更新" && props.initialData) {
    formState.title = props.initialData.title;
    formState.description = props.initialData.description;
  }
});

const isLoading = ref(false);
</script>

<style>
.ql-editor {
  @apply h-32 rounded-b-lg shadow;
}
</style>