# Google Play Testing Launch Plan

## Recommended Packaging Route

Use a Trusted Web Activity (TWA) for the first Android test build.

Why:
- The Firebase-hosted web app remains the source of truth.
- Testers receive an installable Android app from Google Play.
- The app can open fullscreen without browser chrome after Digital Asset Links verification.
- Updates to the web app can ship through Firebase without rebuilding Android for every content change.

## Current App Readiness

Implemented in this repo:
- PWA manifest: `/manifest.webmanifest`
- Theme color: `#050711`
- App icons: `/icons/icon-192.png`, `/icons/icon-512.png`
- Service worker: `/sw.js`
- Service-worker registration in the Next root layout
- Branded metadata for EIS Maths Studio

## Android Wrapper Inputs Needed

Before generating the Android App Bundle, confirm:

- Production web URL, for example `https://your-firebase-app.web.app`
- Android package name, recommended: `com.ndnanalytics.eismathsstudio`
- App display name: `EIS Maths Studio`
- Support email
- Privacy policy URL
- Whether the Play Console account is personal or organization

## Play Console Testing Sequence

1. Create the app in Play Console.
2. Complete required app setup:
   - App access
   - Ads declaration
   - Content rating
   - Target audience and content
   - Data safety
   - Privacy policy
   - Store listing
3. Generate a signed Android App Bundle (`.aab`) from the TWA wrapper.
4. Upload the `.aab` to Internal testing first.
5. Add trusted testers by email or Google Group.
6. Verify install, login, camera permission, classroom tools, navigation, and course content on real Android devices.
7. Move to Closed testing when the internal build is stable.

## New Personal Account Requirement

If this is a new personal Play Console account created after November 13, 2023, Google requires a closed test with at least 12 opted-in testers for 14 continuous days before applying for production access.

## QA Checklist For Testers

- App installs from Play testing link.
- Logo and app name appear correctly.
- Landing page loads.
- EIS Grade 8 Maths opens.
- Cinematic lesson engine opens.
- Virtual Classroom camera permission request appears.
- Camera preview works on Android Chrome/WebView environment.
- Navigation remains responsive on mobile.
- No copyrighted YouTube assets appear.
- Offline reload shows cached shell instead of a blank screen.

## Next Build Step

After the production Firebase URL is confirmed, generate the TWA project with Bubblewrap:

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest=https://YOUR_DOMAIN/manifest.webmanifest
bubblewrap build
```

Upload the generated signed `.aab` to Play Console Internal testing.
