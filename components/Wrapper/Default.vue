<template>
  <div>
    <header class="p-2 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <UContainer>
        <div class="flex justify-between">
          <NuxtLink to="/">
            <Logo/>
          </NuxtLink>

          <div class="inline-flex justify-end gap-4 items-center">
            <slot name="actions"></slot>

            <ColorSwitcher/>
            <UDropdown :items="dropDownItems">
              <UIcon name="i-heroicons-user-circle" class="w-6 h-6"/>

              <template #profile>
                <div class="text-left">
                  <p>当前帐号</p>
                  <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ data?.user?.email }}
                  </p>
                </div>
              </template>
            </UDropdown>
          </div>
        </div>
      </UContainer>
    </header>

    <main class="my-4">
      <UContainer>
        <slot/>
      </UContainer>
    </main>
  </div>
</template>

<script lang="ts" setup>
const { data, signOut } = useAuth();

const dropDownItems = ref([
  [
    {
      label: "个人资料",
      slot: "profile",
      disabled: true,
    },
  ],
  [
    {
      label: "退出登录",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click:handleSignOut
    },
  ],
]);

async function handleSignOut() {
  await signOut();
}
</script>

<style>
</style>