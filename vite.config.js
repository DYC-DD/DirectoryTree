import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/DirectoryTree/",
  plugins: [react()],
  server: {
    open: true,
  },
});
