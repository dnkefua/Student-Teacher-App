# Firestore Security Rules — Learning Data Hub

Today the Hub ships with intentionally OPEN rules for the EIS evaluation
window (see `firestore.rules`). Before any non-demo production traffic, the
school must tighten the rules to require Firebase Auth + custom claims. This
file documents the target shape.

## Collections

| Collection | Owner | Who reads | Who writes |
|---|---|---|---|
| `platformConnections` | school | admins, teachers in the school | admins only |
| `externalImports` | uploader | admins, the uploader, teachers of the affected class | the uploader; admins for deletes |
| `learningEvents` | uploader / system | admins, teachers of the matching class, the student who owns the event | system writes via repository; teachers can correct mappings |
| `platformStudentMappings` | teacher | admins, teachers in the school | admins and the verifying teacher |
| `studentMasteryProfiles` | system | admins, teachers of the student's class, the student themselves | system writes only |
| `classMasteryProfiles` | system | admins, teachers of the class | system writes only |
| `aiRecommendations` | system / teacher | admins, the teacher who owns the class, the student when the recommendation is studentId-scoped | teacher updates status; system writes new |
| `integrationAuditLogs` | system | admins only | system only (append-only) |

## Auth model

All clients must be signed in via Firebase Auth. We use custom claims to
encode role + school + class memberships:

- `claims.role` ∈ `'admin' | 'teacher' | 'student'`
- `claims.schoolId` (string)
- `claims.classIds` (string[]) — teachers + students only

## Rule sketch

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.token.role == 'admin';
    }
    function isTeacher() {
      return request.auth != null && request.auth.token.role == 'teacher';
    }
    function isStudent() {
      return request.auth != null && request.auth.token.role == 'student';
    }
    function teacherOwnsClass(classId) {
      return isTeacher() && classId in request.auth.token.classIds;
    }
    function studentOwnsEvent(studentId) {
      return isStudent() && request.auth.uid == studentId;
    }
    function sameSchool(schoolId) {
      return request.auth.token.schoolId == schoolId;
    }

    match /platformConnections/{id} {
      allow read: if request.auth != null && sameSchool(resource.data.schoolId);
      allow write: if isAdmin() && sameSchool(request.resource.data.schoolId);
    }

    match /externalImports/{id} {
      allow read: if isAdmin()
        || (isTeacher() && request.auth.uid == resource.data.uploadedBy)
        || (isTeacher() && sameSchool(resource.data.schoolId));
      allow create: if isTeacher() && sameSchool(request.resource.data.schoolId);
      allow delete: if isAdmin() || request.auth.uid == resource.data.uploadedBy;
    }

    match /learningEvents/{id} {
      allow read: if isAdmin()
        || (isTeacher() && resource.data.classId in request.auth.token.classIds)
        || studentOwnsEvent(resource.data.studentId);
      allow create, update: if isTeacher() || isAdmin();
      allow delete: if isAdmin();
    }

    match /platformStudentMappings/{id} {
      allow read: if request.auth != null && sameSchool(resource.data.schoolId);
      allow write: if isAdmin() || teacherOwnsClass(request.resource.data.classId);
    }

    match /studentMasteryProfiles/{id} {
      allow read: if isAdmin()
        || isTeacher()
        || (isStudent() && request.auth.uid == resource.data.studentId);
      allow write: if false; // system writes only via callable function
    }

    match /classMasteryProfiles/{id} {
      allow read: if isAdmin() || teacherOwnsClass(resource.data.classId);
      allow write: if false; // system writes only
    }

    match /aiRecommendations/{id} {
      allow read: if isAdmin()
        || (isTeacher() && (resource.data.classId in request.auth.token.classIds || resource.data.studentId == request.auth.uid))
        || (isStudent() && resource.data.studentId == request.auth.uid);
      allow update: if isAdmin()
        || (isTeacher() && resource.data.classId in request.auth.token.classIds);
      allow create: if isAdmin() || isTeacher();
      allow delete: if isAdmin();
    }

    match /integrationAuditLogs/{id} {
      allow read: if isAdmin();
      allow write: if false; // server-side (callable / admin SDK) only
    }
  }
}
```

## Operational notes

- API tokens for ManageBac / OneRoster / LTI / Caliper / xAPI live in
  Google Cloud Secret Manager, never in any Firestore document.
- The repository layer caches a local copy of every write so the UI keeps
  working when Firestore is temporarily unreachable. Deletes propagate both
  ways through `deleteImportEverywhere`.
- The audit log (`integrationAuditLogs`) is the canonical trail for school
  data governance — every import, mapping confirmation, recommendation
  accept/dismiss is recorded with `actorId` + ISO timestamp.
- Demo mode (no Firebase env) bypasses every rule because nothing reaches
  Firestore at all. Before EIS adoption, the demo mode banner must be
  hidden in production and Firebase Auth must be required at the route
  level.
