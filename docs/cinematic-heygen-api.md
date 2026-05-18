# Cinematic and HeyGen API Routes

## Routes

- `GET /api/heygen/validate`
- `GET /api/heygen/video-status?videoId=mock-heygen-video-test`
- `POST /api/heygen/create-lesson-video`
- `POST /api/cinematic/generate-spec`

## HeyGen Environment

Server-side only:

- `HEYGEN_API_KEY`
- `HEYGEN_DEFAULT_AVATAR_ID`
- `HEYGEN_DEFAULT_VOICE_ID`
- `HEYGEN_CALLBACK_URL`

Never prefix these with `NEXT_PUBLIC_`. The client only calls local API routes; secrets stay on the server.

## Demo Mode

When `HEYGEN_API_KEY` is missing, HeyGen routes return safe demo responses with `source: "mock"` and `status: "demo"`. This keeps Cinematic Studio working without route errors or production crashes.

If HeyGen variables are present, this build still returns an interface-ready demo response until the exact account-specific HeyGen production endpoint mapping is enabled.

## Product Boundary

HeyGen creates the avatar/video layer only. EIS Learning Studio renders the interactive lesson activity from the `CinematicLessonSpec`.

## Cinematic Spec Generation

`POST /api/cinematic/generate-spec` returns a valid template-backed `CinematicLessonSpec` for Maths, Science, or English. It uses the requested scene type when valid for the subject, otherwise it falls back to the subject default.
