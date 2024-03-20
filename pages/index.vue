<template>
  <WrapperDefault>
    <template #actions>
      <UButton size="xs" @click="showCreateBoard = true">新建任务板</UButton>
    </template>

    <div class="grid grid-cols-3 lg:grid-cols-4 gap-4">

      <BoardCard v-for="board in data" :key="board._id" :board="board" :onEdit="()=>{
        selectedBoard = board
        showCreateBoard = true
      }"/>
    </div>

    <USlideover v-model="showCreateBoard">
      <OverlayHeader
        :title="selectedBoard ?  '编辑任务板':'新建任务板' "
        :on-click="() => (showCreateBoard = false)"
      />

      <div class="p-4">
        <FormBoard
          :type="selectedBoard ?'更新':'新建'"
          :initial-data="selectedBoard"
          :on-create="
            () => {
              refresh();
              showCreateBoard = false;
            }
          " :on-update="
            () => {
              refresh();
              showCreateBoard = false;
              selectedBoard = undefined;
            }
          "
        />
      </div>
    </USlideover>
  </WrapperDefault>
</template>

<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board.model";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "任务板",
})

const showCreateBoard = ref(false);

const { data, refresh } = await useFetch<BoardDocument[]>("/api/boards");

provide("refresh-boards",refresh)

const selectedBoard = ref<BoardDocument | undefined>();

watchEffect(() => {
  if (!showCreateBoard.value) {
    selectedBoard.value=undefined;
  }
});
</script>

<style>
</style>