<template>
  <WrapperAuth title="登录">
    <template #subheading>
      <p class="mt-1">没有帐户？<NuxtLink :to="{name: 'auth-signup'}" class="text-primary-400">立即注册</NuxtLink></p>
    </template>

    <!-- form -->
    <UForm :state="formState" :schema="SigninSchema" @submit="handleSignin">
      <UFormGroup class="mb-4" name="email" label="邮箱">
        <UInput v-model="formState.email" type="email" />
      </UFormGroup>
      <UFormGroup class="mb-4" name="password" label="密码">
        <UInput v-model="formState.password" type="password" />
      </UFormGroup>
      <UButton :loading="isloading" type="submit" block>登录</UButton>
    </UForm>
  </WrapperAuth>
</template> 

<script lang="ts" setup>
import type { z } from "zod";
import type { FormSubmitEvent } from "~/node_modules/@nuxt/ui/dist/runtime/types/form";
import SigninSchema from "~/schemas/Signin.schema";

const isloading = ref(false);
const formState = reactive({
  email: undefined,
  password: undefined,
});

const { signIn } = useAuth();

async function handleSignin(
  event: FormSubmitEvent<z.output<typeof SigninSchema>>
) {
  try {
    isloading.value = true;

    const res = await signIn("credentials", {
      email: event.data.email,
      password: event.data.password,
      redirect: false,
    });

    //@ts-expect-error
    if (!res.error) {
      useRouter().push("/");
    }
  } catch (error) {
  } finally {
    isloading.value = false;
  }
}
</script>

<style>
.right {
  background: linear-gradient(-45deg, #7dfcad, #3fdea9d7, #c9f5ab, #f9ce61);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>