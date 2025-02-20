import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "html-transform",
      transformIndexHtml(html) {
        return html
          .replace(
            "%VITE_ORIGIN_TRIAL_TRANSLATION%",
            process.env.VITE_ORIGIN_TRIAL_TRANSLATION || ""
          )
          .replace(
            "%VITE_ORIGIN_TRIAL_DETECTOR%",
            process.env.VITE_ORIGIN_TRIAL_DETECTOR || ""
          )
          .replace(
            "%VITE_ORIGIN_TRIAL_SUMMARIZER%",
            process.env.VITE_ORIGIN_TRIAL_SUMMARIZER || ""
          );
      },
    },
  ],
});
