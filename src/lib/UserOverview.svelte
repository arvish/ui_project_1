<script>
  import { onDestroy } from "svelte";

  let name = "Arvish Pandey";
  let now = new Date();
  const timer = setInterval(() => now = new Date(), 1000);

  // Mock usage numbers for checkpoint
  let daysSinceBeginning = 10;
  let daysActive = 7;

  // Skipped David Goggin's quote TT

  onDestroy(() => clearInterval(timer));
</script>

<section class="card box">
  <h2>User Overview</h2>
  <dl class="kv">
    <div class="row">
      <dt>Name</dt><dd>{name}</dd>
    </div>
    <div class="row">
      <dt>Current Date/Time</dt><dd>{now.toLocaleString()}</dd>
    </div>
    <div class="row">
      <dt>Usage</dt>
      <dd>{daysSinceBeginning} days since beginning, {daysActive} days active</dd>
    </div>
  </dl>
</section>

<style>
  .box{ width: min(560px, 92vw); padding: 28px 28px 24px; }
  h2{ margin:0 0 12px; font-weight:700; letter-spacing:-.01em; color:#0b0c0f; font-size:22px; line-height:1.2; text-align:center; }
  .kv{ margin:0; }
  .row{ display:grid; grid-template-columns: 1fr 2fr; gap:12px; align-items:baseline; padding:12px 0; border-top:1px solid #edf0f3; }
  .row:first-child{ border-top:none; }
  dt{ color:#6b7280; font-weight:600; font-size:14px; }
  dd{ margin:0; font-size:15.5px; color:#111827; }
  @media (max-width: 520px){ .row{ grid-template-columns:1fr; gap:4px; } }
</style>
