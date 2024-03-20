<template>
  <UForm :state="formState" :schema="ListSchema" @submit="handleForm">
    <UFormGroup class="mb-4" name="name" label="名称">
      <UInput v-model="formState.name"></UInput>
    </UFormGroup>

    <UButton block type="submit" :loading="isLoading">
      {{ type === "新建" ? "新建" : "更新" }}
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import type { z } from "zod";
import type { FormSubmitEvent } from "~/node_modules/@nuxt/ui/dist/runtime/types/form";
import ListSchema from "~/schemas/List.schema";
import type { ListDocument } from "~/server/models/List.model";


interface Props {
  type: "新建" | "更新";
  initialData?: ListDocument;
  boardId: string;
  onCreate?: () => void;
  onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "新建",
});

const isLoading = ref(false);

const formState = reactive<Partial<ListDocument>>({
  name: undefined,
  board:props.boardId
});

watchEffect(() => {
  if (props.type === "更新" && props.initialData) {
    formState.name = props.initialData.name;
    formState.board = props.initialData.board;
  }

});

async function handleForm(
  event: FormSubmitEvent<z.output<typeof ListSchema>>
) {
  try {
    isLoading.value = true;

    if (props.type === "更新" && props.initialData?._id) {
      await useFetch(`/api/lists/${props.initialData._id}`, {
        method: "PUT",
        body: event.data,
        watch: false,
      });
      props.onUpdate?.();

      useToast().add({
        title: "更新成功",
      });

      return
    }

    await useFetch("/api/lists", {
      method: "POST",
      body: event.data,
      watch: false,
    });

    props.onCreate?.();

    useToast().add({
      title: "新建成功",
    });

    props.onCreate?.();
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
}
</script>

<style>
</style>