import { useUserStore } from "../stores/user.ts";

// Setup auth store as a plugin so it can be accessed globally in our FE
const authStorePlugin = {
  install(app:any, option:any) {
    app.config.globalProperties.$store = useUserStore(option.pinia);
  }
}

export default authStorePlugin;