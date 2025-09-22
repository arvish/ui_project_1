<script>
  import { onMount } from "svelte";

  /* Components (relative imports for plain Svelte) */
  import UserOverview from "./lib/UserOverview.svelte";
  import DayLog from "./lib/DayLog.svelte";
  import EntryHistory from "./lib/EntryHistory.svelte";
  import Overview from "./lib/Overview.svelte";
  import Settings from "./lib/Settings.svelte";

  /* Theme hook */
  import { applyTheme } from "./lib/stores/preferences.js";

  let tab = "today"; // "today" | "history" | "overview" | "settings"

  onMount(() => {
    // Ensure CSS vars match the default theme on first load
    applyTheme("orange");
  });
</script>

<div class="wrap">
  <UserOverview />

  <div class="tabs" role="tablist" aria-label="Primary">
    <button class:active={tab === "today"}    on:click={() => tab = "today"}    role="tab" aria-selected={tab === "today"}>Today</button>
    <button class:active={tab === "history"}  on:click={() => tab = "history"}  role="tab" aria-selected={tab === "history"}>History</button>
    <button class:active={tab === "overview"} on:click={() => tab = "overview"} role="tab" aria-selected={tab === "overview"}>Overview</button>
    <button class:active={tab === "settings"} on:click={() => tab = "settings"} role="tab" aria-selected={tab === "settings"}>Settings</button>
  </div>

  {#if tab === "today"}
    <DayLog />
  {:else if tab === "history"}
    <EntryHistory />
  {:else if tab === "overview"}
    <Overview />
  {:else}
    <Settings />
  {/if}
</div>

<style>
  /* Desktop-focused layout (designed around ~1280×800) */
  .wrap{
    display: grid;
    gap: 20px;
    place-items: center;
    width: 100%;
    max-width: 1280px;  /* target desktop width */
  }
  .tabs{
    display: flex;
    gap: 8px;
  }
  .tabs button{
    background:#f3f4f6; color:#111827; border:1px solid #e5e7eb;
    padding:8px 14px; border-radius:999px; cursor:pointer; font-weight:600;
  }
  .tabs button.active{
    background:#111827; color:#fff; border-color:#111827;
  }
</style>
