<template>
  <div class="shadow dark:bg-gray-800 rounded-lg overflow-hidden relative">
    <div v-if="board.coverImage" class="h-36 w-full relative z-[1]">
      <NuxtImg
        :src="board.coverImage"
        :alt="board.name"
        class="h-full w-full absolute object-cover z-[1]"
      />
      <div
        class="absolute w-full h-full z-[2] bg-gradient-to-b from-black/70 to-transparent"
      ></div>
      <div class="flex items-center gap-2 absolute left-0 z-10 top-0 py-2 px-4">
        <NuxtLink
          :to="{
            name: 'boardId',
            params: { boardId: board._id },
          }"
          class="block font-semibold text-white"
        >{{ board.name }}
        </NuxtLink>
        <UDropdown :items="actions">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-white"></UIcon>
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board.model";

interface Props {
  board: BoardDocument;
  onEdit?: (board: BoardDocument) => void;
}

const props = defineProps<Props>();

const refreshBoards = inject("refresh-boards") as () => void;

const {destroy} = useBoard();

const actions = ref([
  [
    {
      label: "编辑",
      icon: "i-heroicons-pencil",
      click: () => {
        props.onEdit?.(props.board);
      },
    },
  ],
  [
    {
      label: "删除",
      icon: "i-heroicons-trash",
      click: async() => {
        await destroy(props.board._id);
        refreshBoards()
      },
    },
  ],
]);
</script>

<style>
</style>