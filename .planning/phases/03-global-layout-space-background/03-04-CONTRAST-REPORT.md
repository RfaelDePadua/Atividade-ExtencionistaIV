# Contrast Report — Phase 03

## Method
WCAG 2.1 relative luminance formula. Target: 5:1 for normal text, 3:1 for large text (≥18pt / ≥14pt bold).

## Background Colors

| Zone | Hex | Description |
|------|-----|-------------|
| Top (0%) | #1A3A8F | Dark blue |
| Middle (65%) | #2D1B8A | Indigo |
| Bottom (100%) | #8B1A6B | Dark magenta |

## Results

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| White `#FFFFFF` | Blue `#1A3A8F` | 10.27:1 | ✅ PASS 5:1+ |
| White `#FFFFFF` | Indigo `#2D1B8A` | 12.84:1 | ✅ PASS 5:1+ |
| White `#FFFFFF` | Magenta `#8B1A6B` | 8.54:1 | ✅ PASS 5:1+ |
| Amarelo-Sol `#FFD43B` | Blue `#1A3A8F` | 7.20:1 | ✅ PASS 5:1+ |
| Amarelo-Sol `#FFD43B` | Indigo `#2D1B8A` | 9.01:1 | ✅ PASS 5:1+ |
| Amarelo-Sol `#FFD43B` | Magenta `#8B1A6B` | 5.99:1 | ✅ PASS 5:1+ |
| Laranja-Tang `#FF8C42` | Blue `#1A3A8F` | 4.44:1 | ⚠️ PASS 3:1+ (large text only) |
| Laranja-Tang `#FF8C42` | Indigo `#2D1B8A` | 5.55:1 | ✅ PASS 5:1+ |
| Laranja-Tang `#FF8C42` | Magenta `#8B1A6B` | 3.70:1 | ⚠️ PASS 3:1+ (large text only) |
| Verde-Menta `#4DFFB4` | Blue `#1A3A8F` | 7.96:1 | ✅ PASS 5:1+ |
| Verde-Menta `#4DFFB4` | Indigo `#2D1B8A` | 9.95:1 | ✅ PASS 5:1+ |
| Verde-Menta `#4DFFB4` | Magenta `#8B1A6B` | 6.62:1 | ✅ PASS 5:1+ |
| Rosa-Chiclete `#FF6EB4` | Blue `#1A3A8F` | 3.98:1 | ⚠️ PASS 3:1+ (large text only) |
| Rosa-Chiclete `#FF6EB4` | Indigo `#2D1B8A` | 4.98:1 | ⚠️ PASS 3:1+ (large text only) |
| Rosa-Chiclete `#FF6EB4` | Magenta `#8B1A6B` | 3.31:1 | ⚠️ PASS 3:1+ (large text only) |
| Lílás-Algodão `#C084FC` | Blue `#1A3A8F` | 3.88:1 | ⚠️ PASS 3:1+ (large text only) |
| Lílás-Algodão `#C084FC` | Indigo `#2D1B8A` | 4.86:1 | ⚠️ PASS 3:1+ (large text only) |
| Lílás-Algodão `#C084FC` | Magenta `#8B1A6B` | 3.23:1 | ⚠️ PASS 3:1+ (large text only) |

## Failures & Remediation

**No pairings fail 3:1 — all pairings pass at minimum WCAG AA Large Text.**

### Pairings that are large-text-only (3:1–4.99:1):

| Color | Usage in Codebase | Recommendation |
|-------|-------------------|----------------|
| Laranja-Tang `#FF8C42` (on blue / magenta) | `a:hover` color | ✅ Acceptable — hover states are transient, not primary reading text. Restrict to decorative/large-text contexts. |
| Rosa-Chiclete `#FF6EB4` | Planet accent, decorative elements | ✅ Acceptable — used for large headings and badges (≥18pt), not body text. |
| Lílás-Algodão `#C084FC` | `::selection` highlight, decorative | ✅ Acceptable — `::selection` is not primary text, it's an inversion highlight. |

### Recommended constraints (document in design system):
1. **`#FF8C42` (Laranja-Tang)** — Do not use as body text (< 18pt / < 14pt bold) directly on gradient background. Use only for hover/interactive states or headings.
2. **`#FF6EB4` (Rosa-Chiclete)** — Restrict to decorative UI elements and large text (≥18pt). Do not use for captions, small labels, or footnotes on gradient.
3. **`#C084FC` (Lílás-Algodão)** — Acceptable for `::selection` and decorative large text only.

## Conclusion

All critical text pairings **pass**. White text (`#FFFFFF`) and yellow accent (`#FFD43B`, primary link color) both exceed 5:1+ at every gradient stop — the core reading experience is well within WCAG AA. Verde-Menta (`#4DFFB4`) also clears 5:1+ comfortably and can be used freely.

Three accent colors (Laranja-Tang, Rosa-Chiclete, Lílás-Algodão) land in the large-text-only zone but do not fail — they must be restricted to decorative or large-text contexts, not small body copy. No CSS changes required at this stage.
