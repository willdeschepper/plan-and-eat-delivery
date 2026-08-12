# Android release keystore (local Gradle)

Date: 2026-07-15

## Goal

Enable local signed Android App Bundles via `./gradlew bundleRelease` using a project-owned release keystore.

## Decisions

- New keystore from scratch (app not yet on Play Store)
- Local Gradle signing only (`keystore` + `keystore.properties`)
- Store password / key password: `000000` (team choice)
- Alias: `planandeat-courier`
- Keystore path: `android/app/planandeat-courier-release.keystore`
- Credentials file: `android/keystore.properties` (gitignored)
- Commit a `keystore.properties.example` template without secrets

## Out of scope

- EAS credentials upload
- Play App Signing migration
- iOS certificates
