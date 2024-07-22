<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/16/solid";

// import { getCurrentInstance, computed } from "vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePlaysStore } from "./stores/plays.ts";
// import { useUserStore } from "./stores/user.ts";
import { useKeycloak } from "@josempgon/vue-keycloak";

const router = useRouter();
// const instance = getCurrentInstance();
// const store = instance?.appContext.config.globalProperties.$store;

console.log(usePlaysStore);
// const userStore = useUserStore();

const { hasRoles, keycloak, userId, token, decodedToken } = useKeycloak();

const keycloakView = async () => {
  // userStore.testAction();
  // console.log(app.config.globalProperties.$store);
  // console.log(store);
  const hasAccess = computed(() => hasRoles(["RoleName"]));
  console.log(hasAccess);
  console.log(hasAccess.value);
  const computedUsreId = computed(() => userId.value);
  console.log(computedUsreId);
  console.log(computedUsreId.value);
  console.log(token.value);
  console.log(decodedToken.value);
  // store.testAction();
};
// http://localhost:8989/realms/snservice/protocol/openid-connect/auth?client_id=snclient&redirect_uri=http%3A%2F%2Flocalhost%3A14200%2F&state=5abadef4-55ed-4be9-824c-2c277b2be36a&response_mode=fragment&response_type=code&scope=openid&nonce=6f01031d-b87a-4931-a5d6-fe5faad41263&code_challenge=gRzxilVWC89XOedjvsvcGgu3w_h987Mt0e7J8R8Zv48&code_challenge_method=S256
const keycloakLogin = async () => {
  // userStore.login();
  // console.log(store);
  // store.login();
  // keycloak.value?.login({ redirectUri: `${window.location.origin}/secret` });
  // const loginUrl = keycloak.value?.createLoginUrl();
  // console.log(loginUrl);
  keycloak.value?.login();
};

const goBack = () => {
  router.go(-1);
};

const goForward = () => {
  router.go(+1);
};

const goHome = () => {
  router.push({ name: "home" });
};
</script>

<template>
  <div class="container">
    <div class="w-fit cursor-pointer text-red-500" @click="goHome">
      snservice
    </div>
    <div class="flex flex-col">
      <div>
        {{ decodedToken?.preferred_username }}
        {{ decodedToken?.sub }}
      </div>
    </div>
    <div @click="keycloakView">keycloakview</div>
    <div @click="keycloakLogin">keycloakLogin</div>
    <div>
      <ChevronLeftIcon
        class="inline-block h-6 w-6 cursor-pointer"
        @click="goBack"
      />
      <ChevronRightIcon
        class="inline-block h-6 w-6 cursor-pointer"
        @click="goForward"
      />
    </div>
    <router-view />
  </div>
</template>
