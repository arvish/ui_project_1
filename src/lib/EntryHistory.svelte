<script>
  import { derived } from "svelte/store";
  import { entries, updateEntry } from "./stores/entries.js";

  let idx = 0;
  const dates = derived(entries, $e => $e.map(x => x.date));
  const current = derived(entries, $e => $e[idx] ?? $e[0]);

  let editing = false;
  let draft = null;
  let savedMsg = "";

  const feelingOptions = [
    "Happy","Calm","Motivated","Tired","Stressed","Anxious",
    "Focused","Energetic","Bored","Grateful","Overwhelmed","Relaxed"
  ];

  function startEdit(e) { editing = true; savedMsg = ""; draft = structuredClone(e); }
  function cancelEdit() { editing = false; draft = null; }
  function saveEdit() {
    if (!draft) return;
    updateEntry(draft);
    editing = false;
    savedMsg = "Changes saved ✓";
    setTimeout(() => savedMsg = "", 2000);
  }

  function prev() { if (idx < $dates.length - 1) idx += 1; }
  function next() { if (idx > 0) idx -= 1; }
</script>

<section class="card box">
  <header class="head">
    <div class="left">
      <h2>History</h2>
      {#if $current}
        <div class="sub">{editing ? "Editing" : "Viewing"} • {$current.date}</div>
      {/if}
    </div>

    <div class="nav">
      <button class="btn ghost" on:click={prev} disabled={idx >= $dates.length - 1}>Prev</button>
      <select class="select" bind:value={idx}>
        {#each $dates as d, i}<option value={i}>{d}</option>{/each}
      </select>
      <button class="btn ghost" on:click={next} disabled={idx <= 0}>Next</button>
    </div>
  </header>

  {#if $current}
    {#if !editing}
      <dl class="kv">
        <div class="row"><dt>Feelings</dt><dd>{$current.feelings.join(", ") || "—"}</dd></div>
        <div class="row"><dt>Image</dt><dd>{$current.imageFilename || "—"}</dd></div>
        <div class="row"><dt>Caption</dt><dd>{$current.imageCaption || "—"}</dd></div>
        <div class="row"><dt>Yoga</dt><dd>{$current.didYoga ? `${$current.yogaMinutes} min` : "No"}</dd></div>
        <div class="row"><dt>Water</dt><dd>{$current.waterGlasses} glasses</dd></div>
        <div class="row"><dt>Sleep</dt><dd>{$current.sleepHours} h</dd></div>
        <div class="row"><dt>Gratitude</dt><dd>{$current.gratitude || "—"}</dd></div>
      </dl>

      <div class="actions">
        <button class="btn" on:click={() => startEdit($current)}>Edit</button>
        {#if savedMsg}<span class="ok">{savedMsg}</span>{/if}
      </div>
    {:else}
      <form class="form" on:submit|preventDefault={saveEdit}>
        <div class="block">
          <label class="label">Feelings</label>
          <div class="feelings">
            {#each feelingOptions as f}
              <label class="chip">
                <input
                  type="checkbox"
                  checked={draft?.feelings.includes(f)}
                  on:change={(e)=> {
                    if (!draft) return;
                    const checked = e.currentTarget.checked;
                    draft = {
                      ...draft,
                      feelings: checked
                        ? Array.from(new Set([...(draft.feelings || []), f]))
                        : (draft.feelings || []).filter(x => x !== f)
                    };
                  }}/>
                <span>{f}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="grid2">
          <div class="block">
            <label class="label">Image filename</label>
            <input class="input" type="text" bind:value={draft.imageFilename} placeholder="(optional)" />
          </div>
          <div class="block">
            <label class="label">Sleep (hours)</label>
            <input class="input" type="number" min="0" max="24" step="0.5" bind:value={draft.sleepHours} />
          </div>
        </div>

        <div class="grid2">
          <label class="checkbox">
            <input type="checkbox" bind:checked={draft.didYoga} />
            <span>Did yoga</span>
          </label>
          <div>
            <label class="label">Minutes</label>
            <input class="input" type="number" min="0" step="5" bind:value={draft.yogaMinutes} disabled={!draft?.didYoga}/>
          </div>
        </div>

        <div class="grid2">
          <div class="block">
            <label class="label">Water (glasses)</label>
            <input class="input" type="number" min="0" max="8" step="1" bind:value={draft.waterGlasses} />
          </div>
          <div class="block">
            <label class="label">Caption</label>
            <input class="input" type="text" bind:value={draft.imageCaption} />
          </div>
        </div>

        <div class="block">
          <label class="label">Gratitude</label>
          <textarea class="textarea" rows="3" bind:value={draft.gratitude}></textarea>
        </div>

        <div class="actions">
          <button class="btn" type="submit">Save</button>
          <button type="button" class="btn ghost" on:click={cancelEdit}>Cancel</button>
        </div>
      </form>
    {/if}
  {/if}
</section>

<style>
  .box{ width: min(920px, 92vw); padding: 22px 22px 18px; }
  .head{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px; }
  h2{ margin:0; font-size:20px; letter-spacing:-.01em; }
  .sub{ color:#6b7280; font-size:14px; }
  .nav{ display:flex; gap:8px; align-items:center; }
  .select{ padding:8px 10px; border-radius:10px; border:1px solid #d6d7db; }

  .kv{ margin:0; }
  .row{ display:grid; grid-template-columns: 1fr 2fr; gap:12px; padding:10px 0; border-top:1px solid #edf0f3; }
  .row:first-child{ border-top:none; }
  dt{ color:#6b7280; font-weight:600; font-size:14px; }
  dd{ margin:0; color:#111827; font-size:15.5px; }

  .form .block{ margin: 12px 0; }
  .grid2{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; align-items:center; }
  .label{ display:block; margin-bottom:6px; font-size:14px; color:#6b7280; font-weight:600; }
  .input, .textarea{ width:100%; border:1px solid #d6d7db; border-radius:10px; padding:10px 12px; font-size:15px; }
  .input:focus, .textarea:focus{ border-color:#0a84ff; box-shadow: 0 0 0 3px rgba(10,132,255,.12); }

  .feelings{ display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:8px 10px; }
  .chip{ display:flex; gap:8px; align-items:center; font-size:14px; color:#111827; }
  .checkbox{ display:flex; gap:8px; align-items:center; }

  .actions{ display:flex; gap:12px; justify-content:center; align-items:center; margin-top:10px; }
  .ok{ color:#0f7b2b; font-weight:600; }

  @media (max-width: 560px){ .row{ grid-template-columns: 1fr; } .grid2{ grid-template-columns: 1fr; } }
</style>
