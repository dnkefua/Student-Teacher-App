# EIS Maths Studio — Acceptance Walkthrough

Pre-demo checklist that exercises every load-bearing path in the platform.
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

## 1 · Teacher path

1. Landing page → click **Launch App** (or **Enter Platform**).
2. Sidebar mode toggle on **Teacher** (cyan highlight).
3. Sidebar nav → **Dashboard**. Verify:
   - Persistence badge says **Firestore persistence on** (green).
   - System status strip shows Firestore, Storage, AI, TWA all green.
   - Hero 3D scene matches the active assignment's `threeDType`.
4. Scroll to **Active assignment** card. Pick the *Numerical* unit tab → choose
   a question card (it gains a gold border). The question pane updates with
   inquiry, objective, 3D scene name and difficulty badge.
5. Click **Assign to Student**. Button breathes → spinner → green
   *"Assigned!"*. (Look for a fresh doc in Firestore
   `assignments` collection.)
6. Click **Open lesson workspace ↗** in the same card. You land on the
   **Teacher Lesson Workspace** with:
   - Header with title, inquiry, objective and 3D-type badge.
   - Animated explainer on the left, 3D scene + teacher note on the right.
   - Worked example block.
   - Action row: **Assign to class**, **Teach live**, **Generate extra
     questions**, **Save lesson**.
7. Click **Generate extra questions**. After ~30 s a panel appears below
   showing 3 fresh AI questions with expected answer, accepted keywords
   and rubric, plus a **Gemma 4** badge.
8. Click **Teach live**. You land in the **Virtual Classroom** with the
   **Active lesson** panel at the top:
   - Lesson title + inquiry + current question.
   - Buttons: *Share lesson in chat*, *Share assignment in chat*,
     *Open 3D explainer*, *Ask AI to explain step*.
9. Click each button:
   - Lesson share → chat gets a teacher-tagged message announcing the lesson.
   - Assignment share → chat gets the question.
   - 3D explainer → matching R3F scene expands inline.
   - Ask AI → chat receives an *AI Tutor* coaching message via Gemma 4.
10. Sidebar → **Upload Studio**. Type a topic ("solving two-step linear
    equations"), drop a PDF (optional), click **Generate lesson**. Preview
    renders the structured lesson with 3D scene. Click **Save to library**
    → green *"Saved to library!"* state; new doc in Firestore
    `generatedLessons` collection.

## 2 · Student path

1. Sidebar mode toggle → **Student**.
2. Sidebar nav → **Dashboard**.
3. **Assignment inbox** lists every Firestore-backed assignment with inquiry
   question, 3D type, and submission status badge.
4. Click **Open lesson** on the assignment created in step 1.5. You land
   in **Student Lesson Player**:
   - Header with progress bar (0% → grows as you advance).
   - Animated explainer left, 3D scene right.
   - Worked example block.
   - Submit-answer textarea (disabled while empty).
5. Step through the animated explainer (Next → Next → Mark complete).
   The progress bar fills. The Practice round reveals.
6. Type an answer that matches the expected keyword (e.g. `x = 7`).
   Click **Submit answer**. Button → spinner → green *"Submitted!"*.
   Below: feedback card with the local 100% verdict.
7. Click **Get AI breakdown**. Card expands with Gemma 4's score,
   feedback, strengths, misconceptions and a next step. **Gemma 4**
   badge on the card.

## 3 · Backend acceptance

- [ ] **Firestore writes verified** in the Console (`assignments`, `studentResponses`, `lessonProgress`, `generatedLessons`).
- [ ] **Storage uploads** verified in the Console (`uploads/{teacherId}/…`).
- [ ] **localStorage fallback** works: temporarily remove `NEXT_PUBLIC_FIREBASE_API_KEY`, rebuild, run the full teacher + student paths. UI shows *"Demo mode · Firestore not configured"* and assignments persist only in the current browser tab.
- [ ] **AI demo mode** works: temporarily remove `GEMINI_API_KEY`, restart, hit `/api/generate-lesson` etc. Responses contain `"source": "mock"` and well-shaped JSON; UI shows the *"AI demo mode"* badge.
- [ ] **No client-side AI key leak.** In Chrome DevTools → Network → view any HTML chunk. Search for the literal first 8 characters of your Gemini key — should return zero hits.
- [ ] **PWA install** works on the live URL (Chrome menu → Install app).
- [ ] **TWA round-trip** — install the Play Store internal-testing build, open it, fresh content loads (the new dashboard, Lesson Player, Upload Studio, etc.).

## 4 · Build hardening — Phase 11

- [ ] `npx tsc --noEmit` returns no errors.
- [ ] `npx next lint --dir src --dir app` returns no warnings.
- [ ] `npm run build` produces:
  - `/` (static, ~680 kB First Load JS)
  - `/api/ai/generate`, `/api/generate-lesson`, `/api/generate-assignment`, `/api/grade-answer`, `/api/generate-3d-scene` as dynamic Node routes.
- [ ] OpenTelemetry warning from Genkit is benign (missing optional jaeger exporter) — does NOT block the build.
- [ ] Three.js scenes load on mobile Chrome (rotate the device, no white flash).
- [ ] Hard refresh in dev never breaks — service worker auto-unregisters in dev.

---

If any item flips amber/red, fix before showing the platform to EIS.
The two most common amber states (Firestore + Storage not configured)
both render gracefully — they're acceptable for an offline-only demo,
but not for the school's real evaluation.
