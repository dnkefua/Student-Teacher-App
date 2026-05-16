# EIS Teaching Studio — Acceptance Walkthrough

Pre-demo checklist that exercises every load-bearing path across the
three-subject platform.
Run on **https://dnkefua--student-teacher-app-495806.europe-west4.hosted.app**
or on a freshly cleared `http://localhost:3000`.

For each step: a **green check** = passes, an **amber dot** = passes only in
demo mode (Firebase or AI key missing), a **red cross** = blocker.

---

## 0 · Environment sanity

- [ ] `GEMINI_API_KEY` set on the host (Secret Manager `gemini-api-key`).
- [ ] All seven `NEXT_PUBLIC_FIREBASE_*` env vars set (App Hosting env, public).
- [ ] Firestore database created at `(default)` in `europe-west4`.
- [ ] Cloud Storage bucket exists at `student-teacher-app-495806.firebasestorage.app`.
- [ ] `firestore.rules` and `storage.rules` deployed (`firebase deploy --only firestore,storage`).
- [ ] Dashboard hero status strip shows **4/4 systems online** in green.
- [ ] Dashboard header shows **Auth button** (`Sign in with Google`) when Firebase is configured, or **Demo mode** chip otherwise.
- [ ] Dashboard header **Class picker** lists three classes — Grade 8A, Grade 8B, EIS Demo Class. Selecting one persists across reload.

## 1 · Teacher path · Mathematics

1. Landing page → click **Launch App** (or **Enter Platform**).
2. Sidebar mode toggle on **Teacher** (cyan highlight).
3. Sidebar nav → **Dashboard**. Verify:
   - Persistence badge says **Firestore persistence on** (green).
   - System status strip shows Firestore, Storage, AI, TWA all green.
   - **Subject quick-picker** card shows three tiles (Maths, English, Science) with live unit + lesson counts.
   - Hero 3D scene matches the active assignment's `threeDType`.
4. Scroll to **Active assignment** card. Pick the *Numerical* unit tab → choose a question. Click **Assign to Student**.
5. Click **Open lesson workspace ↗**. Verify Teacher Lesson Workspace renders all sections and **Generate extra questions** returns Gemma 4 output with a badge.
6. Click **Teach live** → Virtual Classroom shows the **Active lesson** panel (maths · 3D explainer button works inline).
7. Sidebar → **Upload Studio**. Verify the **Subject picker** defaults to **Mathematics**. Type a topic, optionally drop a PDF.
   - If you drop a PDF, watch for the **green badge** confirming extracted characters were appended to the context.
   - Click **Generate lesson** → preview renders. Click **Save to library** → green confirmation; new doc in `generatedLessons`.
8. Scroll to the **Lesson library** panel at the bottom of the Upload Studio. The saved lesson appears with the right subject tag, a relative timestamp, and a **Teach** CTA.

## 2 · Teacher path · English (NEW)

1. Sidebar → **EIS Year 8 English**. Verify the studio renders with the purple/gold theme and lists 5 units.
2. Open **Unit 1 · Persuasive devices in advertising**. Verify:
   - Explore tab has student explanation, animated steps, objectives, teacher notes.
   - Right pane shows **Text Annotation Lab** — tag a few lines with different devices.
   - Practice + Assignment tabs render the curriculum content with rubrics + marks.
3. Open **Unit 3 · Sheikh Mohammed & Adam Mohammed — poems of identity**. Right pane shows **Poetry Device Highlighter**.
4. Open **Unit 2 · How Dahl builds Charlie** → right pane shows **Character Analysis Board** — add a quote, pick a trait, type analysis.
5. Open **Unit 1 · Summative analysis of an advert** → right pane shows **PETAL Essay Planner** — fill thesis + 1 PETAL paragraph, hit Copy.
6. Open **Unit 5 · Write Katherina's monologue** → opens the planner; verify the writing flow.
7. Return to Dashboard. Verify the new **Active English lesson** card appears below the subject picker with **Open lesson** + **Teach live** CTAs.
8. Click **Teach live** → Virtual Classroom **Active lesson** panel now shows the English lesson with the English workshop expanding inline (not the maths 3D explainer).

## 3 · Teacher path · Science (NEW)

1. Sidebar → **EIS Year 8 Science**. Verify the studio renders with the emerald theme and lists 4 units.
2. Open **Unit 1 · Animal vs plant cells** → right pane runs **Cell 3D**. Toggle animal ↔ plant. Click each organelle pill — the description card updates.
3. Open **Unit 2 · Solids, liquids and gases** → **Particle Model 3D** runs. Switch between states; particles rearrange and the trail updates.
4. Open **Unit 3 · Balanced vs unbalanced forces** → **Forces & Motion Sim** runs. Move the push and friction sliders; the resultant readout updates and the box accelerates or oscillates.
5. Open **Unit 4 · Series vs parallel circuits** → **Circuit Builder** runs. Toggle series/parallel, change bulb count + voltage, click a bulb to break it — series goes dark, parallel keeps the rest lit.
6. Open **Unit 2 · The pH scale and indicators** → **Chemical Reaction Lab** — pick acid/alkali and adjust mL sliders; the pH readout colour-shifts.
7. Open **Unit 4 · Renewable vs non-renewable energy** → **Energy Transfer Simulator** — pick devices, drag input energy; Sankey-style flow splits between useful and wasted.
8. Open a science lesson that uses **Scientific Method Lab** or **Body Systems 3D** or **Earth & Space Orbit** — all three should render correctly.

## 4 · Student path

1. Sidebar mode toggle → **Student**.
2. Sidebar nav → **Dashboard**. Assignment inbox lists every Firestore-backed assignment for the **active class** (verify swapping class via the picker re-filters the inbox).
3. Open a maths assignment → Student Lesson Player flow as before.
4. Submit an answer → feedback + AI breakdown work.

## 5 · Backend acceptance

- [ ] **Firestore writes verified** in the Console (`assignments`, `studentResponses`, `lessonProgress`, `generatedLessons`).
- [ ] **Storage uploads** verified in the Console (`uploads/{teacherId}/…`).
- [ ] **Real-time submissions** — open two tabs: one as the teacher on Submissions panel, one as the student submitting. The new submission appears in the teacher's panel **without a refresh** and the "Live · onSnapshot" badge pulses.
- [ ] **localStorage fallback** works: temporarily remove `NEXT_PUBLIC_FIREBASE_API_KEY`, rebuild, run the maths flow. UI shows *"Demo mode · Firestore not configured"* and assignments persist only in the current browser tab.
- [ ] **AI demo mode** works for **all three subjects**: temporarily remove `GEMINI_API_KEY`, restart, hit `/api/generate-lesson` with each subject. Responses contain `"source": "mock"` and well-shaped JSON with the right interactive type (`threeDType` for maths, `subjectInteractiveType` for english/science).
- [ ] **No client-side AI key leak.** Search the main HTML chunk for the first 8 characters of your Gemini key — zero hits.
- [ ] **PWA install** works on the live URL.
- [ ] **TWA round-trip** — install the Play Store internal-testing build, open it, fresh content loads (sidebar shows all three subjects).
- [ ] **PDF text extraction** — drop a PDF on the Upload Studio. The green "Extracted N characters" badge appears within a few seconds; the **Teacher notes / context** field gets the extracted text appended.
- [ ] **Auth flow** — when Firebase is configured, the **Sign in with Google** button on the dashboard pops a real Google OAuth flow; after sign-in the chip changes to the signed-in display name and **Sign out** appears.

## 6 · Mastery Analytics (NEW)

- [ ] Sidebar → **Learning Data Hub** → **Mastery Analytics** tab.
- [ ] The **Subject filter row** shows four chips (All / Mathematics / English / Science) each with per-subject event counts.
- [ ] Selecting English filters the heatmap and weakest-concepts list to English concepts only.
- [ ] In the Weakest concepts card, each row shows a subject tag (themed colour) and the **Open intervention** button routes to the right studio (`eis-maths` / `english-studio` / `science-studio`).

## 7 · Build hardening

- [ ] `npx tsc --noEmit` returns no errors.
- [ ] `npx next lint --dir src --dir app` returns no warnings.
- [ ] `npm run build` produces:
  - `/` (static, ~890 kB First Load JS — heavier studios now lazy-load via `dynamic()`, so the initial bundle stays manageable).
  - 16 API routes registered as dynamic Node routes.
- [ ] OpenTelemetry warning from Genkit is benign — does NOT block the build.
- [ ] Three.js scenes load on mobile Chrome (rotate the device, no white flash).
- [ ] Hard refresh in dev never breaks — service worker auto-unregisters in dev.

---

If any item flips amber/red, fix before showing the platform to EIS.
The two most common amber states (Firestore + Storage not configured)
both render gracefully — they're acceptable for an offline-only demo,
but not for the school's real evaluation.
