<template>
  <WrapperAuth title="免费注册账户">
    <template #subheading>
      <p class="mt-1">
        已有账户？<NuxtLink
          :to="{ name: 'auth-signin' }"
          class="text-primary-400"
          >立即登录</NuxtLink
        >
      </p>
    </template>
    <!-- form -->
    <UForm :state="formState" :schema="SignupSchema" @submit="handleSubmit">
      <UFormGroup class="mb-4" name="name" label="姓名">
        <UInput v-model="formState.name" />
      </UFormGroup>

      <UFormGroup class="mb-4" name="email" label="邮箱">
        <UInput v-model="formState.email" type="email" />
      </UFormGroup>

      <UFormGroup class="mb-4" name="password" label="密码">
        <UInput v-model="formState.password" type="password" />
      </UFormGroup>

      <UFormGroup class="mb-4" name="passwordConfirm" label="确认密码">
        <UInput v-model="formState.passwordConfirm" type="password" />
      </UFormGroup>

      <UFormGroup>
        <UButton :loading="isloading" type="submit" block>立即注册</UButton>
      </UFormGroup>
    </UForm>
  </WrapperAuth>
</template>
    
  <script lang="ts" setup>
import type { z } from "zod";
import type { FormSubmitEvent } from "~/node_modules/@nuxt/ui/dist/runtime/types/form";
import SignupSchema from "~/schemas/Signup.schema";

const isloading = ref(false);

const formState = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
  passwordConfirm: undefined,
});

async function handleSubmit(
  event: FormSubmitEvent<z.output<typeof SignupSchema>>
) {
  try {
    isloading.value = true;

    await useFetch("/api/auth/signup", {
      method: "POST",
      body: event.data,
      watch: false,
    });

    useToast().add({
      title: "注册成功!",
      description: "您已注册成功，正在跳转登录界面",
      timeout: 2000,
    });

    useRouter().push({
      name: "auth-signin",
    });
  } catch (error: any) {
    useToast().add({
      title: "出错了...",
      description: error.message || "未知错误",
    });
  } finally {
    isloading.value = false;
  }
}
</script>
    
  <style>
</style>
    