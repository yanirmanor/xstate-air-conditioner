import { createMachine } from "xstate";

export const airConditionerMachine = createMachine({
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
        },
        hist: {
          type: "history",
          history: "deep",
        },
      },
    },
  },
});
