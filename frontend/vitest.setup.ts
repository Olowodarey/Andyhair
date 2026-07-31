import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees between tests so the DOM (and things like the modal's
// body-scroll lock / history entries) don't leak across cases.
afterEach(() => {
  cleanup();
});
