<script>
  import { preferences, defaultPrefs, applyTheme } from "./stores/preferences.js";
  import { get } from "svelte/store";

  let draft = structuredClone(get(preferences));
  let savedMsg = "";

  function save() {
    preferences.set(structuredClone(draft));
    applyTheme(draft.theme);
    savedMsg = "Settings saved ✓";
    setTimeout(()=> savedMsg = "", 2000);
  }
  function resetTheme() {
    draft.theme = "orange";
    applyTheme(draft.theme);
  }
</script>

<section class="card box">
  <h2>Settings</h2>

  <div class="grid2">
    <div class="block">
      <label class="label">Goals</label>
      <div class="kv">
        <div class="row"><span>Sleep target (h)</span><input class="input" type="number" step="0.5" min="0" max="24" bind:value={draft.goals.sleepTarget}></div>
        <div class="row"><span>Water target (glasses)</span><input class="input" type="number" step="1" min="0" max="20" bind:value={draft.goals.waterTarget}></div>
        <div class="row"><span>Yoga target (min)</span><input class="input" type="number" step="5" min="0" bind:value={draft.goals.yogaTarget}></div>
      </div>
    </div>

    <div class="block">
      <label class="label">Activities to log</label>
      <div class="checks">
        {#each Object.keys(draft.enabled) as key}
          <label class="checkbox">
            <input type="checkbox" bind:checked={draft.enabled[key]} />
            <span>{key}</span>
          </label>
        {/each}
      </div>
      <small class="muted">Disabling hides the fields but keeps past data.</small>
    </div>
  </div>

  <div class="block">
    <label class="label">Theme</label>
    <div class="checks">
      <label class="radio"><input type="radio" name="theme" value="orange" bind:group={draft.theme} on:change={()=>applyTheme(draft.theme)} /> Orange</label>
      <label class="radio"><input type="radio" name="theme" value="blue"   bind:group={draft.theme} on:change={()=>applyTheme(draft.theme)} /> Blue</label>
      <button class="btn ghost" type="button" on:click={resetTheme}>Undo Theme</button>
    </div>
  </div>

  <div class="actions">
    <button class="btn" on:click={save}>Save Settings</button>
    {#if savedMsg}<span class="ok">{savedMsg}</span>{/if}
  </div>
</section>

<style>
  .box{ width:min(820px,92vw); padding:22px; }
  h2{ margin:0 0 10px; font-size:20px; letter-spacing:-.01em; text-align:center; }
  .grid2{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .block{ margin:12px 0; }
  .label{ display:block; margin-bottom:8px; color:#6b7280; font-weight:600; }
  .kv .row{ display:grid; grid-template-columns:1fr 140px; gap:10px; align-items:center; margin:8px 0; }
  .input{ width:100%; border:1px solid #d6d7db; border-radius:10px; padding:8px 10px; font-size:15px; }
  .checks{ display:flex; gap:12px; flex-wrap:wrap; }
  .checkbox,.radio{ display:flex; gap:8px; align-items:center; }
  .actions{ display:flex; gap:12px; justify-content:center; align-items:center; margin-top:10px; }
  .ok{ color:#0f7b2b; font-weight:600; }
  @media (max-width:640px){ .grid2{ grid-template-columns:1fr; } .kv .row{ grid-template-columns:1fr; } }
</style>
