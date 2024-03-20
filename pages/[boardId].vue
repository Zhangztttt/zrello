<template>
  <WrapperDefault
    v-if="data"
    class="h-screen"
    :style="{
      backgroundImage: `url(${data.coverImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <template #actions>
      <UButton size="xs" @click="showListCreate = true">新建清单</UButton>
    </template>

    <h1 class="tex-3xl font-semibold mb-4 inline-block">{{ data.name }}</h1>

    <!-- list container -->
    <ListContainer :lists="data.lists" :board-id="boardId"/>

    <USlideover v-model="showListCreate">
      <OverlayHeader
        :title="selectedList ? '更新清单' : '新建清单'"
        :on-click="() => (showListCreate = false)"
      >
      </OverlayHeader>

      <div class="p-4">
        <FormList
          :type="selectedList ? '更新' : '新建'"
          :initial-data="selectedList"
          :board-id="(boardId as string)"
          :on-create="
            () => {
              refresh();
              showListCreate = false;
            }
          "
        >
        </FormList>
      </div>
    </USlideover>
  </WrapperDefault>
</template>

<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board.model";
import type { ListDocument } from "~/server/models/List.model";

definePageMeta({
  middleware:"auth",
})
const { boardId } = useRoute().params;

const { data, refresh } = await useFetch<BoardDocument>(
  `/api/boards/${boardId}`
);

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: "未找到该任务板",
  });
}

useHead({
  title: data.value.name,
  titleTemplate:" %s - 任务板",
  meta: [
    {
      name: "description",
      content: data.value.description,
    },
  ],
})

provide("board-refresh",refresh)

const selectedList = ref<ListDocument | undefined>();

const showListCreate = ref(false);
</script>

<style>
</style>