import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "kpgqgd",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:8081",
  },
});
