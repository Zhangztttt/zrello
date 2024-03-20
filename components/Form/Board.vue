<template>
  <UForm :state="formState" :schema="BoardSchema" @submit="handleForm">
    <UFormGroup class="mb-4" name="name" label="名称">
      <UInput v-model="formState.name"></UInput>
    </UFormGroup>

    <UFormGroup class="mb-4" name="coverImage" label="封面图">
      <ImagePicker v-model="formState.coverImage"></ImagePicker>
    </UFormGroup>

    <UButton block type="submit" :loading="isLoading">
      {{ type === "新建" ? "新建" : "更新" }}
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import type { z } from "zod";
import type { FormSubmitEvent } from "~/node_modules/@nuxt/ui/dist/runtime/types/form";
import BoardSchema from "~/schemas/Board.schema";
import type { BoardDocument } from "~/server/models/Board.model";

interface Props {
  type: "新建" | "更新";
  initialData?: BoardDocument;
  onCreate?: () => void;
  onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "新建",
});

const isLoading = ref(false);

const formState = reactive<Partial<BoardDocument>>({
  name: undefined,
  coverImage: undefined,
});

watchEffect(() => {
  if (props.type === "更新" && props.initialData) {
    formState.name = props.initialData.name;
    formState.coverImage = props.initialData.coverImage;
  }

  // if(props.type ==='create'){
  //   formState.name = undefined
  //   formState.coverImage = undefined
  // }
});

async function handleForm(
  event: FormSubmitEvent<z.output<typeof BoardSchema>>
) {
  try {
    isLoading.value = true;

    if (props.type === "更新" && props.initialData?._id) {
      await useFetch(`/api/boards/${props.initialData._id}`, {
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

    await useFetch("/api/boards", {
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