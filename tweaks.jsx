/* tweaks.jsx — portfolio 2026 tweaks panel */

const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "mint",
  "bgIntensity": 1.0,
  "showAgent": true,
  "showRail": true,
  "density": "regular",
  "showTerminal": true
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  mint:   { c: "oklch(0.86 0.19 150)", c2: "oklch(0.72 0.16 150)", glow: "oklch(0.86 0.19 150 / 0.35)", soft: "oklch(0.86 0.19 150 / 0.10)", line: "oklch(0.86 0.19 150 / 0.45)", ink: "#07120c" },
  cyan:   { c: "oklch(0.84 0.16 210)", c2: "oklch(0.7 0.14 210)",  glow: "oklch(0.84 0.16 210 / 0.40)", soft: "oklch(0.84 0.16 210 / 0.10)", line: "oklch(0.84 0.16 210 / 0.50)", ink: "#06121a" },
  amber:  { c: "oklch(0.85 0.18 75)",  c2: "oklch(0.72 0.16 75)",  glow: "oklch(0.85 0.18 75 / 0.40)",  soft: "oklch(0.85 0.18 75 / 0.10)",  line: "oklch(0.85 0.18 75 / 0.50)",  ink: "#1a1004" },
  magenta:{ c: "oklch(0.78 0.22 340)", c2: "oklch(0.66 0.18 340)", glow: "oklch(0.78 0.22 340 / 0.40)", soft: "oklch(0.78 0.22 340 / 0.10)", line: "oklch(0.78 0.22 340 / 0.50)", ink: "#170915" }
};

function applyTweaks(t) {
  const root = document.documentElement;
  const a = ACCENT_PRESETS[t.accent] || ACCENT_PRESETS.mint;
  root.style.setProperty('--accent',       a.c);
  root.style.setProperty('--accent-2',     a.c2);
  root.style.setProperty('--accent-glow',  a.glow);
  root.style.setProperty('--accent-soft',  a.soft);
  root.style.setProperty('--accent-line',  a.line);
  root.style.setProperty('--accent-ink',   a.ink);

  root.style.setProperty('--bg-intensity', String(t.bgIntensity));

  // Visibility tweaks
  const agent = document.getElementById('agent-launcher');
  const panel = document.getElementById('agent-panel');
  if (agent) agent.style.display = t.showAgent ? '' : 'none';
  if (panel && !t.showAgent) panel.hidden = true;

  const rail = document.querySelector('.rail-nav');
  if (rail) rail.style.display = t.showRail ? '' : 'none';

  const term = document.querySelector('.terminal');
  if (term) term.style.display = t.showTerminal ? '' : 'none';

  // Density
  if (t.density === 'compact') {
    root.style.setProperty('--gutter', 'clamp(0.75rem, 2vw, 1.5rem)');
    root.style.fontSize = '15px';
  } else if (t.density === 'comfy') {
    root.style.setProperty('--gutter', 'clamp(1.25rem, 4vw, 3rem)');
    root.style.fontSize = '17px';
  } else {
    root.style.setProperty('--gutter', 'clamp(1rem, 3vw, 2.25rem)');
    root.style.fontSize = '16px';
  }
}

function PortfolioTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent" />
      <TweakRadio
        label="Color"
        value={t.accent}
        options={['mint', 'cyan', 'amber', 'magenta']}
        onChange={(v) => setTweak('accent', v)}
      />

      <TweakSection label="Atmosphere" />
      <TweakSlider
        label="Background intensity"
        value={t.bgIntensity}
        min={0}
        max={1.5}
        step={0.1}
        unit=""
        onChange={(v) => setTweak('bgIntensity', v)}
      />
      <TweakRadio
        label="Density"
        value={t.density}
        options={['compact', 'regular', 'comfy']}
        onChange={(v) => setTweak('density', v)}
      />

      <TweakSection label="Modules" />
      <TweakToggle
        label="Agent chat"
        value={t.showAgent}
        onChange={(v) => setTweak('showAgent', v)}
      />
      <TweakToggle
        label="Rail navigation"
        value={t.showRail}
        onChange={(v) => setTweak('showRail', v)}
      />
      <TweakToggle
        label="Hero terminal"
        value={t.showTerminal}
        onChange={(v) => setTweak('showTerminal', v)}
      />
    </TweaksPanel>
  );
}

const __twk_root = ReactDOM.createRoot(document.getElementById('tweaks-root'));
__twk_root.render(<PortfolioTweaks />);
