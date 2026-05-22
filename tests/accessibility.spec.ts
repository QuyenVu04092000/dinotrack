import { test, expect } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

const pages = [
  { name: "home", path: "/home" },
  { name: "signin", path: "/signin" },
  { name: "signup", path: "/signup" },
];

for (const page of pages) {
  test(`accessibility: ${page.name} meets WCAG 2.1 AA`, async ({ page: pw }) => {
    await pw.goto(page.path);
    await injectAxe(pw);
    await checkA11y(pw, undefined, {
      axeOptions: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
      },
    });
  });
}

test("accessibility: no critical violations on root", async ({ page }) => {
  await page.goto("/");
  await injectAxe(page);
  await checkA11y(page, undefined, {
    axeOptions: {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    },
  });
  expect(true).toBe(true);
});
