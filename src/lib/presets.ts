export interface Preset {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  rawSnippet: string;
}

export const SHOWCASE_PRESETS: Preset[] = [
  {
    id: 'linear-command-palette',
    name: 'Linear Command Palette',
    category: 'Application UI',
    badge: 'Glass & Badges',
    description: 'Backdrop blur modal, subtle dark slate borders, search input, and keyboard shortcut badges.',
    rawSnippet: `<style>
.linear-cmdk-overlay {
  position: relative;
  width: 100%;
  max-width: 580px;
  background-color: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(51, 65, 85, 0.7);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  padding: 8px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.linear-search-input {
  width: 100%;
  background-color: transparent;
  color: #f8fafc;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 16px;
  border: none;
  outline: none;
}
.linear-results-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 4px;
}
.linear-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  color: #cbd5e1;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-out;
}
.linear-item:hover {
  background-color: #1e293b;
  color: #f8fafc;
  transform: scale(1.01);
}
.linear-kbd {
  background-color: #334155;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #475569;
}
</style>

<div class="linear-cmdk-overlay">
  <input class="linear-search-input" placeholder="Type a command or search..." />
  <div class="linear-results-list">
    <div role="button" class="linear-item">
      <span>Assign issue to harshit</span>
      <span class="linear-kbd">⌘A</span>
    </div>
    <div role="button" class="linear-item">
      <span>Set priority to Urgent</span>
      <span class="linear-kbd">P1</span>
    </div>
    <div role="button" class="linear-item">
      <span>Copy Git branch name</span>
      <span class="linear-kbd">⌘C</span>
    </div>
  </div>
</div>`,
  },
  {
    id: 'stripe-radiant-card',
    name: 'Stripe Radiant Card',
    category: 'Marketing Card',
    badge: 'Gradient Physics',
    description: 'Glassmorphic card with radiant multi-stop gradient glow, interactive scale bounce, and glowing borders.',
    rawSnippet: `<style>
.stripe-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background-color: #0f172a;
  background-image: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stripe-card:hover {
  transform: scale(1.03);
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.25);
}
.stripe-badge {
  display: inline-flex;
  align-items: center;
  background-color: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  margin-bottom: 16px;
}
.stripe-title {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 8px;
}
.stripe-desc {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}
.stripe-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #6366f1;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.stripe-btn:hover {
  background-color: #4f46e5;
}
</style>

<div class="stripe-card">
  <div class="stripe-badge">Next-Gen Payments</div>
  <div class="stripe-title">Instant Global Payouts</div>
  <div class="stripe-desc">Automate your treasury with 0% latency and sub-second settlement in 135+ currencies.</div>
  <div role="button" class="stripe-btn">Explore Infrastructure →</div>
</div>`,
  },
  {
    id: 'apple-dynamic-island',
    name: 'Apple Dynamic Island',
    category: 'Motion Component',
    badge: 'Apple Spring (0.16, 1, 0.3, 1)',
    description: 'Smooth spring physics capsule expanding into an active call status bar with haptic responsiveness.',
    rawSnippet: `<style>
.dynamic-island {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 360px;
  height: 48px;
  background-color: #000000;
  color: #ffffff;
  border-radius: 9999px;
  padding: 8px 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
  border: 1px solid #27272a;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.dynamic-island:hover {
  height: 64px;
  width: 380px;
  background-color: #09090b;
}
.island-avatar {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background-color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}
.island-status {
  display: flex;
  flex-direction: column;
}
.island-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}
.island-time {
  font-size: 12px;
  color: #a1a1aa;
}
.island-waveform {
  display: flex;
  align-items: center;
  gap: 3px;
}
.wave-bar {
  width: 3px;
  height: 16px;
  background-color: #22c55e;
  border-radius: 2px;
}
</style>

<div class="dynamic-island">
  <div style="display: flex; align-items: center; gap: 12px;">
    <div class="island-avatar">AI</div>
    <div class="island-status">
      <span class="island-name">Gemini Voice</span>
      <span class="island-time">02:45 Connected</span>
    </div>
  </div>
  <div class="island-waveform">
    <div class="wave-bar"></div>
    <div class="wave-bar" style="height: 22px;"></div>
    <div class="wave-bar" style="height: 12px;"></div>
  </div>
</div>`,
  },
  {
    id: 'vercel-sliding-navbar',
    name: 'Vercel Sliding Navigation Bar',
    category: 'Navigation',
    badge: 'Magnetic Pill',
    description: 'Minimalist dark mode navigation tabs with magnetic pill hover state and clean typography scale.',
    rawSnippet: `<style>
.vercel-navbar {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid #27272a;
  border-radius: 9999px;
  padding: 4px 8px;
  backdrop-filter: blur(12px);
  width: fit-content;
}
.vercel-tab {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.vercel-tab:hover {
  color: #ffffff;
  background-color: #18181b;
}
.vercel-tab.active {
  color: #ffffff;
  background-color: #27272a;
}
</style>

<div role="navigation" class="vercel-navbar">
  <div role="button" class="vercel-tab active">Overview</div>
  <div role="button" class="vercel-tab">Deployments</div>
  <div role="button" class="vercel-tab">Analytics</div>
  <div role="button" class="vercel-tab">Logs</div>
  <div role="button" class="vercel-tab">Settings</div>
</div>`,
  },
];
