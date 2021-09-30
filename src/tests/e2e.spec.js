const { test, expect } = require("@playwright/test");

const { createMachine } = require("xstate");
const { createModel } = require("@xstate/test");

// test.only("test", async ({ page }) => {
//   // Go to http://localhost:3000/
//   await page.goto("http://localhost:3000/");

//   // Click path
//   await page.click("path");
// });

test.describe("feedback app", () => {
  const airConditionerMachine = createMachine({
    id: "airConditioner",
    initial: "poweredOff",
    states: {
      poweredOff: {
        on: {
          TOGGLE_POWER: "poweredOn.hist",
        },
      },
      poweredOn: {
        on: { TOGGLE_POWER: "poweredOff" },
        meta: {
          test: async (page) => {
            await page.waitForSelector('[data-testid="power-display"]');
          },
        },
        type: "parallel",
        states: {
          mode: {
            initial: "heat",
            states: {
              heat: {
                on: {
                  TOGGLE_MODE: "cold",
                },
              },
              cold: {
                on: {
                  TOGGLE_MODE: "heat",
                },
              },
            },
            meta: {
              test: async (page) => {
                await page.waitForSelector('[data-testid="mode"]');
              },
            },
          },
          fun: {
            initial: "low",
            states: {
              low: {
                on: {
                  TOGGLE_FUN: "medium",
                },
              },
              medium: {
                on: {
                  TOGGLE_FUN: "high",
                },
              },
              high: {
                on: {
                  TOGGLE_FUN: "low",
                },
              },
            },
            meta: {
              test: async (page) => {
                await page.waitForSelector('[data-testid="fun"]');
              },
            },
          },
          hist: {
            type: "history",
            history: "deep",
          },
        },
      },
    },
  });

  const testModel = createModel(airConditionerMachine, {
    events: {
      TOGGLE_POWER: async (page) => {
        await page.click('[data-testid="toggle-power"]');
      },
      TOGGLE_MODE: async (page) => {
        await page.click('[data-testid="toggle-mode"]');
      },
      TOGGLE_FUN: async (page) => {
        await page.click('[data-testid="toggle-fun"]');
      },
    },
  });

  const testPlans = testModel.getSimplePathPlans();

  testPlans.forEach((plan, i) => {
    test.describe(plan.description, () => {
      plan.paths.forEach((path, i) => {
        test(
          path.description,
          async ({ page }) => {
            await page.goto(`http://localhost:3000`);
            //     await page.pause();
            await path.test(page);
          },
          10000
        );
      });
    });
  });

  test("coverage", () => {
    testModel.testCoverage({ filter: (stateNode) => !!stateNode.meta });
  });
});
