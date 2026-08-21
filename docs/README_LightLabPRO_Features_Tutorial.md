# Light Lab PRO — Tutorials & Documentation

## 1) Window overview

The **Light Lab PRO** editor window (v2.0.0, Unity 6 URP) has three areas to learn first: the **header** (title + VR Mode), the **tab row**, and the **footer** (Unity shortcuts + version).

### Header

| Control | Notes |
|---------|--------|
| **Light Lab PRO** | Window title (left). |
| **VR Mode: OFF / ON** | Toggles the VR quality profile (URP asset, sky LOD, volumetrics budget). Green when on. See **§61**. |
| **Enable Volumetrics (VR)** | Only appears when VR Mode is **ON**. Raymarch fog on the VR path; froxel stays off. Leave unchecked for an FPS baseline. |

### Tab layout

Use the horizontal tabs under the header to switch workflows:

1. **Studio Lighting** — POI-based studio rigs  
2. **Presets** — Atmosphere Scene Presets (Stylized / HQ catalog), Day-Night Clock, and per-light preset loaders  
3. **FX & Settings** — Light Groups, Scene Lights, and per-light FX foldouts  
4. **Volumetrics** — dedicated **Raymarch** and **Froxel** fog (see **§58**)  
5. **PRO Cookies** — texture / animated / video cookies  
6. **Animation** — Firefly and Rotation  
7. **Day–Night Cycle** — **Directional Light and Sky**, **Moon Manager**, **Lightmap Blending**, **Cycle Manager** (see **§15**, **§57**, **§60**, **§62**)

Per-light options appear after you enable **Edit** on a light in a scene list (Presets, FX & Settings, Volumetrics, PRO Cookies, or Animation).

### Bottom buttons

Across the bottom of the window (outside the tab content):

| Button | Opens |
|--------|--------|
| **Open Lighting Settings** | Unity **Lighting** window |
| **Open Light Explorer** | Unity **Light Explorer** |
| **Open Render Pipeline Asset** | The active **Scriptable Render Pipeline** asset |
| **Open Current Renderer** | The renderer assigned on that pipeline asset (for example `LLP_PC_Renderer`) |

The footer also shows **© 2026 Light Lab PRO** and **v2.0.0**.

### Appendix A — Related Unity windows

| Unity window | Opens from LLP |
|----------------|----------------|
| **Lighting** | **Open Lighting Settings** |
| **Light Explorer** | **Open Light Explorer** |
| **Render Pipeline Asset** | **Open Render Pipeline Asset** |
| **Renderer Data** | **Open Current Renderer** |

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

### Appendix A — Sorting options (exact IDs)

| `LightSortOption` | User-visible meaning |
|-------------------|----------------------|
| `NameAscending` | A → Z by `light.name`. |
| `NameDescending` | Z → A. |
| `TypeAscending` | By `LightType` (ordering per Unity). |
| `TypeDescending` | Reverse type order. |
| `IntensityAscending` | Dim → bright (`light.intensity`). |
| `IntensityDescending` | Bright → dim. |

### Appendix B — Cluster synchronization (what copies)

When **Cluster** is on and lights share the same **group** character, changing a **source** light can sync:

- **Intensity**  
- **Range**  
- **Spot angle**  
- **Color**  
- **Indirect multiplier** (`bounceIntensity`)  
- **Shadows** (type)  

Other properties are not listed in the cluster sync routine — treat cluster as a **linked subset**, not a full duplicate.

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

## 5) Presets tab (Atmosphere catalog + per-light loaders)

The **Presets** tab is the catalog home for **Atmosphere Scene Presets**. Full catalog workflow: **§56**.

### 5.1 Atmosphere Presets (top of the tab)

| Control | Notes |
|---------|--------|
| Help text | Applying a look × time-of-day preset stamps DayNight, Moon, and Global Volume. Enabling also **snaps the clock** to that phase. Does **not** change Lightmap Blending. |
| **Day-Night Clock** | **Time of Day** (0–392°) and **Cycle Speed**. Speed **0** freezes the clock (warning). Negative speed reverses. If Cycle Manager is **Active**, speed is owned there (**§57**). |
| **Refresh Presets** | Reloads the grid and restores factory DayNight / Volume / Moon (confirmation). |
| **Seed Catalog…** | Creates missing Look × TOD presets and restores factory values (confirmation). |
| **Stylized / HQ** | Catalog style tabs. |
| **Look Filter** | **All**, or one look family (Biolume, Clear, Clear Sky, …). |
| Thumbnail grid | Click a card to select. **Enable** / **Enabled** applies that look × phase. |
| **Selected** | Atmosphere Scene Preset asset field. |
| **Capture Thumbnail** | Renders the Game camera (URP + post) into that preset’s thumbnail. Keep the Game tab visible. |

### 5.2 Light Groups & Scene Lights

The same **Light Groups** and **Scene Lights** list used on **FX & Settings** sit under the catalog. **Edit** a light to expand typed preset loaders:

| Foldout | Loads |
|---------|--------|
| **Global Presets** | Whole-window lighting profile |
| **FX & Settings Presets** | Per-light FX bundle (**§7**) |
| **Volumetrics Presets** | Fog / additional-light bundle |
| **Animation Presets** | Firefly / Rotation |
| **PRO Cookies Presets** | Cookie setup |
| **Point Presets** / **Spot Presets** | Type-specific light presets |

These are **not** Atmosphere Scene Presets. Atmosphere looks are the thumbnail grid at the top of this tab.

---

## 6) Per-light foldouts (order in UI)

On **FX & Settings**, when **Edit** is on, foldouts appear in this order:

1. **Presets**  
2. **Effects**  
3. **Color Switcher**  
4. **Sound Effects**  
5. **Material Changer**  
6. **Basic Settings** (always last)

Volumetrics is **not** in this stack. Use the dedicated **Volumetrics** tab (**§58**).

Each FX section may include a **Details & Instructions** foldout.

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

### Appendix A — When effect controls appear

The **Effects** foldout reflects **components** on the GameObject. If a control is missing:

- The backing behaviour (`MonoBehaviour`) may not be attached.  
- The light may be **disabled** or wrong object selected.  
- A preset may need to be applied first to add components.  

**Sequencer**-style fields (**Step Count**, per-step **Intensity** / **Range**) appear when the relevant effect type exposes steps in `DrawEffectsSection`.

### Appendix B — Quick reference: effect sliders

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

**Max Blur** / **Blur Scale** apply only under **PRO Cookies → Texture** (**§43**), not to Gradual / Strobe / Step Sequencer.

---

## 9) Volumetrics (tab pointer)

All fog, shafts, SSMS, noise, and per-light contribution live on the **Volumetrics** tab — not inside **FX & Settings**.

Open **Volumetrics**, then **Raymarch** or **Froxel**. Both can run at once; each has its own **Enabled** toggle. Full control reference: **§58**.

### Appendix A — Pipeline & volume context

| Topic | Notes |
|-------|--------|
| **SRP** | Confirm **Graphics Settings → Scriptable Render Pipeline** is **URP**. |
| **Renderer feature** | The tab reports whether **Volumetric Fog** is present on the active renderer (for example `LLP_PC_Renderer`). Fog draws when Enabled is on **and** Post Processing is on the camera. |
| **Shadows** | Main-light shadows must be on for directional object shafts. **Basic Settings → Shadows → Resolution** is Built-In only. |

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

### Appendix B — Quick reference: Color Switcher slider

| Slider | Min | Max |
|--------|-----|-----|
| Switch Speed | 0.1 | 50 |

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

### Appendix A — Quick reference: Sound sliders

| Slider | Min | Max |
|--------|-----|-----|
| Audio Volume / Compensation | 0 | 1 |
| Intensity Multiplier (Sound Reactor) | 0 | 5 |
| Base Intensity (Sound Reactor) | 0 | 2 |
| Color Change Speed (Sound Reactor) | 0 | 20 |
| Threshold (Sound Reactor) | 0 | 4 |

### Appendix B — Sync, compensation, and direction

**Sound Effect:** when **Sync with Light Intensity** is on, **Compensation Volume** sets baseline loudness before mapping so audio follows the light without clipping.

**Sound Reactor:** the **light** follows **audio level**, not the other way around — see the comparison table at the start of **§11**.

---

## 12) Material Changer

| Control | Notes |
|---------|--------|
| **Material list / Selected Material** | Popup or index into materials array. |
| **Instantiate Materials** | Toggle — duplicate materials for safe per-light edits. |
| **Affect Albedo** | Toggle |
| **Affect Emission** | Toggle |
| **Emission Multiplier** | Slider — scales emission when enabled. |

### Appendix A — Expected use (checklist)

| Step | Action |
|------|--------|
| 1 | Pick target materials index from the popup. |
| 2 | Enable **Instantiate Materials** if you must avoid shared asset edits. |
| 3 | Toggle **Affect Albedo** / **Affect Emission** to limit channels. |
| 4 | Raise **Emission Multiplier** only when emission path is enabled. |

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

### Appendix D — Quick reference: shadow strength

| Slider | Min | Max |
|--------|-----|-----|
| Shadow Strength | 0 | 1 |

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

## 15) Day–Night Cycle tab

The **Day–Night Cycle** tab drives a scene **`DayNightCycle`**: directional sun (and, for Volumetric Clouds, a separate moon directional), an LLP skybox, Moon Manager, Lightmap Blending, and optional Cycle Manager.

**Time model:** author **Hour / Minute / Second** on the **`DayNightCycleConfig`**. The window also shows **Time of Day** (internal 0–392° arc) and **Current Phase** (Sunrise → Day → Sunset → Night). **Cycle Manager** (**§57**) can own **Cycle Speed** while Active and never snaps the clock when rolling looks.

**Sub-tabs:**

| Sub-tab | Role |
|---------|------|
| **Directional Light and Sky** | Setup, sky type, celestial, clouds, preview, config — **§54**, **§55** |
| **Moon Manager** | Textured moon disc — **§60** |
| **Lightmap Blending** | Baked GI None / Multi Bake / Tint — **§62** |
| **Cycle Manager** | Weighted Atmosphere playlist — **§57** |

### 15.1 Setup row (top of tab)

| Control | Notes |
|---------|--------|
| **DayNightCycle Object** | GameObject that holds **`DayNightCycle`**. Auto-picked when empty. |
| **Set Up Day-Night Cycle** | One-click: creates DayNightCycle, config, directional light, skybox, MoonCycle, and DayNightBakedLighting. Skips anything already set up. Does **not** add Cycle Manager (add that from the Cycle Manager sub-tab). |

### 15.2 Skybox Type

On **Directional Light and Sky**, after **Configuration** / **Skybox Material**:

| Button | Sky |
|--------|-----|
| **Clear Sky** | Atmosphere without FBM / HQ march |
| **Stylized Clouds** | Painterly FBM deck |
| **HQ Clouds** | In-skybox volumetric march |
| **Volumetric Clouds** | Physically based sky + MIT volumetric clouds (sun + moon directionals). In VR Mode this button is hidden; use the VR skybox path instead. |

**Celestial Night Sky** (Stars, Glimmer / Twinkle, Nebula, Aurora, Star Clusters, Galaxies, Shooting Stars) is artistic toggles on the material. **Night Sky Visibility** (when those features fade) is owned by **Celestial Dawn/Dusk hours** on the config — Atmosphere Enable does not overwrite those hours.

Cloud sliders depend on sky type (Stylized vs HQ). Volumetric Clouds settings live on the **LLP Sky** volume (Physically Based Sky + Volumetric Clouds), not as DayNight-mapped tints.

### 15.3 Editor Preview Controls

| Control | Notes |
|---------|--------|
| **Enable Editor Preview** | Lets the cycle run in Edit Mode |
| **Auto Update in Editor** | Advances time using **Editor Update Interval** (0.01–1 s). Lighting/sky writes are throttled; sun/moon **rotation** still updates every editor tick. |
| **Current Phase** | Sunrise / Day / Sunset / Night |
| **Time of Day** | 0–392°. **0°** sunrise, **41°** day, **98°** noon, **161°** sunset, **196°** night, **392°** full cycle |
| **Apply Config Now** | Re-applies config and repaints Scene view |
| **Forward / Reverse** | Toggles which leg of the cycle is advancing |
| **Copy Directional Light & Sky Values** | Copies cycle + config + skybox celestial/cloud floats to the clipboard |

### 15.4 How the cycle behaves

- **Cycle Speed** scales clock advance. **0** holds. **Negative** reverses (`Mathf.Repeat`). While Cycle Manager is Active, that component’s speed is used instead of the catalog config.  
- **0–196**: forward day arc; at **196** night/reverse leg (**196–392**).  
- Phases: Sunrise 0–41, Day 41–161, Sunset 161–196, Night 196–392.  
- Play Mode advances every frame. Edit Mode needs preview + auto-update.

### Appendix A — Editor preview cautions

- Raise **Editor Update Interval** in large scenes.  
- **Time of Day** is the internal angle; **Hour / Minute / Second** is the authored clock.  
- Atmosphere **Enable** snaps the clock to that phase; Cycle Manager rolls do **not**.

### Appendix B — Presets tab clock

The **Presets** tab **Day-Night Clock** is the same `timeOfDay` / cycle speed (or Cycle Manager speed when Active).

---

## 16) PRO Cookies — tab overview (shared)

Use this section for **any** PRO Cookies sub-tab: how you **open** the tool and what is **shared** across Texture / Animated / Video.

**PRO Cookies** is **per-light**. On the **PRO Cookies** tab, pick a light, press **Edit**, then switch the **Texture / Animated / Video** sub-tab. Mode-specific controls are documented only in **§43** (Texture), **§44** (Animated), and **§45** (Video) so each module panel stays on-topic.

### 16.1 Scene list (per-light)

| Control | Notes |
|---------|--------|
| **Refresh Light List** / **Select All** / **Deselect All** | Same patterns as the main scene list. |
| **Sort Lights By** | e.g. Name Ascending. |
| **Per row** | Light name, status (e.g. **No Cookies**), **Edit** / **Close** for the row in focus. |

### 16.2 Shared bottom actions

| Button | Purpose |
|--------|---------|
| **Remove Cookies from This Light** | Clears cookie setup for the active light. |
| **Add PRO Cookies Tracker** | Adds/updates **`LightCookieTracker`** so settings can persist. |
| **Cleanup Orphaned Tracker** | Removes stray tracker references. |
| **Create PRO Cookies Preset from This Light** | Writes a **`ProCookiesPreset`** asset from the current light. |

### Appendix A — Where to read per mode

| Sub-tab | Section |
|---------|---------|
| **Texture** (layers, blur, motion, built-in cookie) | **§43** |
| **Animated** (CRT) | **§44** |
| **Video** (clip, player, render texture) | **§45** |

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
| **Cycle Speed is 0 — clock is frozen** | Expected. Raise Cycle Speed on Presets, Day-Night config, or Cycle Manager (when Active). Negative speed reverses. |
| **No fog on screen** | Enable Raymarch and/or Froxel, confirm the Volumetric Fog renderer feature, and enable Post Processing on the camera. |
| **VR Mode but no headset stereo** | VR Mode is a quality profile only. Start OpenXR / Quest Link separately. |

---

## 19) Suggested documentation website structure

If you publish this as a manual site:

1. **Getting Started** — dock window, VR Mode, footer shortcuts.  
2. **Scene Lights** — sorting, cluster, focus.  
3. **Studio Lighting** — POI, arrangement sliders, gizmos, live-edit.  
4. **Presets** — Atmosphere catalog, Seed/Refresh, per-light loaders.  
5. **FX & Settings** — groups, gradual, strobe, sequencer, color, sound, materials, basic.  
6. **Volumetrics** — Raymarch & Froxel, cloud shadows, SSMS, fog regions.  
7. **PRO Cookies** — **§16** overview; **§43–§45** per mode.  
8. **Animation** — Firefly and Rotation.  
9. **Day–Night Cycle** — sky types, Moon Manager, Lightmap Blending, Cycle Manager.  
10. **Troubleshooting & FAQ**  

---

## 20) Reference stub: Unity enums (Basic Settings)

*Body moved to **§13 Basic Settings → Appendix A**.*

---

## 21) Reference stub: Studio workflow checklist

*Body moved to **§3 Studio Lighting → Appendix A**.*

---

## 22) Reference stub: Cluster synchronization

*Body moved to **§2 Scene Lights → Appendix B**.*

---

## 23) Reference stub: Basic Settings control inventory

*Body moved to **§13 Basic Settings → Appendix B**.*

---

## 24) Reference stub: Sorting options

*Body moved to **§2 Scene Lights → Appendix A**.*

---

## 25) Reference stub: Studio gizmo matrix

*Body moved to **§3 Studio Lighting → Appendix B**.*

---

## 26) Reference stub: Effects foldout visibility

*Body moved to **§8 Effects → Appendix A**.*

---

## 27) Reference stub: Pipeline compatibility matrix

*Body moved to **§13 Basic Settings → Appendix C** and **§9 Volumetrics → Appendix A**.*

---

## 28) Expanded FAQ

**Q: Why two “preset” areas?**  
A: **Global / toolbar** presets load whole profiles or configs; **per-light Presets** apply to individual lights or asset rows.

**Q: Can I use Studio Lighting without POI?**  
A: You can edit slots, but auto-arrangement and aim targets expect a POI; results may be undefined.

**Q: Cluster vs Light Groups?**  
A: **Cluster** syncs a **small set** of properties for lights in the same character group. **Light Groups** are a **scene-wide** organization list for batch operations — different data structures.

---

## 29) Editor tips

- Undock **Light Lab PRO** to a second monitor for long sessions.  
- Use **Deselect All** before switching scenes to reduce serialization load.  
- After large hierarchy changes, **Refresh Light List** before trusting foldout state.  
- For reproducible cookies, note **Seed** values in **Firefly Motion** and PRO cookie layers.  

---

## 30) Glossary

| Term | Meaning |
|------|---------|
| **POI** | Point Of Interest — transform the rig orbits / aims at. |
| **Studio slot** | One row in the Studio Lighting list bound to a `Light`. |
| **Foldout** | IMGUI expandable section (`EditorGUILayout.Foldout`). |
| **Preset** | ScriptableObject or serialized profile applied via popup. |
| **Indirect Multiplier** | Unity’s `Light.bounceIntensity` (GI bounce contribution). |
| **SRP** | Scriptable Render Pipeline (URP/HDRP). |

---

## 31) Reference stub: PRO Cookies UI regions

*Shared list and buttons: **§16**. Per sub-tab: **§43** (Texture), **§44** (Animated), **§45** (Video). Summary table: **§16 → Appendix A**.*

---

## 32) Reference stub: Material Changer checklist

*Body moved to **§12 Material Changer → Appendix A**.*

---

## 33) Reference stub: Color Switcher notes

*Body moved to **§10 Color Switcher → Appendix A** (and **Appendix B** for slider bounds).*

---

## 34) Reference stub: Sound sync notes

*Body moved to **§11 Sound → Appendix B**.*

---

## 35) Reference stub: Day–Night preview cautions

*Body moved to **§15 Day–Night cycle → Appendix A**.*

---

## 36) File & asset hygiene

- Keep preset assets in a **dedicated folder** under `Assets/`.  
- Name presets with **pipeline** or **scene** tags, e.g. `Studio_Night_URP`.  
- After upgrading Unity, re-open **Light Lab PRO** and run **Refresh Light List**.  

---

## 37) Reference stub: Studio slider quick reference

*Body moved to **§3 Studio Lighting → Appendix C**.*

---

## 38) Reference stub: Combined slider quick reference

*Split across modules: **§8 Effects → Appendix B**, **§10 Color Switcher → Appendix B**, **§11 Sound → Appendix A**, **§13 Basic Settings → Appendix D** (shadow strength). **Max Blur** / **Blur Scale**: **§43 PRO Cookies — Texture**.*

---

## 39) Reference stub: Related Unity windows

*Body moved to **§1 Window overview → Appendix A**.*

---

## 40) Revision note

Appendix lettering **restarts at A** within each numbered section (**§1**, **§2**, **§3**, …) so module views on the site never show skipped letters. Sections **§20–§39** keep stable IDs for deep links but use neutral titles; long-form text lives under the primary section’s **Appendix A, B, C, …** in order.

---

## 41) Section index (1–62)

| § | Title |
|---|--------|
| 1 | Window overview |
| 2 | Scene Lights list |
| 3 | Studio Lighting tab |
| 4 | Light Groups |
| 5 | Presets tab (Atmosphere catalog + per-light loaders) |
| 6 | Per-light foldout order |
| 7 | Presets section |
| 8 | Effects section |
| 9 | Volumetrics (tab pointer) |
| 10 | Color Switcher |
| 11 | Sound |
| 12 | Material Changer |
| 13 | Basic Settings |
| 14 | Animation tab |
| 15 | Day–Night Cycle tab |
| 16 | PRO Cookies — tab overview (shared) |
| 17 | Preset asset types |
| 18 | Troubleshooting |
| 19 | Suggested website structure |
| 20 | Reference stub → §13 App. A |
| 21 | Reference stub → §3 App. A |
| 22 | Reference stub → §2 App. B |
| 23 | Reference stub → §13 App. B |
| 24 | Reference stub → §2 App. A |
| 25 | Reference stub → §3 App. B |
| 26 | Reference stub → §8 App. A |
| 27 | Reference stub → §13 App. C / §9 App. A |
| 28 | Expanded FAQ |
| 29 | Editor tips |
| 30 | Glossary |
| 31 | Reference stub → §16 / §43–§45 |
| 32 | Reference stub → §12 App. A |
| 33 | Reference stub → §10 App. A–B |
| 34 | Reference stub → §11 App. B |
| 35 | Reference stub → §15 App. A |
| 36 | File & asset hygiene |
| 37 | Reference stub → §3 App. C |
| 38 | Reference stub (sliders split; blur → §43) |
| 39 | Reference stub → §1 App. A |
| 40 | Revision note |
| 41 | Section index (this table) |
| 42 | Cross-references (scripts) |
| 43 | PRO Cookies — Texture only |
| 44 | PRO Cookies — Animated only |
| 45 | PRO Cookies — Video only |
| 46 | Day–Night — Moon Manager sub-tab |
| 47 | Gradual Effect (module view) |
| 48 | Strobe Effect (module view) |
| 49 | Step Sequencer (module view) |
| 50 | Sound Effect (module view) |
| 51 | Sound Reactor (module view) |
| 52 | Animation: Firefly Motion (module view) |
| 53 | Animation: Rotation Animator (module view) |
| 54 | Day–Night: Directional A — setup, sky type, preview |
| 55 | Day–Night: Directional B — configuration settings |
| 56 | Atmosphere Scene Presets |
| 57 | Cycle Manager |
| 58 | Volumetrics tab — Raymarch & Froxel |
| 59 | HQ, Stylized, and Volumetric clouds |
| 60 | Moon Manager (detail) |
| 61 | VR Mode |
| 62 | Lightmap Blending |

---

## 42) Cross-references (scripts)

| Topic | Primary script / location |
|-------|---------------------------|
| Main editor window | `Editor/Main Window/LightLabProWindow.cs` |
| Studio target | `StudioLightingTarget` (component) |
| Light groups | `LightGroupsDataV2` and related editors |
| Cookie motion | `LightCookieMotion` (fields referenced in PRO Cookies UI) |
| Day–night sun & sky | `DayNightCycle`, `DayNightCycleConfig` — `Light Lab PRO/Day Night Cycle Tool/Scripts/` |
| Moon cycle | `MoonCycleWithIndividualZenithFlip`, `MoonCycleConfig` — same folder |

Use **Solution Explorer** / **Search in Files** in Unity for exact class filenames.

---

## 43) PRO Cookies — Texture mode only

On the **PRO Cookies** tab, pick a light, press **Edit**, then open the **Texture** sub-tab.

### Shared scene list

| Control | Notes |
|---------|--------|
| **Refresh Light List** / **Select All** / **Deselect All** | Same patterns as the main scene list. |
| **Sort Lights By** | e.g. Name Ascending. |
| **Per row** | Light name, status (e.g. **No Cookies**), **Edit** / **Close** for the row in focus. |

### Shared bottom actions

| Button | Purpose |
|--------|---------|
| **Remove Cookies from This Light** | Clears cookie setup for the active light. |
| **Add PRO Cookies Tracker** | Adds/updates **`LightCookieTracker`** so settings can persist. |
| **Cleanup Orphaned Tracker** | Removes stray tracker references. |
| **Create PRO Cookies Preset from This Light** | Writes a **`ProCookiesPreset`** asset from the current light. |

### Texture mode controls

| Area | Notes |
|------|--------|
| **Cookie Material** | Optional material slot. |
| **4-Layer Setup (2D Textures)** | Four texture slots with tint / picker. |
| **Duplicated Cubemaps** | **Duplicate & Convert to Cubemap** — builds **CMap 1–4** cubemaps from the 2D layers (e.g. for point lights). |
| **Blur Settings** | **Max Blur** (0–20) and **Blur Scale** (0.1–5). These sliders exist **here only** (not on Gradual / Strobe / Step Sequencer). |
| **Cookie Motion Setup** | **`LightCookieMotion`** reference; **Add LightCookieMotion Script**; **Create/Update Cookie (Texture)**. |
| **Cookie CRT** | Optional **Custom Render Texture** for advanced setups. |
| **Built-In Cookie Settings** | Unity **Cookie** slot; tooltip covers size/offset rules for **directional** lights. |

### Appendix A — LightCookieMotion fields (layers 1–4)

When **`LightCookieMotion`** is present, per-layer fields can include:

| Field | Purpose |
|-------|---------|
| **Cycle Duration N** | `Vector2` — UV cycle time. |
| **Magnitude N** | `Vector2` — motion strength. |
| **Time Offset N** | `Vector2` — phase offset. |
| **Motion Mode NU / NV** | Forward vs PingPong on U/V. |
| **PathN U / PathN V** | `AnimationCurve` paths. |
| **TilingN UV / OffsetN UV** | UV transform. |

Performance tip: fewer animated layers and lower **Blur Scale** reduce per-pixel work.

---

## 44) PRO Cookies — Animated mode only

On the **PRO Cookies** tab, pick a light, press **Edit**, then open the **Animated** sub-tab. There is **no** Texture 4-layer or Video workflow on this screen.

### Shared scene list

| Control | Notes |
|---------|--------|
| **Refresh Light List** / **Select All** / **Deselect All** | Same patterns as the main scene list. |
| **Sort Lights By** | e.g. Name Ascending. |
| **Per row** | Light name, status (e.g. **No Cookies**), **Edit** / **Close** for the row in focus. |

### Shared bottom actions

| Button | Purpose |
|--------|---------|
| **Remove Cookies from This Light** | Clears cookie setup for the active light. |
| **Add PRO Cookies Tracker** | Adds/updates **`LightCookieTracker`** so settings can persist. |
| **Cleanup Orphaned Tracker** | Removes stray tracker references. |
| **Create PRO Cookies Preset from This Light** | Writes a **`ProCookiesPreset`** asset from the current light. |

### Animated mode controls

| Control | Notes |
|---------|--------|
| Info box | Assign **Animated CRT** and edit the initialization material (**m_InitMaterial**) as needed. |
| **Animated CRT** | **Custom Render Texture** reference. |
| **Assign Animated Cookie** | Applies the CRT-driven setup as the light’s cookie. |

---

## 45) PRO Cookies — Video mode only

On the **PRO Cookies** tab, pick a light, press **Edit**, then open the **Video** sub-tab. There is **no** Texture layer UI or Animated CRT field here.

### Shared scene list

| Control | Notes |
|---------|--------|
| **Refresh Light List** / **Select All** / **Deselect All** | Same patterns as the main scene list. |
| **Sort Lights By** | e.g. Name Ascending. |
| **Per row** | Light name, status (e.g. **No Cookies**), **Edit** / **Close** for the row in focus. |

### Shared bottom actions

| Button | Purpose |
|--------|---------|
| **Remove Cookies from This Light** | Clears cookie setup for the active light. |
| **Add PRO Cookies Tracker** | Adds/updates **`LightCookieTracker`** so settings can persist. |
| **Cleanup Orphaned Tracker** | Removes stray tracker references. |
| **Create PRO Cookies Preset from This Light** | Writes a **`ProCookiesPreset`** asset from the current light. |

### Video mode controls

| Control | Notes |
|---------|--------|
| Info box | Pick a **VideoClip**, create a **VideoPlayer** `GameObject`, render to a **RenderTexture** (**2D** for Spot/Directional, **Cube** for Point), then assign as cookie. |
| **Video Clip** | Source **VideoClip**. |
| **Create Video Player GameObject** | Creates the playback object in the scene. |
| **Video RenderTexture** | Target **RenderTexture** asset/slot. |
| **Use This Video RT as Cookie** | Assigns that RT as the light cookie. |

---

## 46) Day–Night Cycle — Moon Manager sub-tab

Open **Day–Night Cycle → Moon Manager**. **Copy Moon Manager Values** copies the live fields to the clipboard.

Full field list: **§60**. This section is the module deep-link used by the docs sidebar.

### 46.1 What Moon Manager drives

- Moon disc / glow on the active LLP skybox (not a game-camera HUD).  
- **Moon Phase**, feathers, visibility/mask, dark brightness, and curve.  
- **Inner Phase (Cutout)** — shadow size, feather, offset, glow.  
- **Editor Visibility** — Always Show In Editor **or** Show At Night Only.  
- Optional **`MoonCycleConfig`** stamped by Atmosphere Scene Presets.

### 46.2 Field groups

| Group | Role |
|--------|------|
| **Appearance** | Size, color, HDR, phase, feathers, mask, curve, offsets |
| **Inner Phase (Cutout)** | Shadow + glow |
| **Transparency / Positioning / Rotation** | Billboard, distance, freeze |
| **Texture Orientation** | Keep Stable or Gradual Phase Flip |
| **Visibility** | Always vs Night Only |
| **Profile / Rendering** | Moon config asset, render target |

### Appendix A — Presets

Atmosphere Scene Presets stamp moon values per look × phase. HQ looks typically use **Mask** + **Show At Night Only**.

---

## 47) Gradual Effect (module view)

In **FX & Settings**, enable **Gradual Effect** with the blue **Enable** toggle on that row. The **`GradualEffect`** component must be on the light (add it manually or apply an FX preset that includes gradual). **Max Blur** / **Blur Scale** are **not** part of this effect—they belong to **PRO Cookies → Texture** (**§43**).

Smoothly animates intensity and/or range between min/max bounds.

| Control | Notes |
|---------|--------|
| **Load Current Values** | Pulls current light values into the min/max fields. |
| **Minimum / Maximum Intensity** | Slider bounds for intensity animation (0–50 in UI). |
| **Minimum / Maximum Range** | Slider bounds for range animation (0–50 in UI). |
| **Behavior** | **Forward**, **Reverse**, **PingPong**, or **Random** (`GradualBehavior`). |
| **Min / Max Intensity Speed** | How fast intensity moves (0.1–40; **Unconstrain** toggles constant vs random speed). |
| **Min / Max Range Speed** | How fast range moves (0.1–10; **Unconstrain** where shown). |
| **Make Preset** | Saves this configuration into an FX preset asset. |

If the foldout is missing, the **`GradualEffect`** behaviour is not on the GameObject—enable **Edit** on the light, toggle **Enable**, or apply a preset first.

### Appendix A — When Gradual controls appear

| Situation | What to check |
|-----------|----------------|
| Foldout missing | **`GradualEffect`** not attached, or light not in **Edit** mode. |
| Sliders look wrong after edits | Use **Load Current Values** to sync bounds with the live light. |
| No motion in Play Mode | Confirm the component is enabled and min ≠ max for the channel you expect to animate. |

### Appendix B — Quick reference: Gradual sliders

| Slider | Min | Max |
|--------|-----|-----|
| Min/Max Intensity (bounds) | 0 | 50 |
| Min/Max Range (bounds) | 0 | 50 |
| Min Intensity Speed | 0.1 | 40 |
| Max Intensity Speed | 0.1 | 40 |
| Min Range Speed | 0.1 | 10 |
| Max Range Speed | 0.1 | 10 |

---

## 48) Strobe Effect (module view)

In **FX & Settings**, enable **Strobe Effect** with the blue **Enable** toggle. The **`StrobeEffect`** component must be on the light. **Max Blur** / **Blur Scale** are **not** part of this effect—they belong to **PRO Cookies → Texture** (**§43**).

Snaps intensity and/or range between min and max on a timer (pulse-style).

| Control | Notes |
|---------|--------|
| **Load Current Values** | Pulls current light values into the min/max fields. |
| **Minimum / Maximum Intensity** | Endpoints of the strobe (0–50). |
| **Minimum / Maximum Range** | Endpoints for range strobe (0–50). |
| **Behavior** | **Loop** (alternate min/max) or **Random** (`StrobeBehavior`). |
| **Min / Max Intensity Speed** / **Min / Max Range Speed** | Toggle timing between min/max (0.1–40 intensity, 0.1–10 range; **Unconstrain** where shown). |
| **Make Preset** | Saves into an FX preset asset. |

### Appendix A — When Strobe controls appear

| Situation | What to check |
|-----------|----------------|
| Foldout missing | **`StrobeEffect`** not attached, or light not in **Edit** mode. |
| Strobe feels too fast/slow | Speed fields control **toggle rate** (cycles per second style), not smooth fade—compare with **Gradual Effect** if you need ramps. |
| Random vs Loop | **Loop** alternates endpoints; **Random** picks a random value in the min/max band each pulse. |

### Appendix B — Quick reference: Strobe sliders

| Slider | Min | Max |
|--------|-----|-----|
| Min/Max Intensity (bounds) | 0 | 50 |
| Min/Max Range (bounds) | 0 | 50 |
| Min Intensity Speed | 0.1 | 40 |
| Max Intensity Speed | 0.1 | 40 |
| Min Range Speed | 0.1 | 10 |
| Max Range Speed | 0.1 | 10 |

---

## 49) Step Sequencer (module view)

In **FX & Settings**, enable **Step Sequencer** with the blue **Enable** toggle. The **`LightStepSequencer`** component must be on the light. **Max Blur** / **Blur Scale** are **not** part of this effect—they belong to **PRO Cookies → Texture** (**§43**).

Holds timed **steps**, each with duration, intensity, range, and color.

| Control | Notes |
|---------|--------|
| **Step Count** | Number of steps (slider + field, 1–24). |
| **Behavior** | **Loop** (advance in order) or **Random** order (`StepSequencerBehavior`). |
| **Per step** | **Duration**, **Intensity** (0–10), **Range** (0–100), **Color**. |
| **Make Preset** | Saves into an FX preset asset. |

### Appendix A — When Step Sequencer controls appear

| Situation | What to check |
|-----------|----------------|
| Foldout missing | **`LightStepSequencer`** not attached, or light not in **Edit** mode. |
| Steps do nothing | Ensure **Step Count** > 0 and each step has **Duration** > 0. |
| Colors ignored | Confirm the target **`Light`** on the component matches the edited light. |

### Appendix B — Quick reference: Step Sequencer sliders

| Slider | Min | Max |
|--------|-----|-----|
| Step Count | 1 | 24 |
| Step Intensity | 0 | 10 |
| Step Range | 0 | 100 |

---

## 50) Sound Effect (module view)

**Sound Effect** (`SoundEffectHandler`): **Audio follows the light**. Playback uses an **`AudioSource`** on the same GameObject; optional **Sync with Light Intensity** maps audio volume from the light’s brightness (not the other way around).

| Control | Range | Notes |
|---------|-------|--------|
| **Volume** | 0–1 | Baseline **`AudioSource`** volume when sync is off. |
| **Loop** | Toggle | |
| **Play On Awake** | Toggle | |
| **Mute** | Toggle | |
| **Sync with Light Intensity** | Toggle | **Sound driven by light** — volume follows light intensity. |
| **Compensation Volume** | 0–1 | Baseline loudness added before the intensity mapping when sync is on. |

### Appendix A — Quick reference: Sound Effect sliders

| Slider | Min | Max |
|--------|-----|-----|
| Volume | 0 | 1 |
| Compensation Volume | 0 | 1 |

### Appendix B — Sync and compensation

When **Sync with Light Intensity** is on, **`SoundEffectHandler`** remaps volume from the linked light each frame. **Compensation Volume** sets a floor so quiet lights are not completely silent and bright lights do not clip at 1.0. Turn sync off to drive volume only from the **Volume** field.

---

## 51) Sound Reactor (module view)

**Sound Reactor** (`SoundReactor`): **Light follows the audio**. RMS-style sampling from an **`AudioSource`** drives **`targetLight`** intensity and color—not audio volume.

| Control | Range | Notes |
|---------|-------|--------|
| **Debug Mode** | Toggle | Extra logging in the Console. |
| **Intensity Multiplier** | 0–5 | Scales how strongly intensity responds to normalized amplitude. |
| **Base Intensity** | 0–2 | Baseline light intensity when the signal is quiet. |
| **Color Change Speed** | 0–20 | How fast color shifts between **baseColor** and **reactionColor** with the signal. |
| **Threshold** | 0–4 | Normalized band above which color/intensity reaction ramps up. |

Underlying component fields (when expanded on the GameObject) also include **thresholdMultiplier**, **thresholdFalloff**, **intensitySmoothTime**, and **sampleWindow** for tuning responsiveness.

### Appendix A — Quick reference: Sound Reactor sliders

| Slider | Min | Max |
|--------|-----|-----|
| Intensity Multiplier | 0 | 5 |
| Base Intensity | 0 | 2 |
| Color Change Speed | 0 | 20 |
| Threshold | 0 | 4 |

### Appendix B — Direction of control

The reactor **never** changes **`AudioSource`** volume. Assign a playing clip on the same object (or link **`audioSource`**), then adjust **Base Intensity**, **Intensity Multiplier**, and **Threshold** so the light “listens” to the signal. For audio that follows a light instead, use **Sound Effect** (**§50**).

---

## 52) Animation: Firefly Motion (module view)

On the **Animation** tab, select a light in the list, expand **Firefly Motion**, and use **Enable** to add **`LightFireflyAnimator`**. The light drifts inside a spherical **Motion Area**, picks new waypoints, and jitters with Perlin noise while optionally avoiding obstacles.

| Control | Range (typical) | Notes |
|---------|-----------------|--------|
| **Enable** | Toggle | Adds/removes **`LightFireflyAnimator`**. |
| **Generate Motion Area** | Button | Creates a sibling **`SphereCollider`** volume named `{LightName} Firefly Motion Area`. |
| **Motion Area** | Object reference | **`motionAreaObject`** — bounds for drift. |
| **Motion Area Radius** | Float | Edits the sphere collider radius when assigned. |
| **Min / Max Speed** | Float | Travel speed bounds (`speedMin` / `speedMax`). |
| **Min / Max Jitter** | Float | Perlin noise frequency bounds. |
| **Min / Max Jitter Scale** | Float | Magnitude multiplier for flutter. |
| **Avoid Distance** | Float | Clearance from obstacles (`avoidSphereRadius` on component). |
| **Seed** | Int | Reproducible paths; randomized when the component is first added. |
| **Make Preset** | Button | Saves an **Animation Settings** preset asset. |

**Motion Area Parent** may appear in preset/toolbar context — assigns parent for generated objects.

### Appendix A — Firefly workflow tips

| Tip | Detail |
|-----|--------|
| **Generate first** | Use **Generate Motion Area**, then tweak **Motion Area Radius** to fit your set piece. |
| **Obstacle avoidance** | Raise **Avoid Distance** if the light clips geometry; the script sphere-casts along travel direction. |
| **Reproducibility** | Note **Seed** when sharing presets—identical seeds yield identical paths. |
| **Disable cleanly** | Turning **Enable** off removes the animator and optionally destroys the motion area object. |

---

## 53) Animation: Rotation Animator (module view)

On the **Animation** tab, select a light, expand **Rotation Animator**, and use **Enable** to add **`LightRotationAnimator`**. Rotates enabled axes in **Forward**, **PingPong**, or **Random** mode.

| Control | Notes |
|---------|--------|
| **Enable** | Toggle — adds/removes **`LightRotationAnimator`**. |
| **Use World Space** | Rotate in world vs local space. |
| **Rotation Type** | **Forward**, **PingPong**, or **Random**. |
| **Rotate on X / Y / Z Axis** | Per-axis enable flags. |
| **Forward mode** | **Rotation Speed X / Y / Z** — degrees per second per enabled axis. |
| **PingPong mode** | **Rotation Speed** + **PingPong Range** (start/end angles) per enabled axis. |
| **Random mode** | **Rotation Speed** + **Jitter Amount** per enabled axis. |
| **Make Preset** | Saves an **Animation Settings** preset asset. |

### Appendix A — Rotation type behavior

| Type | Behavior |
|------|----------|
| **Forward** | Continuous spin at each enabled axis speed. |
| **PingPong** | Oscillates between **PingPong Range** min/max angles per axis. |
| **Random** | Applies noisy offsets (**Jitter Amount**) on top of base rotation speeds. |

Combine **Use World Space** with axis toggles when you need a rig to orbit scene axes instead of the light’s local transform.

---

## 54) Day–Night: Directional A — setup, sky type, preview

Use **Set Up Day-Night Cycle** once, then stay on **Directional Light and Sky**.

### Setup

| Control | Notes |
|---------|--------|
| **DayNightCycle Object** | Scene object with **`DayNightCycle`**. Auto-picked when empty. |
| **Set Up Day-Night Cycle** | Creates cycle, config, light, skybox, MoonCycle, and baked-lighting component. Skips pieces that already exist. Does **not** add Cycle Manager. |

### DayNightCycle Details

| Control | Notes |
|---------|--------|
| **Configuration** | **`DayNightCycleConfig`** (phase values in **Directional B**). |
| **Directional Light** | Sun directional. In **Volumetric Clouds** mode this row becomes **Sun Light** + **Moon Light** (separate directionals) with **Ensure Moon Directional Light**. |
| **Skybox Material** | Clear, Stylized, HQ, or Physically Based Volumetric material. |

### Skybox Type

| Button | Notes |
|--------|--------|
| **Clear Sky** | Atmosphere, no FBM / HQ march |
| **Stylized Clouds** | Painterly FBM. Controls: Cloud Color, Coverage, Scale, Opacity, Sun Rays, Stretch, Edge Feathering, Noise Detail, Scroll Speed, Manual Offset, Horizon Height, Wispy Tint / Scale / Strength |
| **HQ Clouds** | In-skybox march. Extra: Density, Shape Detail, Edge Erosion, Altitude, Thickness, Horizon Lift, March Steps, Silver Lining, Light Scatter, Ambient Lift, Self Shadow, Automatic Movement |
| **Volumetric Clouds** | Physically based sky + volumetric cloud volume. Cloud settings live on **LLP Sky → Volumetric Clouds (URP)**, not as mapped DayNight tints |

### Celestial Night Sky

Foldouts: **Stars**, **Glimmer / Twinkle**, **Nebula**, **Aurora**, **Star Clusters**, **Galaxies**, **Shooting Stars**. These are material art toggles. Fade timing is **Celestial Dawn/Dusk hours** on the config (**§55**). Twinkle is compiled out under VR quality LOD.

### Editor Preview Controls

| Control | Notes |
|---------|--------|
| **Enable Editor Preview** / **Auto Update in Editor** | Edit-mode cycle |
| **Editor Update Interval** | 0.01–1 s between lighting/sky writes (rotation still updates every tick) |
| **Current Phase** | Sunrise / Day / Sunset / Night |
| **Time of Day** | 0–392° internal arc |
| **Apply Config Now** / **Forward** / **Reverse** | Re-apply or flip cycle direction |
| **Copy Directional Light & Sky Values** | Clipboard dump of cycle + config + skybox floats |

Sun **X** follows the arc; **Sun Y Rotation** on the config is the compass offset.

### Appendix A — Preview cautions

- Raise **Editor Update Interval** in heavy scenes.  
- **Time of Day** is the internal angle; **Hour / Minute / Second** is the authored clock.

---

## 55) Day–Night: Directional B — configuration settings

**Configuration Settings** is the full **`DayNightCycleConfig`**. Editing **Hour / Minute / Second** syncs **`timeOfDay`**.

| Group | Fields |
|-------|--------|
| **Time Settings** | Hour, Minute, Second, **Cycle Speed** (0 holds; negative reverses). Overridden while Cycle Manager is Active. |
| **Sun Rotation Settings** | **Sun Y Rotation** |
| **Light Intensity Settings** | Sunrise / Day / Sunset intensity, **Moon Light Intensity** (night) |
| **Light Color Settings** | Sunrise / Day / Sunset color, **Moon Light Color** |
| **Sun / Moon Size Settings** | Per-phase sun size; **Moon Size** (use 0 when Moon Manager owns the disc) |
| **Exposure Settings** | Sunrise / Day / Sunset / Night |
| **Additional Skybox Settings** | **Sun Disk** (None / Simple / High Quality), Size Convergence, Atmosphere Thickness, Sky Tint, Ground Color — per phase |
| **Cloud Color Settings** | **Enable Cloud Color Cycle** plus sunrise/day/sunset/night cloud colors |
| **Celestial Night Visibility** | **Celestial Dawn Start/End Hour**, **Celestial Dusk Start/End Hour**. Artist-owned — Atmosphere Enable does not overwrite them |
| **Volumetric Moon Orbit** | **Moon Y Rotation**, **Moon Orbit Inclination**, **Moon Phase Offset** (180 = default cinematic arc). Volumetric Clouds sky only |
| **Volumetric Night & Twilight Shadows** | **Night Shadow Distance** (25–250 m), **Night Shadow Quality** (0 = 1024, then 2048, then 4096 moon slice), Depth/Normal Bias, **Sun Shadow Cutoff**, **Twilight Overlap**, **Twilight Sun Floor**, **Transition Light Overlap**, **Cloud Light Block** |

On Volumetric Clouds, live readouts under Moon Light Intensity show moon weight, twilight Soft window, and sun/moon intensities.

### Appendix A — Phase landmarks

| Phase | Internal angle | Config keys |
|-------|----------------|-------------|
| **Sunrise** | 0° – 41° | `sunrise*` |
| **Day** | 41° – 161° | `day*` |
| **Sunset** | 161° – 196° | `sunset*` |
| **Night** | 196° – 392° | `night*` / moon light |

---

## 56) Atmosphere Scene Presets

Open **Presets**. The catalog is **Look × Time of Day** (Sunrise / Day / Sunset / Night) under **Stylized** and **HQ**.

### What a preset contains

| Asset | Role |
|-------|------|
| DayNight config | Sun, sky, exposure. Celestial dawn/dusk hours are **not** overwritten on Enable |
| Volume profile | Fog / grade for that look × phase |
| Moon config | Moon Manager stamp |
| Thumbnail | Grid preview |

### Catalog UI

| Control | Notes |
|---------|--------|
| **Day-Night Clock** | Time of Day + Cycle Speed (or Cycle Manager speed when Active). Speed 0 freezes |
| **Refresh Presets** | Factory restore + reload grid + re-apply the enabled look (confirmation) |
| **Seed Catalog…** | Create missing factory Look × TOD assets and restore factory values (confirmation) |
| **Stylized / HQ** | Style tabs |
| **Look Filter** | All, or one look family |
| **Enable / Enabled** | Applies that look × phase and **snaps the clock** to the phase. Does not take Lightmap Blending |
| **Selected** + **Capture Thumbnail** | Game-view capture into the preset thumbnail |

Do not use legacy `Light Lab PRO/Atmosphere/...` menus — Seed/Refresh live only on this tab.

### HQ looks (factory)

Clear Crisp, Misty, Rainy, Hazy, Snowy, Ash, Crimson, Fair Day, Coastal, Stormfront, Nuclear.

### Stylized looks (factory)

Weather set (Clear, Clear Sky, Partly Cloudy, Cloudy, Overcast, …) plus creative looks (Biolume, Ember, Violet Hour, Noir, …). Stylized grades use **Neutral** tonemapping; Night phases typically include vignette.

---

## 57) Cycle Manager

Open **Day–Night Cycle → Cycle Manager**. Adds **`AtmosphereCycleManager`** only from **Add Cycle Manager** (not from Set Up Day-Night Cycle). Default **Active** is off.

### Behavior

| Rule | Detail |
|------|--------|
| **Roll** | On **phase enter** only — pick included cards for that phase by relative probability |
| **Clock** | Never snaps `timeOfDay` (unlike Presets Enable) |
| **Speed** | While **Active**, owns Cycle Speed. **0** holds. **Negative** reverses. Does not write speed onto catalog configs |
| **Transitions** | Looks **hold** through most of the phase, then blend across the **boundary** (end of current → start of next). Missing celestials/volumes fade to neutral; new ones ramp from neutral |
| **Sun size** | Does **not** blend `_SunSize` / convergence (avoids sun+moon double disc) |
| **Debug** | **Show Phase Debug** — Play Mode HUD |

### UI

| Control | Notes |
|---------|--------|
| **Active** | Enables the playlist and speed override |
| **Cycle Speed** | −10 to 10 |
| **Skybox Materials (build-safe)** | Clear / Stylized / HQ materials used when looks switch sky kind |
| **Include Presets** | Stylized / HQ tabs, Look Filter, **Include** / **Included** on cards |
| **Probabilities** | Relative weights per phase (weight 2 is twice as likely as 1). **Remove** drops a card |
| **Remove Cycle Manager** | Destroys the component; DayNightCycle stays |

Cycle Manager only **references** catalog presets — it does not Seed or rewrite factory assets.

---

## 58) Volumetrics tab — Raymarch & Froxel

Open **Volumetrics**. **Copy Volumetrics Values** dumps active fog + per-light contribution to the clipboard.

Tabs **organize** settings. Each path has its own **Enabled** toggle — Raymarch and Froxel can run together.

The **Renderer Feature** box reports whether Volumetric Fog is on the active URP renderer. Fog composites when Enabled is on **and** Post Processing is on the camera.

### Raymarch

| Area | Controls |
|------|----------|
| **Scene Fog (Raymarch)** | **Create Managed Volume + Profile**, **Create New Profile**. **Enabled**, Density, Distance, Base Height, Maximum Height, Enable Ground Cutoff, **Main Light (Directional)**, Scattering, Anisotropy, Tint. Point/spot volumetrics use **Froxel**, not this path |
| **Sky Cloud Shadows / God Rays** | Shared with Froxel. **Enabled**, Strength, Cloud Deck Height, Debug Stripes. Needs Main Light + Scattering; stylized or HQ cloud skybox |
| **Quality (Raymarch)** | Max Steps, Blur Iterations |
| **Volumetric Lights** | Scene list + per-light **Volumetric Contribution** (directional drives Scene Fog; point/spot need Froxel) |

### Froxel

| Area | Controls |
|------|----------|
| **Volumes** | **Create Global Froxel Volume**, **Create Local Fog Region**. GPU uses up to 8 regions. Select a region in the Inspector for **Local Noise** (Enable, Intensity, Cutoff, Scale, **Wind Speed**, **Axis Speed**, Wind Direction). Axis Speed is per-axis (1 = follow Wind Speed, 0 = no scroll, negative = reverse). Global froxel wind stays a single speed |
| **Scene Fog (Froxel)** | Enabled, Density, Distance, **Attenuation Distance**, Base/Maximum Height, Ground Cutoff, Ambient Color, **Main Light Contribution**, Scattering, Anisotropy, Tint, **Point / Spot Lights (Froxel)** |
| **Sky Cloud Shadows / God Rays** | Same shared foldout as Raymarch |
| **Multiple Scattering (SSMS)** | Intensity (0 disables), Scatter, Radius, Threshold, Max Iterations |
| **Noise (Global Froxel)** | Enable, Scale, Intensity, Cutoff, Wind Speed, Wind Direction, Variable Direction, Gust Strength |
| **Quality (Froxel)** | Temporal Accumulation, Z Jitter, Apply Dither, Grid Width / Height / Depth |

### Per-light Volumetric Contribution

On **Volumetric Lights**, **Edit** a light:

- **Enable** adds `VolumetricAdditionalLight` (does **not** replace Scene Fog).  
- **Volume Profile** + **Create New Profile** / **Set as Active Profile** (only if you intend to replace the global profile).  
- Point/spot: **Contribute To Froxel**, Froxel Intensity / Anisotropy / Falloff / Range Scale / Density Boost / Tint.  
- **Enable All Spot/Point** / **Disable All Spot/Point** for batch toggles.  
- **Make Preset** saves a volumetrics preset from that light.

### Setup checklist

1. Volumetric Fog renderer feature present  
2. Managed volume + profile; enable Raymarch and/or Froxel  
3. Main light contribution + shadows for directional shafts  
4. Point/spot: Contribute To Froxel  
5. Cloud shadows only with a cloudy LLP skybox (or Debug Stripes)

---

## 59) HQ, Stylized, and Volumetric clouds

Four sky kinds from **Skybox Type**:

| Mode | Look |
|------|------|
| **Clear Sky** | Atmosphere without FBM / HQ march |
| **Stylized Clouds** | Painterly flat **Cloud Color** FBM; moon → clouds → soft sun attenuation |
| **HQ Clouds** | In-skybox volumetric march behind opaques |
| **Volumetric Clouds** | Physically based sky + real volumetric clouds (LLP Sky volume) |

### HQ

- Composite in the skybox (behind opaque geometry)  
- Sun after clouds × cloud transmittance — no bullseye clamp ring  
- Sun Rays gated on real cover  

### Stylized

- Factory opacity ~0.7–1.0 (not HQ volumetric opacities)  
- Thin cover uses soft local Beer attenuation, not a hard sun block  

### Volumetric

- Sun and moon are separate directionals  
- Atmosphere/cloud look is the **LLP Sky** volume, not DayNight sky-tint mapping  

Atmosphere Scene Presets (**§56**) stamp the matching sky style and cloud deck per look × phase.

---

## 60) Moon Manager (detail)

**Day–Night Cycle → Moon Manager**. **Copy Moon Manager Values** copies the live fields to the clipboard.

### Groups (as in the window)

| Group | Fields |
|-------|--------|
| **References** | MoonCycle script, DayNightCycle, directional light, moon texture |
| **Appearance** | Moon Size, Color, HDR Intensity, Moon Phase, Phase Feather, Edge Feather, **Phase Visibility Mode** (Transparent / Solid / Mask), Phase Visibility, Phase Mask Opacity, Phase Dark Brightness, Phase Curve, Phase Offset |
| **Inner Phase (Cutout)** | Shadow Size / Feather, **Shadow Opacity Mode**, Shadow Opacity / Mask Opacity / Dark Brightness, Shadow Offset, Shading Direction / Contrast / Bias, Glow Color / Size / Anisotropy / Intensity |
| **Transparency** | Enable Transparency, Alpha |
| **Positioning** | Distance From Camera, Moon Position Offset |
| **Rotation** | Freeze Rotation, Fixed Rotation, Freeze Billboard X/Y/Z, Fix Y Rotation |
| **Texture Orientation** | Keep Stable or Gradual Phase Flip, Texture Rotation Offset |
| **Editor Visibility** | Always Show In Editor **or** Show At Night Only (mutually exclusive). Play Mode still follows night |
| **Profile** | `MoonCycleConfig` |
| **Rendering** | Moon Render Target |

**Mask** matches Transparent for the moon body (no painted dark blob) and hides stars/nebula/clusters/galaxies/shooting stars under the disc — not aurora. Prefer Atmosphere Enable over hand-copying factory recipes.

Celestial fade hours stay on DayNight config (**§55**).

---

## 61) VR Mode

Header: **VR Mode: OFF / ON** (green when on).

VR Mode is a **quality profile** (URP asset, sky LOD, volumetrics budget) — not what starts OpenXR / Quest Link.

When **ON**, **Enable Volumetrics (VR)** appears. Default is off. When enabled, raymarch fog can run on the VR path; **froxel stays off**. Expect a large GPU cost.

### While ON

- Sky uses VR quality LOD (march-step cap, twinkle compiled out)  
- If Volumetric Clouds is already the live sky, VR Mode keeps it (does not force a different skybox)  
- Soft + additional light shadows stay available on the VR RP while volumetric sky is active (sun Main Soft by day; moon Soft on the additional atlas at night)

### Tips

- Re-toggle VR Mode after changing sky type so material keywords re-apply  
- Prefer a development build for headset FPS; the Editor Game view is a high-res mirror

---

## 62) Lightmap Blending

**Day–Night Cycle → Lightmap Blending**. Requires **`DayNightBakedLighting`** on the cycle object (**Add Baked Lighting Component** if missing). Atmosphere Enable does not take over this tab.

| Control | Notes |
|---------|--------|
| **Baked Lighting Config** | `DayNightBakedLightingConfig` asset |
| **Baked GI Mode** | **None** / **Multi Bake** / **Tint** |
| **Runtime Preview** | Current Hour, Current Tint, Blend Segment (e.g. 12:00 → 18:00) |
| **Scene Lighting Settings** | Scene Lighting Settings asset (New / Clone) plus Unity’s lighting inspector |
| **Apply Baked Lighting Preview Now** | Pushes the blend/tint for the current clock |
| **Snapshot Status** | 04:00 / 12:00 / 18:00 / 22:00 — lightmap count or **Missing** |

### Multi Bake

Positions the directional at 04:00, 12:00, 18:00, 22:00, bakes, then blends the two nearest snapshots on the GPU during playback (no stepping).

| Control | Notes |
|---------|--------|
| **Output Folder** | `Assets/Light Lab PRO/Day Night Cycle Tool/Baked Lightmaps/<SceneName>` |
| **Bake All 4 Hours** | Sequential snapshot bakes |
| Per hour | Snapshot asset, **Preview** (sets clock), **Bake** |

### Tint

Smooth GPU material tinting — does **not** rebuild lightmaps while scrubbing.

| Control | Notes |
|---------|--------|
| **Tint Strength** | 0–1 |
| **04:00 / 12:00 / 18:00 / 22:00 Tint** | Keyframe colors |
| **Refresh Tint Renderers** | Rebuilds the tint renderer list |

---

*© Light Lab PRO — documentation updated for Unity 6 URP / v2.0.0. Reconcile with in-editor tooltips for behavior nuances.*
