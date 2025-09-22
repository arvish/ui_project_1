<script>
  import { preferences as prefs } from "./stores/preferences.js";
  import { updateEntry } from "./stores/entries.js";

  const feelingOptions = [
    "Happy","Calm","Motivated","Tired","Stressed","Anxious",
    "Focused","Energetic","Bored","Grateful","Overwhelmed","Relaxed"
  ];

  const today = new Date().toISOString().slice(0, 10);

  let feelings = new Set();
  let imageFile = null;
  let imageCaption = "";
  let didYoga = false;
  let yogaMinutes = 0;
  let waterGlasses = 0;
  let gratitude = "";
  let sleepHours = 0;

  let saving = false;
  let saved = false;
  let saveTime = "";

  function toggleFeeling(opt) {
    if (feelings.has(opt)) feelings.delete(opt);
    else feelings.add(opt);
    feelings = new Set(feelings); // reactivity for Set
  }

  function saveToday() {
    saving = true;
    saved = false;

    const payload = {
      date: today,
      feelings: Array.from(feelings),
      imageFilename: imageFile?.name ?? null,
      imageCaption,
      didYoga,
      yogaMinutes: didYoga ? Number(yogaMinutes) : 0,
      waterGlasses: Number(waterGlasses),
      gratitude,
      sleepHours: Number(sleepHours)
    };

    setTimeout(() => {
      updateEntry(payload);      // updates store -> Overview/History refresh
      saving = false;
      saved = true;
      saveTime = new Date().toLocaleTimeString();
      setTimeout(() => (saved = false), 2000);
    }, 300);
  }
</script>

<section class="card box">
  <h2>Today’s Log</h2>

  {#if $prefs.enabled.feelings}
  <div class="block">
    <label class="label">Feelings (select any):</label>
    <div class="feelings">
      {#each feelingOptions as opt}
        <label class="chip">
          <input type="checkbox" on:change={() => toggleFeeling(opt)} checked={feelings.has(opt)} />
          <span>{opt}</span>
        </label>
      {/each}
    </div>
  </div>
  {/if}

  {#if $prefs.enabled.image}
  <div class="block">
    <label class="label">Image for today:</label>
    <input class="input" type="file" accept="image/*" on:change={(e)=> imageFile = e.currentTarget.files?.[0] ?? null} />
    <input class="input" type="text" placeholder="Caption for the image…" bind:value={imageCaption} />
  </div>
  {/if}

  {#if $prefs.enabled.yoga}
  <div class="block grid2">
    <label class="checkbox">
      <input type="checkbox" bind:checked={didYoga} />
      <span>Did yoga today</span>
    </label>
    <div>
      <label class="label">Minutes:</label>
      <input class="input" type="number" min="0" step="5" placeholder="0" bind:value={yogaMinutes} disabled={!didYoga} />
    </div>
  </div>
  {/if}

  {#if $prefs.enabled.water}
  <div class="block">
    <label class="label">Water intake (glasses): <strong>{waterGlasses}</strong></label>
    <input class="range" type="range" min="0" max="8" step="1" bind:value={waterGlasses} />
  </div>
  {/if}

  {#if $prefs.enabled.gratitude}
  <div class="block">
    <label class="label">Gratitude / reflection:</label>
    <textarea class="textarea" rows="4" placeholder="Write a quick gratitude or reflection…" bind:value={gratitude}></textarea>
  </div>
  {/if}

  {#if $prefs.enabled.sleep}
  <div class="block">
    <label class="label">Sleep (hours):</label>
    <input class="input" type="number" min="0" max="24" step="0.5" placeholder="e.g., 7.5" bind:value={sleepHours} />
  </div>
  {/if}

  <div class="actions">
    <button class="btn" on:click={saveToday} disabled={saving}>
      {saving ? "Locking In…" : "Carpe Diem!"}
    </button>
    {#if saved}
      <span class="ok">Saved ✓ <small class="muted">{saveTime}</small></span>
    {/if}
  </div>
</section>

<style>
  .box{ width: min(920px, 92vw); padding: 24px 22px 18px; }
  h2{ margin: 0 0 10px; font-weight: 700; letter-spacing: -.01em; color: #0b0c0f; font-size: 20px; text-align: center; }
  .block{ margin: 16px 0; }
  .grid2{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: center; }
  .label{ display:block; margin-bottom:6px; font-size:14px; color:#6b7280; font-weight:600; }
  .input, .textarea{ width: 100%; border: 1px solid #d6d7db; border-radius: 10px; padding: 10px 12px; font-size: 15px; outline: none; }
  .input:focus, .textarea:focus{ border-color: #0a84ff; box-shadow: 0 0 0 3px rgba(10,132,255,.12); }
  .range{ width: 100%; }
  .feelings{ display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px 10px; }
  .chip{ display:flex; gap:8px; align-items:center; font-size:14px; color:#111827; }
  .checkbox{ display:flex; align-items:center; gap:8px; }
  .actions{ display:flex; gap:12px; align-items:center; justify-content:center; margin-top:10px; }
  .ok{ color:#0f7b2b; font-weight:600; }
  .ok small{ font-weight:400; }
  @media (max-width: 560px){ .grid2{ grid-template-columns: 1fr; } }
</style>
