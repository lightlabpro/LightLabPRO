# Light Lab PRO — Full Settings & Values Documentation

This document is a **UI-first reference**: control names as they appear in **Light Lab PRO**, typical **value ranges** where the window enforces sliders, and short **notes** on behavior. It complements in-editor **Details & Instructions** foldouts.

**Conventions**
- **Range** = min–max shown on a slider in code (or “unbounded” for float fields).
- **Per-light** = inside an expanded light row after **Edit** is enabled.
- **Pipeline**: some Unity `Light` fields behave differently in **Built-In** vs **URP/HDRP** (called out where relevant).

---

## 1) Window overview

| Area | Purpose |
|------|---------|
| **Title bar** | Window identity; standard Unity dock/float behavior. |
| **Open Lighting Settings** | Opens Unity’s Lighting window. |
| **Open Light Explorer** | Opens Unity’s Light Explorer. |
| **Open Render Pipeline Asset** | Selects/opens the active SRP asset (if any). |
| **Main tabs** | Switch between high-level workflows (e.g. Scene Lights, Studio Lighting, FX & Settings, Animation, … — exact tab set matches your Unity layout). |

---

## 2) Scene Lights list (shared controls)

| Control | Type / range | Notes |
|---------|----------------|-------|
| **Refresh Light List** | Button | Re-scans the scene for `Light` components; restores selection/cluster/foldout state when possible. |
| **Select All** | Button | Enables **Edit** for every light (heavy UI). |
| **Deselect All** | Button | Disables **Edit** for all lights. |
| **Sort Lights By → Sorting Option** | Enum | **NameAscending**, **NameDescending**, **TypeAscending**, **TypeDescending**, **IntensityAscending**, **IntensityDescending**. |
| **Per-row: light reference** | Object field | The `Light` in the scene. |
| **Edit** | Toggle | Unlocks per-light foldouts for that row. |
| **Cluster** | Toggle | Cluster mode for synchronized editing (see cluster group). |
| **Cluster group** | Button (A–Z, 0–9) | Assigns lights that sync when clustered. |
| **Focus** | Button | Frames the light in the Scene view. |
| **On / Off** | Button | Enables/disables the light component. |

---

## 3) Studio Lighting tab

### 3.1 Point of Interest (POI)

| Control | Notes |
|---------|--------|
| **POI / Assign** | Transform used as the center of studio arrangements and as the aim target for auto-placed lights. Required for meaningful **Save Settings** / arrangement workflows. |

### 3.2 Per-slot studio lights (list)

Each slot row includes:

| Control | Notes |
|---------|--------|
| **Key / Fill / Rim / Main / Custom** | Role toggles (mini buttons) for studio layout semantics. |
| **Remove** | Removes the slot from the studio list. |
| **Light** | Object reference to the scene `Light`. |
| **Color** | `ColorField`. |
| **Type** | `LightType` enum. |
| **Mode** | `LightmapBakeType` (Realtime / Mixed / Baked as exposed by Unity). |
| **Manual Offset** | Toggle: when **on**, captures current transform relative to POI; exposes **Position** / **Rotation** vector fields for manual placement. |

### 3.3 Global Settings

| Control | Range | Notes |
|---------|-------|--------|
| **Intensity Scale** | 0–10 | Global multiplier for studio rig intensity. |

### 3.4 Arrangement Settings

| Control | Range | Notes |
|---------|-------|--------|
| **Spread Factor** | 0–3 | Angular spacing of lights on the arrangement ring. |
| **Radius** | 0–50 | Distance from POI in the horizontal plane. |
| **Radial Offset** | −20–20 | Fine-tune ring radius. |
| **Rotation Offset** | 0–360° | Orbits the whole rig around POI. |
| **Vertical Offset Adjustment** | −10–10 | Raises/lowers arranged lights. |
| **POI Virtual Height** | −10–10 | Offsets the aim target vertically (lights aim higher/lower). |
| **Show Arrangement Circle** | Toggle | Scene gizmo for the ring. |

> **Note:** Random variation controls exist in code but may be commented out in your build; if you don’t see **Random Variation** / **Variation Amount**, they are disabled in source.

### 3.5 Gizmo Display

| Control | Range | Notes |
|---------|-------|--------|
| **Show Gizmos** | Toggle | Master gizmo visibility. |
| **Enable Position Gizmos** | Toggle | Draggable position handles (when enabled). |
| **Enable Rotation Gizmos** | Toggle | Rotation handles (when enabled). |
| **Gizmo Opacity** | 0–1 | When gizmos are shown. |

### 3.6 Gizmo Label Settings

| Control | Range | Notes |
|---------|-------|--------|
| **Show Light Labels** | Toggle | Text labels in Scene view. |
| **Font Size** | 8–32 | Label size. |
| **Label Color** | Color | Tint. |
| **Bold Text** | Toggle | Font weight. |

### 3.7 Live-Edit Existing Lights

| Control | Notes |
|---------|--------|
| **Light Parent** | `GameObject` with `StudioLightingTarget` — assigns external hierarchy for live-edit. **Clear** removes assignment. Dialog may offer to add `StudioLightingTarget`. |

---

## 4) Light Groups (FX & Settings area)

| Control | Notes |
|---------|--------|
| **Create Group Data** | Creates backing data for groups if missing. |
| **New Group Name** | Text field. |
| **Create Group** | Adds a named group. |
| **Rename / Delete** | Per-group maintenance. |
| **Add Selected Light(s)** | Adds current selection to a group. |
| **Focus / Remove** | Per-light in group list. |

---

## 5) Global & typed presets (top-of-window loaders)

Exact labels depend on context, but typical popup rows include:

| Control | Purpose |
|---------|---------|
| **Profile** | Global preset index (`globalPresetNames`). |
| **Light Preset** | Directional / Point / Spot preset line (per light type section). |
| **Day-Night / Directional Config** | `directionalConfigNames` selection. |
| **Moon Config** | `moonConfigNames` selection. |
| **FX & Settings Preset** | `fxSettingsPresetNames`. |
| **Animation Preset** | `animationPresetNames`. |
| **PRO Cookies Preset** | Pro-cookies preset list. |
| **Point / Spotlight preset indices** | Additional preset popups where implemented. |

---

## 6) Per-light foldouts (order in UI)

When **Edit** is on, sections generally appear in this order:

1. **Presets**  
2. **Effects**  
3. **Volumetrics**  
4. **Color Switcher**  
5. **Sound**  
6. **Material Changer**  
7. **Basic Settings** (always last in the stack)

Each section may include a **Details & Instructions** foldout with rich text help.

---

## 7) Presets section

| Control | Notes |
|---------|--------|
| **Details & Instructions** | Expandable description + usage. |
| **Selected preset / index** | Popup to choose preset asset (implementation-specific). |

---

## 8) Effects section

Component-driven. Common patterns in this project include **intensity/range animation**, **sequencer steps**, and **blur** where wired.

### 8.1 Representative slider ranges (from window bindings)

| Control | Range | Notes |
|---------|-------|--------|
| **Minimum / Maximum Intensity** | 0–50 | Bounds for animated intensity. |
| **Minimum / Maximum Range** | 0–50 | Bounds for animated range. |
| **Min / Max Intensity Speed** | 0.1–40 | Intensity change rate. |
| **Min / Max Range Speed** | 0.1–10 | Range change rate. |
| **Step Count** | 1–24 | Sequencer length. |
| **Step: Intensity** | 0–10 | Per-step target. |
| **Step: Range** | 0–100 | Per-step target. |
| **Max Blur** | 0–20 | Where blur UI is exposed. |
| **Blur Scale** | 0.1–5 | Blur scale. |

> Exact availability depends on which effect components are present on the light.

---

## 9) Volumetrics section

Often integrates **HDRP/URP fog** overrides when the project uses supported volumes.

### 9.1 Fog-style overrides (when shown)

| Group | Controls |
|-------|----------|
| **Distances** | **Distance** — slider uses volume parameter min/max. |
| **Ground** | **Enable Ground** — toggle. |
| **Lighting** | **Density** — slider (parameter range). |
| **Main Light** | **Enable Main Light Contribution**, **Anisotropy**, **Scattering** (each with appropriate ranges). |
| **Additional Lights** | **Enable Additional Lights Contribution** — toggle. |

A **composition** toggle may appear for stacking fog with other effects (label varies).

---

## 10) Color Switcher

| Control | Range | Notes |
|---------|-------|--------|
| **Pattern** | Popup | Index into pattern list. |
| **Change Type** | Popup | How transitions occur. |
| **Switch Speed** | 0.1–50 | Rate of color change. |

---

## 11) Sound

Two common configurations appear in code paths:

### 11.1 Audio Source style

| Control | Range | Notes |
|---------|-------|--------|
| **Volume** | 0–1 | |
| **Loop** | Toggle | |
| **Play On Awake** | Toggle | |
| **Mute** | Toggle | |
| **Sync with Light Intensity** | Toggle | |
| **Compensation Volume** | 0–1 | When sync is used. |

### 11.2 Reactive / debug style

| Control | Range | Notes |
|---------|-------|--------|
| **Debug Mode** | Toggle | Extra logging. |
| **Intensity Multiplier** | 0–5 | Scales audio-driven response. |
| **Base Intensity** | 0–2 | Baseline light intensity. |
| **Color Change Speed** | 0–20 | |
| **Threshold** | 0–4 | Trigger band for reactions. |

---

## 12) Material Changer

| Control | Notes |
|---------|--------|
| **Material list / Selected Material** | Popup or index into materials array. |
| **Instantiate Materials** | Toggle — duplicate materials for safe per-light edits. |
| **Affect Albedo** | Toggle |
| **Affect Emission** | Toggle |
| **Emission Multiplier** | Slider — scales emission when enabled. |

---

## 13) Basic Settings

Top-level: **Details & Instructions** (description + numbered steps), then **Basic Light Settings**.

### 13.1 General

| Control | Notes |
|---------|--------|
| **Light Name** + **Rename Light** | Read-only name or **New Name** text field with **Accept** / **Cancel**. |
| **Light Type** | `LightType` enum. |
| **Range** | Float field — **Point** and **Spot** only. |
| **Inner / Outer Spot Angle** | Min/max slider 0–179° — **Spot** only. |

### 13.2 Emission

| Control | Notes |
|---------|--------|
| **Color** | `ColorField`. |
| **Intensity** | Float field. |
| **Indirect Multiplier** | Float field (`bounceIntensity`). |

### 13.3 Rendering

| Control | Notes |
|---------|--------|
| **Mode** | `LightmapBakeType`. |
| **Render Mode** | `LightRenderMode` (Auto / Important / Not Important). |
| **Culling Mask** | Layer mask. |

### 13.4 Shadows

| Control | Range | Notes |
|---------|-------|--------|
| **Shadows** | Enum | None / Hard / Soft (Unity naming). |
| **Strength** | 0–1 | When shadows ≠ None. |
| **Resolution** | Enum | **Built-In Render Pipeline only.** If **URP/HDRP** is active, a help box explains that `Light.shadowResolution` is not supported; control is hidden to avoid exceptions and IMGUI layout issues. |
| **Bias** | Float | |
| **Normal Bias** | Float | |
| **Near Plane** | Float | |

### 13.5 Backup

| Control | Notes |
|---------|--------|
| **Backup Light** | Creates a serialized backup of the light (implementation-specific). |

---

## 14) Animation tab (window-level)

Subsections commonly include **Rotation Animator** and **Firefly Motion**.

### 14.1 Rotation Animator

| Control | Notes |
|---------|--------|
| **Use World Space** | Rotate in world vs local space. |
| **Rotate on X / Y / Z Axis** | Axis enables. |
| *(Speeds/curves)* | Defined on the underlying animator component — see **Details** in UI. |

### 14.2 Firefly Motion

| Control | Range (typical) | Notes |
|---------|-----------------|--------|
| **Enable** | Toggle | |
| **Generate Motion Area** | Button | Creates helper object. |
| **Motion Area** | Object reference | Volume for motion. |
| **Motion Area Radius** | Float | |
| **Min / Max Speed** | Float | Travel speed bounds. |
| **Min / Max Jitter** | Float | Noise frequency. |
| **Min / Max Jitter Scale** | Float | Magnitude multiplier. |
| **Avoid Distance** | Float | Clearance from obstacles. |
| **Seed** | Int | Reproducible paths. |

**Motion Area Parent** may appear in preset/toolbar context — assigns parent for generated objects.

---

## 15) Day–Night cycle (inspector section in window)

When a day–night component is referenced:

| Control | Range | Notes |
|---------|-------|--------|
| **Enable Editor Preview** | Toggle | |
| **Auto Update In Editor** | Toggle | |
| **Editor Update Interval** | Slider | Throttle for editor updates. |
| **Current Phase** | Label | Readout. |
| **Time Of Day** | Slider | Scrub phase. |

**Configuration Settings** and other fields follow the attached script’s public API.

---

## 16) PRO Cookies (advanced)

Includes cookie assignment, optional **CRT**-style templates, and multi-layer **LightCookieMotion** when enabled.

### 16.1 Motion grid (representative fields)

Per texture layer **1–4** you may see:

| Field | Purpose |
|-------|---------|
| **Cycle Duration N** | `Vector2` — UV cycle time. |
| **Magnitude N** | `Vector2` — motion strength. |
| **Time Offset N** | `Vector2` — phase offset. |
| **Motion Mode NU / NV** | Forward vs PingPong on U/V. |
| **PathN U / PathN V** | `AnimationCurve` paths. |
| **TilingN UV / OffsetN UV** | UV transform. |

**Max Blur** (0–20) and **Blur Scale** (0.1–5) appear in PRO cookie UI where layered blur is exposed.

---

## 17) Preset asset types (reference)

Your project uses ScriptableObject-style presets for:

- **Global** lighting profiles  
- **FX & Settings** bundles  
- **Animation** settings  
- **PRO Cookies** configurations  
- **Day-Night** / **Moon** cycle configs  

Exact asset menus appear under **Light Lab PRO** (or submenus) in **Create** — use Unity’s **Project** search for class names if needed.

---

## 18) Troubleshooting

| Symptom | Likely cause / fix |
|---------|-------------------|
| **Shadow Resolution** missing | Expected on **URP/HDRP** — use pipeline-specific shadow settings instead. |
| **Layout glitch after shadow edit** | Prior versions threw on `shadowResolution`; current build guards Built-In-only. |
| **Studio tools do nothing** | Assign a **POI** and valid **Light** references. |
| **Stale list** | Press **Refresh Light List**. |
| **Values don’t match Play Mode** | Some effects are editor-preview only — check component execution. |

---

## 19) Suggested documentation website structure

If you publish this as a manual site:

1. **Getting Started** — dock window, refresh lights, enable **Edit**.  
2. **Scene Lights** — sorting, cluster, focus.  
3. **Studio Lighting** — POI, arrangement sliders, gizmos, live-edit.  
4. **Presets** — global vs per-light, asset creation.  
5. **Effects & Animation** — sequencing, motion, blur.  
6. **Volumetrics & Fog** — pipeline notes.  
7. **Color / Sound / Materials** — reactive workflows.  
8. **Basic Settings** — Unity light parity + pipeline caveats.  
9. **PRO Cookies** — layers, motion curves, performance.  
10. **Troubleshooting & FAQ**  

---

## 20) Appendix A — Unity enums surfaced in Basic Settings

| Label in UI | Unity type | Typical values |
|-------------|-------------|----------------|
| **Light Type** | `LightType` | Directional, Point, Spot, Area (Unity version dependent). |
| **Mode** | `LightmapBakeType` | Realtime, Mixed, Baked. |
| **Render Mode** | `LightRenderMode` | Auto, Important, Not Important. |
| **Shadows** | `LightShadows` | None, Hard, Soft. |
| **Resolution** | `LightShadowResolution` | From, Near, Low, Medium, High, Very High, From Quality Settings (Built-In only). |

Use Unity’s manual for pipeline-specific limits (e.g. shadow filters in URP).

---

## 21) Appendix B — Studio Lighting workflow (checklist)

1. Assign **POI** (subject / stage center).  
2. Add or pick **Light** references for each studio slot.  
3. Set **roles** (Key / Fill / Rim / Main / Custom) for organization.  
4. Adjust **Intensity Scale** before per-light tweaks.  
5. Tune **Spread Factor**, **Radius**, **Radial Offset**, **Rotation Offset** for framing.  
6. Use **Vertical Offset** and **POI Virtual Height** for height/aim.  
7. Enable **Show Arrangement Circle** to verify the ring in Scene view.  
8. Optional: **Manual Offset** on a slot to detach that light from auto layout.  
9. Use **Live-Edit** parent with `StudioLightingTarget` when integrating external hierarchies.  

---

## 22) Appendix C — Cluster synchronization (what copies)

When **Cluster** is on and lights share the same **group** character, changing a **source** light can sync:

- **Intensity**  
- **Range**  
- **Spot angle**  
- **Color**  
- **Indirect multiplier** (`bounceIntensity`)  
- **Shadows** (type)  

Other properties are not listed in the cluster sync routine — treat cluster as a **linked subset**, not a full duplicate.

---

## 23) Appendix D — Basic Settings: full control inventory

Foldouts under **Basic Settings**:

| Subsection | Controls |
|------------|----------|
| **Details & Instructions** | **Description**, **Instructions** help boxes (static text from window). |
| **General** | **Light Name** (read-only or rename flow), **Light Type**, **Range** (Point/Spot), **Inner / Outer Spot Angle** (Spot, 0–179). |
| **Emission** | **Color**, **Intensity**, **Indirect Multiplier**. |
| **Rendering** | **Mode**, **Render Mode**, **Culling Mask**. |
| **Shadows** | **Shadows**, **Strength** (0–1), **Resolution** (Built-In only), **Bias**, **Normal Bias**, **Near Plane**. |
| **Actions** | **Backup Light**. |

Float fields without sliders in code are **unbounded** in the UI — clamp in your pipeline or via scripts.

---

## 24) Appendix E — Sorting options (exact IDs)

| `LightSortOption` | User-visible meaning |
|-------------------|----------------------|
| `NameAscending` | A → Z by `light.name`. |
| `NameDescending` | Z → A. |
| `TypeAscending` | By `LightType` (ordering per Unity). |
| `TypeDescending` | Reverse type order. |
| `IntensityAscending` | Dim → bright (`light.intensity`). |
| `IntensityDescending` | Bright → dim. |

---

## 25) Appendix F — Gizmo & label matrix

| Master | Child controls | Behavior |
|--------|----------------|----------|
| **Show Gizmos** off | — | Hides preview gizmos regardless of sub-toggles. |
| **Show Gizmos** on | **Enable Position Gizmos**, **Enable Rotation Gizmos** | Sub-toggles only matter when master is on. |
| **Show Gizmos** on | **Gizmo Opacity** 0–1 | Fades gizmo drawing. |
| **Show Light Labels** | **Font Size** 8–32, **Label Color**, **Bold Text** | Scene view text; independent of gizmo mesh. |

---

## 26) Appendix G — Effects section: when controls appear

The **Effects** foldout reflects **components** on the GameObject. If a control is missing:

- The backing behaviour (`MonoBehaviour`) may not be attached.  
- The light may be **disabled** or wrong object selected.  
- A preset may need to be applied first to add components.  

**Sequencer**-style fields (**Step Count**, per-step **Intensity** / **Range**) appear when the relevant effect type exposes steps in `DrawEffectsSection`.

---

## 27) Appendix H — Pipeline compatibility matrix

| Feature | Built-In | URP | HDRP |
|---------|----------|-----|------|
| **Light.shadowResolution** | Exposed in **Basic Settings → Shadows** | Hidden + info box | Hidden + info box |
| **Standard Light fields** | Full | Full (with URP Light limits) | HDRP uses Light components + volume stack |
| **Volumetrics / Fog UI** | Depends on project packages | Often URP Fog + volumes | HDRP Fog/Volumetrics |

Always verify **Graphics Settings → Scriptable Render Pipeline** to know which path is active.

---

## 28) Appendix I — Expanded FAQ

**Q: Why two “preset” areas?**  
A: **Global / toolbar** presets load whole profiles or configs; **per-light Presets** apply to individual lights or asset rows.

**Q: Can I use Studio Lighting without POI?**  
A: You can edit slots, but auto-arrangement and aim targets expect a POI; results may be undefined.

**Q: Cluster vs Light Groups?**  
A: **Cluster** syncs a **small set** of properties for lights in the same character group. **Light Groups** are a **scene-wide** organization list for batch operations — different data structures.

**Q: Where did Random Variation go?**  
A: It may be commented out in `LightLabProWindow.cs` (search `Random Variation`). Re-enable only if you accept layout/testing cost.

---

## 29) Appendix J — Editor tips

- Undock **Light Lab PRO** to a second monitor for long sessions.  
- Use **Deselect All** before switching scenes to reduce serialization load.  
- After large hierarchy changes, **Refresh Light List** before trusting foldout state.  
- For reproducible cookies, note **Seed** values in **Firefly Motion** and PRO cookie layers.  

---

## 30) Appendix K — Glossary

| Term | Meaning |
|------|---------|
| **POI** | Point Of Interest — transform the rig orbits / aims at. |
| **Studio slot** | One row in the Studio Lighting list bound to a `Light`. |
| **Foldout** | IMGUI expandable section (`EditorGUILayout.Foldout`). |
| **Preset** | ScriptableObject or serialized profile applied via popup. |
| **Indirect Multiplier** | Unity’s `Light.bounceIntensity` (GI bounce contribution). |
| **SRP** | Scriptable Render Pipeline (URP/HDRP). |

---

## 31) Appendix L — PRO Cookies: UI regions (conceptual)

| Region | Typical contents |
|--------|------------------|
| **Cookie assignment** | Texture / cookie slot, import hints. |
| **CRT / template** | Optional animated CRT-style block when enabled. |
| **Layer motion** | Per-layer UV motion, tiling, curves (layers 1–4). |
| **Blur** | **Max Blur**, **Blur Scale** when layered blur is active. |

Performance tip: fewer animated layers and lower blur scales reduce per-pixel work.

---

## 32) Appendix M — Material Changer: expected use

| Step | Action |
|------|--------|
| 1 | Pick target materials index from the popup. |
| 2 | Enable **Instantiate Materials** if you must avoid shared asset edits. |
| 3 | Toggle **Affect Albedo** / **Affect Emission** to limit channels. |
| 4 | Raise **Emission Multiplier** only when emission path is enabled. |

---

## 33) Appendix N — Color Switcher: pattern vs change type

- **Pattern** selects **which colors** or **order** (implementation-specific list).  
- **Change Type** selects **interpolation / step / hold** style transitions.  
- **Switch Speed** scales how fast the script advances — combine with frame rate and light responsiveness for desired look.

---

## 34) Appendix O — Sound: sync with lights

When **Sync with Light Intensity** is enabled:

- **Compensation Volume** sets baseline loudness before mapping.  
- Use this for **music-reactive** or **dialogue-reactive** lights without clipping audio.

---

## 35) Appendix P — Day–Night: editor preview cautions

- **Auto Update In Editor** can incur cost in large scenes — increase **Editor Update Interval**.  
- **Time Of Day** scrubbing is for **preview**; runtime scripts may use different time sources.  
- **Current Phase** is a **readout** — treat as diagnostic, not authoritative gameplay state.

---

## 36) Appendix Q — File & asset hygiene

- Keep preset assets in a **dedicated folder** under `Assets/`.  
- Name presets with **pipeline** or **scene** tags, e.g. `Studio_Night_URP`.  
- After upgrading Unity, re-open **Light Lab PRO** and run **Refresh Light List**.  

---

## 37) Appendix R — Quick reference: slider ranges (Studio tab)

| Slider | Min | Max |
|--------|-----|-----|
| Intensity Scale | 0 | 10 |
| Spread Factor | 0 | 3 |
| Radius | 0 | 50 |
| Radial Offset | −20 | 20 |
| Rotation Offset | 0 | 360 |
| Vertical Offset Adjustment | −10 | 10 |
| POI Virtual Height | −10 | 10 |
| Gizmo Opacity | 0 | 1 |
| Font Size | 8 | 32 |

---

## 38) Appendix S — Quick reference: slider ranges (effects / color / sound samples)

| Slider | Min | Max |
|--------|-----|-----|
| Min/Max Intensity (effects bounds) | 0 | 50 |
| Min/Max Range (effects bounds) | 0 | 50 |
| Min Intensity Speed | 0.1 | 40 |
| Max Intensity Speed | 0.1 | 40 |
| Min Range Speed | 0.1 | 10 |
| Max Range Speed | 0.1 | 10 |
| Step Count | 1 | 24 |
| Step Intensity | 0 | 10 |
| Step Range | 0 | 100 |
| Max Blur | 0 | 20 |
| Blur Scale | 0.1 | 5 |
| Color Switch Speed | 0.1 | 50 |
| Audio Volume / Compensation | 0 | 1 |
| Intensity Multiplier (reactive) | 0 | 5 |
| Base Intensity (reactive) | 0 | 2 |
| Color Change Speed (reactive) | 0 | 20 |
| Threshold (reactive) | 0 | 4 |
| Shadow Strength | 0 | 1 |

---

## 39) Appendix T — Related Unity windows

| Unity window | Opens from LLP |
|----------------|----------------|
| **Lighting** | **Open Lighting Settings** |
| **Light Explorer** | **Open Light Explorer** |
| **Render Pipeline Asset** | **Open Render Pipeline Asset** |

---

## 40) Revision note

This file was **restored** to the **Full Settings & Values Documentation** style after a tutorial-style rewrite. Without version control, **exact** byte-for-byte recovery of an older README is not guaranteed — this version is **rebuilt from `LightLabProWindow.cs` bindings** and expanded appendices. If you need a **perfect** match to an older file, use **Cursor Local History** or a backup copy.

---

## 41) Appendix U — Section index (1–41)

| § | Title |
|---|--------|
| 1 | Window overview |
| 2 | Scene Lights list |
| 3 | Studio Lighting tab |
| 4 | Light Groups |
| 5 | Global & typed presets |
| 6 | Per-light foldout order |
| 7 | Presets section |
| 8 | Effects section |
| 9 | Volumetrics |
| 10 | Color Switcher |
| 11 | Sound |
| 12 | Material Changer |
| 13 | Basic Settings |
| 14 | Animation tab |
| 15 | Day–Night cycle |
| 16 | PRO Cookies |
| 17 | Preset asset types |
| 18 | Troubleshooting |
| 19 | Suggested website structure |
| 20 | Appendix A — Unity enums |
| 21 | Appendix B — Studio checklist |
| 22 | Appendix C — Cluster sync |
| 23 | Appendix D — Basic Settings inventory |
| 24 | Appendix E — Sorting options |
| 25 | Appendix F — Gizmo matrix |
| 26 | Appendix G — Effects visibility |
| 27 | Appendix H — Pipeline matrix |
| 28 | Appendix I — FAQ |
| 29 | Appendix J — Editor tips |
| 30 | Appendix K — Glossary |
| 31 | Appendix L — PRO Cookies regions |
| 32 | Appendix M — Material Changer use |
| 33 | Appendix N — Color Switcher |
| 34 | Appendix O — Sound sync |
| 35 | Appendix P — Day–Night preview |
| 36 | Appendix Q — Asset hygiene |
| 37 | Appendix R — Studio slider ranges |
| 38 | Appendix S — Effects/color/sound ranges |
| 39 | Appendix T — Related Unity windows |
| 40 | Revision note |
| 41 | Appendix U — Section index |

---

## 42) Appendix V — Cross-references (scripts)

| Topic | Primary script / location |
|-------|---------------------------|
| Main editor window | `Editor/Main Window/LightLabProWindow.cs` |
| Studio target | `StudioLightingTarget` (component) |
| Light groups | `LightGroupsDataV2` and related editors |
| Cookie motion | `LightCookieMotion` (fields referenced in PRO Cookies UI) |
| Day–night | Component referenced by day–night foldout (scene-specific) |

Use **Solution Explorer** / **Search in Files** in Unity for exact class filenames.

---

*© Light Lab PRO — documentation generated to match editor control names/ranges in `LightLabProWindow.cs`. Reconcile with in-editor tooltips for behavior nuances.*
