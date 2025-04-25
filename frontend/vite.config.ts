import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    define: {
      "process.env.REACT_APP_MAPBOX_ACCESS_TOKEN": JSON.stringify(
        env.REACT_APP_MAPBOX_ACCESS_TOKEN
      ),
      "process.env.REACT_APP_MAPBOX_USERNAME": JSON.stringify(
        env.REACT_APP_MAPBOX_USERNAME
      ),
      "process.env.REACT_APP_MAPBOX_MAPSTYLE": JSON.stringify(
        env.REACT_APP_MAPBOX_MAPSTYLE
      ),
      "process.env.REACT_APP_SHARE_SECRET_KEY": JSON.stringify(
        env.REACT_APP_SHARE_SECRET_KEY
      ),
      "process.env.REACT_APP_API_URL": JSON.stringify(env.REACT_APP_API_URL),
      "process.env.CDN_BASE": JSON.stringify(env.CDN_BASE),
      "process.env.AZURE_CONTAINER_NAME": JSON.stringify(
        env.AZURE_CONTAINER_NAME
      ),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
