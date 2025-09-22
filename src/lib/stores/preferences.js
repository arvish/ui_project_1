import { writable } from "svelte/store";

export const defaultPrefs = {
  enabled: { sleep:true, water:true, yoga:true, gratitude:true, feelings:true, image:true },
  goals: { sleepTarget: 7, waterTarget: 8, yogaTarget: 20 },
  theme: "orange"
};

export const preferences = writable(defaultPrefs);

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "blue") {
    root.style.setProperty("--accent", "#0a84ff");
    root.style.setProperty("--accent-hover", "#2f95ff");
  } else {
    root.style.setProperty("--accent", "#e67e22");
    root.style.setProperty("--accent-hover", "#f39c12");
  }
}
