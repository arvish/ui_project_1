<script>
  import { entries } from "./stores/entries.js";
  import { preferences } from "./stores/preferences.js";
  import { derived } from "svelte/store";

  const stats = derived([entries, preferences], ([$e, $p]) => {
    const n = $e.length || 1;
    const avgSleep = $e.reduce((s, x) => s + (x.sleepHours || 0), 0) / n;
    const avgWater = $e.reduce((s, x) => s + (x.waterGlasses || 0), 0) / n;
    const yogaDays = $e.filter(x => x.didYoga && x.yogaMinutes > 0).length;

    const sleepGoalPct = Math.min(100, Math.round((avgSleep / ($p.goals.sleepTarget || 1)) * 100));
    const waterGoalPct = Math.min(100, Math.round((avgWater / ($p.goals.waterTarget || 1)) * 100));
    const yogaGoalPct  = Math.min(100, Math.round((yogaDays / n) * 100));

    return {
      n,
      avgSleep: +avgSleep.toFixed(1),
      avgWater: +avgWater.toFixed(1),
      yogaDays,
      sleepGoalPct, waterGoalPct, yogaGoalPct
    };
  });
</script>

<section class="card box">
  <h2>Overview</h2>
  <p class="muted small">Auto-updates when you save an entry or change goals.</p>

  <div class="grid3">
    <div class="tile">
      <div class="label">Average Sleep</div>
      <div class="value">{$stats.avgSleep} h</div>
      <div class="bar"><span style="width: {$stats.sleepGoalPct}%"></span></div>
      <small class="muted">Goal completion: {$stats.sleepGoalPct}%</small>
    </div>

    <div class="tile">
      <div class="label">Average Water</div>
      <div class="value">{$stats.avgWater} glasses</div>
      <div class="bar"><span style="width: {$stats.waterGoalPct}%"></span></div>
      <small class="muted">Goal completion: {$stats.waterGoalPct}%</small>
    </div>

    <div class="tile">
      <div class="label">Yoga Days</div>
      <div class="value">{$stats.yogaDays} / {$stats.n}</div>
      <div class="bar"><span style="width: {$stats.yogaGoalPct}%"></span></div>
      <small class="muted">Days with yoga</small>
    </div>
  </div>
</section>

<style>
  .box{ width:min(920px,92vw); padding:22px; }
  h2{ margin:0 0 4px; font-size:20px; text-align:center; }
  .small{ text-align:center; margin:0 0 10px; display:block; }
  .grid3{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  .tile{ border:1px solid #edf0f3; border-radius:16px; padding:14px; background:#fff; }
  .label{ color:#6b7280; font-weight:600; font-size:14px; }
  .value{ font-size:22px; font-weight:700; margin:4px 0 8px; }
  .bar{ height:10px; background:#eef2f7; border-radius:999px; overflow:hidden; }
  .bar span{ display:block; height:100%; background:var(--accent); }
  @media (max-width:720px){ .grid3{ grid-template-columns:1fr; } }
</style>
