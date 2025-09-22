import { writable, get } from "svelte/store";

export const entries = writable(makeMock().sort((a, b) => b.date.localeCompare(a.date)));

function makeMock() {
  const feelingPool = [
    "Happy","Calm","Motivated","Tired","Stressed","Anxious",
    "Focused","Energetic","Bored","Grateful","Overwhelmed","Relaxed"
  ];
  const isoOffset = (days) => {
    const d = new Date(); d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const pick = (n) => {
    const out = [], used = new Set();
    while (out.length < n) {
      const i = Math.floor(Math.random()*feelingPool.length);
      if (!used.has(i)) { used.add(i); out.push(feelingPool[i]); }
    }
    return out;
  };
  return Array.from({ length: 10 }).map((_, i) => {
    const day = -i;
    const yoga = Math.random() > 0.5;
    return {
      date: isoOffset(day),
      feelings: pick(2 + Math.floor(Math.random() * 3)),
      imageFilename: null,
      imageCaption: "",
      didYoga: yoga,
      yogaMinutes: yoga ? (10 * (1 + Math.floor(Math.random() * 4))) : 0,
      waterGlasses: Math.floor(Math.random() * 9),
      gratitude: "",
      sleepHours: +(6 + Math.random() * 3).toFixed(1)
    };
  });
}

export function updateEntry(updated) {
  entries.update(arr => {
    const i = arr.findIndex(e => e.date === updated.date);
    if (i === -1) return [updated, ...arr].sort((a, b) => b.date.localeCompare(a.date));
    const copy = arr.slice();
    copy[i] = { ...updated };
    return copy;
  });
}

export function getByIndex(i) {
  const arr = get(entries);
  return (i >= 0 && i < arr.length) ? arr[i] : null;
}
