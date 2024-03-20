<template>
  <div
    class="w-72 shadow flex-none bg-white dark:bg-gray-800 rounded-lg flex flex-col"
  >
    <!-- list header -->
    <div
      class="p-2 border-b dark:bg-gray-700 flex items-center justify-between list-handle"
    >
      <h3 class="font-medium">{{ list.name }}</h3>
      <UDropdown :items="listActions">
        <UIcon name="i-heroicons-cog-6-tooth"></UIcon>
      </UDropdown>
    </div>

    <!-- list body -->
    <vuedraggable
      v-if="data"
      :list="data"
      group="list"
      ghost-class="card-ghost"
      :scroll-sensitivity="500"
      :force-fallback="true"
      class="p-2 flex-1 space-y-2 overflow-y-hidden"
      @change="handleCardChange"
    >
      <template #item="{ element }">
        <div>
          <ListCard :card="element" @click="() => handleCardUpdate(element)" />
        </div>
      </template>
    </vuedraggable>

    <!-- list footer -->
    <div class="p-1 border-t dark:bg-gray-700 flex item-center">
      <UButton block @click="showCardCreate = true">新建</UButton>
    </div>

    <Teleport to="body">
      <UModal v-model="showCardCreate">
        <OverlayHeader
          :title="selectedCard ? '编辑卡片' : '新建卡片'"
          :on-click="() => (showCardCreate = false)"
        >
        </OverlayHeader>

        <div class="p-2">
          <FormCard
            :type="selectedCard ? '更新' : '新建'"
            :list-id="props.list._id"
            :initial-data="selectedCard"
            :on-create="
              () => {
                refresh();
                showCardCreate = false;
              }
            "
            :on-update="
              () => {
                refresh();
                showCardCreate = false;
                selectedCard = undefined;
              }
            "
          >
          </FormCard>
        </div>
      </UModal>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import type { CardDocument } from "~/server/models/Card.model";
import type { ListDocument } from "~/server/models/List.model";
import vuedraggable from "vuedraggable";

interface Props {
  list: ListDocument;
  boardId: string;
}

const props = defineProps<Props>();

const refreshBoard = inject("board-refresh") as () => {};

const listActions = ref([
  [
    {
      label: "添加事项",
      icon: "i-heroicons-plus-circle",
      click: () => {
        showCardCreate.value = true;
      },
    },
  ],
  [
    {
      label: "删除",
      icon: "i-heroicons-trash",
      click: () => {
        destroy(props.list._id);
        refreshBoard();
      },
    },
  ],
]);

const { destroy, update: updateList } = useList(props.boardId);
const { update: updateCard } = useCard();

const { data, refresh } = useFetch<CardDocument[]>(
  `/api/lists/${props.list._id}/cards`
);

const showCardCreate = ref(false);

const selectedCard = ref<CardDocument | undefined>();

function handleCardUpdate(card: CardDocument) {
  selectedCard.value = card;
  showCardCreate.value = true;
}

async function handleCardChange(e: any) {
  try {
    if (e.added) {
      const { element: card } = e.added;
      await updateCard(card._id, props.list._id, {
        list: props.list._id,
      });
    }
    await updateList(props.list._id, {
      cards: data.value?.flatMap((item) => item._id),
    });
  } catch (error) {}
}

watch(showCardCreate, (val: any) => {
  if (!val) {
    selectedCard.value = undefined;
  }
});
</script>

<style>
.card-ghost {
  @apply !bg-gray-100 dark:!bg-gray-700 rounded-lg;
}
.card-ghost > div {
  @apply invisible;
}
</style>