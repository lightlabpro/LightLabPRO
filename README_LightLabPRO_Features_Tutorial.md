# Light Lab PRO — Tutorials & Documentation

## 1) Window overview

The **Light Lab PRO** editor window has two main areas to learn first: the **tab row** (layout) and the **footer buttons** (utilities).

### Tab layout

Use the horizontal tabs at the top of the window to switch workflows. Typical tabs include **Studio Lighting**, **Presets**, **FX & Settings**, **PRO Cookies**, **Animation**, and **Day–Night Cycle** (exact names match your build). Each tab shows a different tool surface; per-light options appear after you enable **Edit** on a light in the scene list.

### Bottom buttons

Across the bottom of the window (outside the tab content) you’ll find shortcuts to Unity:

| Button | Opens |
|--------|--------|
| **Open Lighting Settings** | Unity **Lighting** window |
| **Open Light Explorer** | Unity **Light Explorer** |
| **Open Render Pipeline Asset** | The active **Scriptable Render Pipeline** asset (if any) |

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
| **Cluster group** | Button (A–Z, 0–9) | **Left-click** cycles the group character (A–Z, then 0–9). Lights with **Cluster** on and the **same** group letter/number mirror a subset of properties when you edit one of them. **Right-click** the group button to **reset** the group assignment (clear back to default). |
| **Focus** | Button | Frames the light in the Scene view. |
| **On / Off** | Button | Enables/disables the light component. |

---

## 3) Studio Lighting tab

### 3.0 Settings asset & save/load

At the top of the tab, assign a **`StudioLightingSettings`** asset in the **Settings Asset** field. This ScriptableObject stores your studio rig (POI, slots, arrangement, gizmo options, live-edit parent, etc.).

| Control | Notes |
|---------|--------|
| **Settings Asset** | Object field — drag an existing asset or create one when you first **Save Settings**. |
| **Save Settings** | Writes the current POI, light slots, and related fields into the asset (requires POI + at least one studio slot). If no asset is assigned, the tool prompts you to create one in the Project. |
| **Load Settings** | Restores the window from the assigned asset (resolves POI/parent by name in the open scene). |
| **Clear** | Clears the **Settings Asset** reference only (does not delete the asset file). |

### 3.1 Point of Interest (POI)

| Control | Notes |
|---------|--------|
| **Point of Interest** | Transform used as the center of studio arrangements and as the aim target for auto-placed lights. **Assign** / **Clear** beside the field. Required before **Create Lighting Setup** and for meaningful **Save Settings**. |

### 3.2 Adding lights (toolbar)

These buttons **add a new studio slot** and spawn a matching `Light` in the scene (wired into the rig):

| Button | Creates |
|--------|---------|
| **Add Spot Light** | Spot light + slot |
| **Add Point Light** | Point light + slot |
| **Add Directional Light** | Directional light + slot |
| **Add Area Light** | Area (`Rectangle`) light + slot |

Use them when you want the tool to author lights for you; you can also bind existing scene lights via each row’s **Light** object field.

### 3.3 Per-slot studio lights (list)

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

### 3.4 Global Settings

| Control | Range | Notes |
|---------|-------|--------|
| **Intensity Scale** | 0–10 | **Multiplies the intensity of every studio light** driven by this rig when values are applied (global brightness scaler for the setup). |

### 3.5 Arrangement Settings

| Control | Range | Notes |
|---------|-------|--------|
| **Spread Factor** | 0–3 | Angular spacing of lights on the arrangement ring. |
| **Radius** | 0–50 | Distance from POI in the horizontal plane. |
| **Radial Offset** | −20–20 | Fine-tune ring radius. |
| **Rotation Offset** | 0–360° | Orbits the whole rig around POI. |
| **Vertical Offset Adjustment** | −10–10 | Raises/lowers arranged lights. |
| **POI Virtual Height** | −10–10 | Offsets the aim target vertically (lights aim higher/lower). |
| **Show Arrangement Circle** | Toggle | Scene gizmo for the ring. |

### 3.6 Gizmo Display

| Control | Range | Notes |
|---------|-------|--------|
| **Show Gizmos** | Toggle | Master gizmo visibility. |
| **Enable Position Gizmos** | Toggle | Draggable position handles (when enabled). |
| **Enable Rotation Gizmos** | Toggle | Rotation handles (when enabled). |
| **Gizmo Opacity** | 0–1 | When gizmos are shown. |

### 3.7 Gizmo Label Settings

| Control | Range | Notes |
|---------|-------|--------|
| **Show Light Labels** | Toggle | Text labels in Scene view. |
| **Font Size** | 8–32 | Label size. |
| **Label Color** | Color | Tint. |
| **Bold Text** | Toggle | Font weight. |

### 3.8 Live-Edit Existing Lights

| Control | Notes |
|---------|--------|
| **Light Parent** | `GameObject` with `StudioLightingTarget` — assigns external hierarchy for live-edit. **Clear** removes assignment. Dialog may offer to add `StudioLightingTarget`. |
| **Auto Arrange Lights** | Re-applies arrangement to the live-edit parent when valid. |
| **Create Lighting Setup** | Builds the container and instantiates/configures lights from the current slot list (requires POI). |

### Appendix A — Studio workflow checklist

1. Assign **Settings Asset** (or create via **Save Settings**).  
2. Assign **Point of Interest** (subject / stage center).  
3. Use **Add … Light** or assign **Light** references on each slot.  
4. Set **roles** (Key / Fill / Rim / Main / Custom) for organization.  
5. Adjust **Intensity Scale** to scale all rig light intensities together.  
6. Tune **Spread Factor**, **Radius**, **Radial Offset**, **Rotation Offset** for framing.  
7. Use **Vertical Offset** and **POI Virtual Height** for height/aim.  
8. Enable **Show Arrangement Circle** to verify the ring in Scene view.  
9. Optional: **Manual Offset** on a slot to detach that light from auto layout.  
10. Use **Live-Edit** parent with `StudioLightingTarget` when integrating external hierarchies.  

### Appendix B — Gizmo & label matrix

| Master | Child controls | Behavior |
|--------|----------------|----------|
| **Show Gizmos** off | — | Hides preview gizmos regardless of sub-toggles. |
| **Show Gizmos** on | **Enable Position Gizmos**, **Enable Rotation Gizmos** | Sub-toggles only matter when master is on. |
| **Show Gizmos** on | **Gizmo Opacity** 0–1 | Fades gizmo drawing. |
| **Show Light Labels** | **Font Size** 8–32, **Label Color**, **Bold Text** | Scene view text; independent of gizmo mesh. |

### Appendix C — Quick reference: Studio sliders

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

## 4) Light Groups (FX & Settings area)

**Selected lights** in this context means lights that have **Edit** turned **on** in the Light Lab PRO scene list (the same “in edit” lights the window is driving). **Add Selected Light(s)** adds those edited lights into the chosen group—not arbitrary Unity selection from the Hierarchy unless it matches what LLP considers the active edit set.

| Control | Notes |
|---------|--------|
| **Create Group Data** | Creates backing data for groups if missing. |
| **New Group Name** | Text field. |
| **Create Group** | Adds a named group. |
| **Rename / Delete** | Per-group maintenance. |
| **Add Selected Light(s)** | Adds lights that are **enabled for editing** in Light Lab PRO to this group. |
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

## 7) Presets section (per-light FX presets)

Inside **FX & Settings**, the **Presets** foldout applies a **saved FX bundle** to the **currently edited light**. The preset choice is **filtered by light type** (directional vs point vs spot, etc.): you pick an asset that matches how that light is set up, and the tool attaches or updates the bundled effect components (gradual, strobe, sequencer, and other FX rows) according to what the preset stores.

| Control | Notes |
|---------|--------|
| **Details & Instructions** | Expandable description + usage for this foldout. |
| **Preset popup / index** | Choose an **FX Settings**-style preset asset; **Apply** (or equivalent) writes those effects onto **this** light. |
| **Create / save from light** | Where exposed, captures the current light’s FX configuration into a new or existing preset asset. |

This is separate from the **global** preset row at the top of the window (whole-window profiles). Per-light **Presets** only targets the active light row.

---

## 8) Effects section (FX & Settings)

Each block (**Gradual**, **Strobe**, **Step Sequencer**, etc.) appears when the corresponding component exists on the light—enable the effect with the blue **Enable** toggle on that row. **Max Blur** / **Blur Scale** are **not** part of these three effects; they belong to **PRO Cookies** (Texture tab blur settings).

### 8.1 Gradual Effect

Smoothly animates intensity and/or range between min/max bounds.

| Control | Notes |
|---------|--------|
| **Load Current Values** | Pulls current light values into the min/max fields. |
| **Minimum / Maximum Intensity** | Slider bounds for intensity animation. |
| **Minimum / Maximum Range** | Slider bounds for range animation. |
| **Behavior** | **Forward**, **Reverse**, **PingPong**, or **Random** (see `GradualBehavior`). |
| **Min / Max Intensity Speed** | How fast intensity moves (numeric fields; **Unconstrain** if shown). |
| **Min / Max Range Speed** | How fast range moves (numeric fields; **Unconstrain** if shown). |
| **Make Preset** | Saves this configuration into an FX preset asset. |

### 8.2 Strobe Effect

Snaps intensity and/or range between min and max on a timer (pulse-style).

| Control | Notes |
|---------|--------|
| **Load Current Values** | Pulls current light values into the min/max fields. |
| **Minimum / Maximum Intensity** | Endpoints of the strobe. |
| **Minimum / Maximum Range** | Endpoints for range strobe. |
| **Behavior** | **Loop** or **Random** (`StrobeBehavior`). |
| **Min / Max Intensity Speed** / **Min / Max Range Speed** | Toggle timing between min/max (with **Unconstrain** where shown). |
| **Make Preset** | Saves into an FX preset asset. |

### 8.3 Step Sequencer

Holds timed **steps**, each with duration, intensity, range, and color.

| Control | Notes |
|---------|--------|
| **Step Count** | Number of steps (slider + field). |
| **Behavior** | **Loop** or **Random** order (`StepSequencerBehavior`). |
| **Per step** | **Duration**, **Intensity**, **Range**, **Color**. |
| **Make Preset** | Saves into an FX preset asset. |

### 8.4 Other notes

- Slider ranges in the inspector may differ from defaults in code after you **Load Current Values** or edit curves.  
- If a subsection is missing, the **MonoBehaviour** for that effect is not on the GameObject—add it or apply a preset that includes it.

---

## 9) Volumetrics section

When **Volumetric Lighting Effect** is enabled, the window drives a **URP-style** fog override on a **Global Volume** profile (`VolumetricFogVolumeComponent`). If no global volume, profile, or override exists, you’ll see buttons to **Create Global Volume**, **Create & Assign Profile**, or **Add Volumetric Fog Override**—use those first.

### 9.1 Fog Override Settings (as shown in the UI)

| Group | Controls |
|-------|----------|
| **Distances** | **Distance** (slider, volume min/max), **Base Height**, **Maximum Height** |
| **Ground** | **Enable Ground**, **Ground Height** |
| **Lighting** | **Density** (slider), **Attenuation Distance** |
| **Main Light** | **Enable Main Light Contribution**, **Anisotropy**, **Scattering**, **Tint** |
| **Additional Lights** | **Enable Additional Lights Contribution** |

### 9.2 Per-light additional contribution

| Control | Notes |
|---------|--------|
| **Add Volumetric Additional Light Component** | When checked, adds `VolumetricAdditionalLight` on this light; when unchecked, removes it. When present, the component’s inspector is drawn below for **Anisotropy**, **Scattering**, **Radius**, etc. |

Requires the volumetrics package/scripts from Light Lab PRO and a compatible URP fog volume setup.

---

## 10) Color Switcher

| Control | Range | Notes |
|---------|-------|--------|
| **Pattern** | Popup | Index into pattern list. |
| **Change Type** | Popup | How transitions occur. |
| **Switch Speed** | 0.1–50 | Rate of color change. |

### Appendix A — Pattern, change type, and speed

- **Pattern** selects **which colors** or **order** (implementation-specific list).  
- **Change Type** selects **interpolation / step / hold** style transitions.  
- **Switch Speed** scales how fast the script advances — combine with frame rate and light responsiveness for the desired look.

---

## 11) Sound

Light Lab PRO exposes two different audio features—do not confuse them:

| Module | Direction of control |
|--------|----------------------|
| **Sound Effect** (`SoundEffectHandler`) | **Audio follows the light** — playback and optional **Sync with Light Intensity** mean the **sound reacts to the light’s intensity** (e.g. louder/quieter based on how bright the light is). |
| **Sound Reactor** (`SoundReactor`) | **Light follows the audio** — the **light’s intensity (and color)** reacts to the **audio volume / amplitude** (RMS-style analysis). |

### 11.1 Sound Effect (Audio Source style)

| Control | Range | Notes |
|---------|-------|--------|
| **Volume** | 0–1 | |
| **Loop** | Toggle | |
| **Play On Awake** | Toggle | |
| **Mute** | Toggle | |
| **Sync with Light Intensity** | Toggle | **Sound driven by light** — audio level follows light intensity. |
| **Compensation Volume** | 0–1 | When sync is used. |

### 11.2 Sound Reactor (audio → light)

| Control | Range | Notes |
|---------|-------|--------|
| **Debug Mode** | Toggle | Extra logging. |
| **Intensity Multiplier** | 0–5 | Scales how strongly the light responds to the signal. |
| **Base Intensity** | 0–2 | Baseline light intensity when quiet. |
| **Color Change Speed** | 0–20 | How fast color shifts with the signal. |
| **Threshold** | 0–4 | Band above which the reactor kicks in. |

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
| **Mode** | `LightmapBakeType` — how the light participates in lightmaps. **Realtime** = dynamic lighting; **Mixed** = participates in both realtime and baked lighting per project setup; **Baked** = contributes only to baked lighting. |
| **Render Mode** | `LightRenderMode`: **Auto** (Unity chooses importance for culling), **Important** (always rendered in full quality where applicable), **Not Important** (vertex/lower-cost path where supported). |
| **Culling Mask** | Which layers this light affects. |

### 13.4 Shadows

| Control | Range | Notes |
|---------|-------|--------|
| **Shadows** | Enum | **None** / **Hard** / **Soft** (`LightShadows`). |
| **Strength** | 0–1 | Opacity of the shadow when shadows are enabled. |
| **Resolution** | Enum | **Built-In Render Pipeline only.** If **URP/HDRP** is active, a help box explains that `Light.shadowResolution` is not supported; control is hidden. |
| **Bias** | Float | Moves the shadow map sampling position slightly along the light ray to reduce **shadow acne** (striped artifacts on surfaces). Too high pulls shadows away from contact points. |
| **Normal Bias** | Float | Inset along the **surface normal** when sampling shadows—fights acne on curved or detailed meshes; too much can cause **peter-panning** (shadows detached from objects). |
| **Near Plane** | Float | Near clip distance for the shadow map frustum. Lower values can add detail close to the light but may increase **shadow acne**; higher values clip nearby geometry from the shadow map. |

### 13.5 Backup

| Control | Notes |
|---------|--------|
| **Backup Light** | Creates a serialized backup of the light (implementation-specific). |

### Appendix A — Unity enums (Basic Settings)

| Label in UI | Unity type | Typical values |
|-------------|-------------|----------------|
| **Light Type** | `LightType` | Directional, Point, Spot, Area (Unity version dependent). |
| **Mode** | `LightmapBakeType` | Realtime, Mixed, Baked. |
| **Render Mode** | `LightRenderMode` | Auto, Important, Not Important. |
| **Shadows** | `LightShadows` | None, Hard, Soft. |
| **Resolution** | `LightShadowResolution` | From, Near, Low, Medium, High, Very High, From Quality Settings (Built-In only). |

### Appendix B — Basic Settings control inventory

| Subsection | Controls |
|------------|----------|
| **Details & Instructions** | **Description**, **Instructions** help boxes. |
| **General** | **Light Name** (read-only or rename flow), **Light Type**, **Range** (Point/Spot), **Inner / Outer Spot Angle** (Spot, 0–179). |
| **Emission** | **Color**, **Intensity**, **Indirect Multiplier**. |
| **Rendering** | **Mode**, **Render Mode**, **Culling Mask**. |
| **Shadows** | **Shadows**, **Strength** (0–1), **Resolution** (Built-In only), **Bias**, **Normal Bias**, **Near Plane**. |
| **Actions** | **Backup Light**. |

### Appendix C — Pipeline compatibility (Basic / shadows)

| Feature | Built-In | URP | HDRP |
|---------|----------|-----|------|
| **Light.shadowResolution** | Exposed in **Basic Settings → Shadows** | Hidden + info box | Hidden + info box |
| **Standard Light fields** | Full | Full (with URP Light limits) | HDRP uses Light components + volume stack |
| **Volumetrics / Fog UI** | Depends on project packages | Often URP Fog + volumes | HDRP Fog/Volumetrics |

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

**PRO Cookies** is a **per-light** workflow on its own tab: pick a light in the list, press **Edit**, then choose **Texture**, **Animated**, or **Video**. Bottom actions are shared: **Remove Cookies from This Light**, **Add PRO Cookies Tracker**, **Cleanup Orphaned Tracker**, **Create PRO Cookies Preset from This Light**.

### 16.1 Scene list (per-light)

| Control | Notes |
|---------|--------|
| **Refresh Light List** / **Select All** / **Deselect All** | Same patterns as the main scene list. |
| **Sort Lights By** | e.g. Name Ascending. |
| **Per row** | Light name, status (e.g. **No Cookies**), **Edit** / **Close** for the row in focus. |

### 16.2 Texture mode

| Area | Notes |
|------|--------|
| **Cookie Material** | Optional material slot. |
| **4-Layer Setup (2D Textures)** | Four texture slots with tint / picker. |
| **Duplicated Cubemaps** | **Duplicate & Convert to Cubemap** — builds **CMap 1–4** cubemaps from the 2D layers for point lights. |
| **Blur Settings** | **Max Blur** (0–20) and **Blur Scale** (0.1–5) — **only here** in PRO Cookies, not in Gradual/Strobe/Step Sequencer. |
| **Cookie Motion Setup** | **LightCookieMotion** script field; **Add LightCookieMotion Script**; **Create/Update Cookie (Texture)**. |
| **Cookie CRT** | Optional **Custom Render Texture** for advanced setups. |
| **Built-In Cookie Settings** | Unity **Cookie** slot; tooltip notes size/offset rules for directional lights. |

### 16.3 Animated mode

| Control | Notes |
|---------|--------|
| Info box | Assign **Animated CRT** and edit the initialization material as needed. |
| **Animated CRT** | `Custom Render Texture` reference; **Assign Animated Cookie**. |

### 16.4 Video mode

| Control | Notes |
|---------|--------|
| Info box | Pick a **VideoClip**, create a **VideoPlayer** GameObject, render to a **RenderTexture** (2D for Spot/Dir, **Cube** for Point), then assign as cookie. |
| **Video Clip** | Source clip. |
| **Create Video Player GameObject** | Sets up playback object. |
| **Video RenderTexture** | Target RT; **Use This Video RT as Cookie**. |

### 16.5 Motion grid (LightCookieMotion, layers 1–4)

When **LightCookieMotion** is present, per-layer fields may include:

| Field | Purpose |
|-------|---------|
| **Cycle Duration N** | `Vector2` — UV cycle time. |
| **Magnitude N** | `Vector2` — motion strength. |
| **Time Offset N** | `Vector2` — phase offset. |
| **Motion Mode NU / NV** | Forward vs PingPong on U/V. |
| **PathN U / PathN V** | `AnimationCurve` paths. |
| **TilingN UV / OffsetN UV** | UV transform. |

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
5. **Effects & Animation** — gradual, strobe, step sequencer, motion.  
6. **Volumetrics & Fog** — URP fog override + per-light additional component.  
7. **Color / Sound / Materials** — reactive workflows.  
8. **Basic Settings** — Unity light parity + pipeline caveats.  
9. **PRO Cookies** — layers, motion curves, performance.  
10. **Troubleshooting & FAQ**  

---

## 20) Appendix A — Unity enums (Basic Settings)

*Consolidated into **§13 Basic Settings** → **Appendix A — Unity enums (Basic Settings)** so module docs stay in one place.*

---

## 21) Appendix B — Studio Lighting workflow (checklist)

*Consolidated into **§3 Studio Lighting tab** → **Appendix A — Studio workflow checklist**.*

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

*Consolidated into **§13 Basic Settings** → **Appendix B — Basic Settings control inventory**.*

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

*Consolidated into **§3 Studio Lighting tab** → **Appendix B — Gizmo & label matrix**.*

---

## 26) Appendix G — Effects section: when controls appear

The **Effects** foldout reflects **components** on the GameObject. If a control is missing:

- The backing behaviour (`MonoBehaviour`) may not be attached.  
- The light may be **disabled** or wrong object selected.  
- A preset may need to be applied first to add components.  

**Sequencer**-style fields (**Step Count**, per-step **Intensity** / **Range**) appear when the relevant effect type exposes steps in `DrawEffectsSection`.

---

## 27) Appendix H — Pipeline compatibility matrix

*Consolidated into **§13 Basic Settings** → **Appendix C — Pipeline compatibility (Basic / shadows)**.*

---

## 28) Appendix I — Expanded FAQ

**Q: Why two “preset” areas?**  
A: **Global / toolbar** presets load whole profiles or configs; **per-light Presets** apply to individual lights or asset rows.

**Q: Can I use Studio Lighting without POI?**  
A: You can edit slots, but auto-arrangement and aim targets expect a POI; results may be undefined.

**Q: Cluster vs Light Groups?**  
A: **Cluster** syncs a **small set** of properties for lights in the same character group. **Light Groups** are a **scene-wide** organization list for batch operations — different data structures.

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

See **§16 PRO Cookies** for the full Texture / Animated / Video breakdown. Summary:

| Region | Typical contents |
|--------|------------------|
| **Per-light list** | Edit/Close, tracker/preset actions. |
| **Texture** | 4-layer 2D, cubemap duplicate, **Blur Settings**, motion, built-in cookie. |
| **Animated** | Animated CRT assignment. |
| **Video** | VideoClip, VideoPlayer GO, RenderTexture → cookie. |

Performance tip: fewer animated layers and lower **Blur Scale** reduce per-pixel work.

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

*Consolidated into **§10 Color Switcher** → **Appendix A — Pattern, change type, and speed**.*

---

## 34) Appendix O — Sound: sync with lights

**Sound Effect** path: when **Sync with Light Intensity** is on, **Compensation Volume** sets baseline loudness before mapping so audio follows the light without clipping.

**Sound Reactor** path: see **§11** — the light follows audio level, not the other way around.

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

*Consolidated into **§3 Studio Lighting tab** → **Appendix C — Quick reference: Studio sliders**.*

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
| Color Switch Speed | 0.1 | 50 |
| Audio Volume / Compensation | 0 | 1 |
| Intensity Multiplier (Sound Reactor) | 0 | 5 |
| Base Intensity (Sound Reactor) | 0 | 2 |
| Color Change Speed (Sound Reactor) | 0 | 20 |
| Threshold (Sound Reactor) | 0 | 4 |
| Shadow Strength | 0 | 1 |

**Max Blur** / **Blur Scale** apply to **PRO Cookies → Texture** only (**§16**), not to Gradual / Strobe / Step Sequencer.

---

## 39) Appendix T — Related Unity windows

| Unity window | Opens from LLP |
|----------------|----------------|
| **Lighting** | **Open Lighting Settings** |
| **Light Explorer** | **Open Light Explorer** |
| **Render Pipeline Asset** | **Open Render Pipeline Asset** |

---

## 40) Revision note

This manual is maintained against the **Light Lab PRO** editor UI (`LightLabProWindow.cs` and related scripts). Module-specific **Appendix A/B/C** subsections under **§3**, **§10**, and **§13** replace duplicated global appendix bodies where noted in **§20–§27** and **§33**, **§37**.

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
| 20 | Appendix A — Unity enums (→ §13 App. A) |
| 21 | Appendix B — Studio checklist (→ §3 App. A) |
| 22 | Appendix C — Cluster sync |
| 23 | Appendix D — Basic inventory (→ §13 App. B) |
| 24 | Appendix E — Sorting options |
| 25 | Appendix F — Gizmo matrix (→ §3 App. B) |
| 26 | Appendix G — Effects visibility |
| 27 | Appendix H — Pipeline matrix (→ §13 App. C) |
| 28 | Appendix I — FAQ |
| 29 | Appendix J — Editor tips |
| 30 | Appendix K — Glossary |
| 31 | Appendix L — PRO Cookies regions |
| 32 | Appendix M — Material Changer use |
| 33 | Appendix N — Color Switcher (→ §10 App. A) |
| 34 | Appendix O — Sound sync |
| 35 | Appendix P — Day–Night preview |
| 36 | Appendix Q — Asset hygiene |
| 37 | Appendix R — Studio sliders (→ §3 App. C) |
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
