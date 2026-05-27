# The Heist (Spectacles Lens)

## What this project is

The Heist is a co-op bomb defusal Lens built for Spectacles. One player runs the safe puzzle flow in AR, and teammates can join the session through Snap Cloud room sharing.

This project originally won 1st place in a Lenslist Spectacles challenge. After that, we rebuilt the production codebase from the ground up. The current version has upgraded visuals, cleaner Spectacles UIKit integration, and a full TypeScript rewrite across gameplay scripts.

## Why this repo is open source

This repo is meant to be a practical reference for:

- Gameplay state orchestration in Lens Studio
- Reusable interaction components for AR puzzles
- Snap Cloud room and realtime messaging patterns
- Audio architecture that is easy to scale and maintain

## How it works at runtime

At a high level, the flow is:

- Main menu and mode selection
- Surface placement and safe spawn
- Puzzle gameplay with timer and penalties
- Win or fail presentation
- Return to menu and session cleanup

The main orchestrator is `Assets/Scripts/GameFlowController.ts`. It coordinates menu routes, safe lifecycle, post-game handling, and network hooks for co-op sessions.

## Architecture overview

### Flow layer

- `Assets/Scripts/GameFlowController.ts` handles game state transitions and top-level session control.
- `Assets/Scripts/MenuController.ts` owns menu screens, tab routing, and post-game UI presentation.

### Gameplay layer

- `Assets/Scripts/Safe/Safe.ts` is the safe runtime entry point.
- Module scripts in `Assets/Scripts/Modules/` implement puzzle logic and completion rules.
- `Assets/Scripts/SafeRotationManager.ts` handles safe rotation interaction and visual feedback.

### Services layer

- `Assets/Scripts/CoopNetworkController.ts` manages Snap Cloud auth, rooms, realtime messaging, and frame streaming.
- `Assets/Scripts/SoundManager.ts` provides a global audio API used throughout gameplay and UI.
- `Assets/Scripts/AppState.ts` stores persistent and runtime state.
- `Assets/Scripts/Utils.ts` exposes utility helpers and animation wrappers via `global.utils`.

## Reusable script spotlights

### PushButton (`Assets/Scripts/PushButton.ts`)

This script is a reusable physical button component for AR interaction.

- Uses fingertip depth against a button plane to derive press amount
- Supports hover and trigger thresholds
- Calls an external method on another script when triggered
- Includes optional argument passing for generic module wiring
- Provides `disable()` so solved modules can lock input cleanly

Why it is reusable:

- It decouples input detection from puzzle logic
- The callback model makes it easy to reuse in any mini-game module
- Inspector inputs let you tune feel without changing code

### CoopNetworkController (`Assets/Scripts/CoopNetworkController.ts`)

This is the networking backbone for co-op.

- Handles Snap Cloud readiness and sign-in
- Creates and manages room codes/channels
- Syncs spectator/player roster UI
- Sends structured realtime events with optional metadata
- Streams camera frames with encode throttling and send buffering

Why it is reusable:

- It isolates networking concerns away from game logic
- The facade methods are intentionally simple for callers
- It includes practical safeguards for frame size, drop behavior, and cleanup

### SoundManager (`Assets/Scripts/SoundManager.ts`)

This script centralizes all audio behavior.

- Registers global audio methods (`playSfx`, `stopSfx`, `crossfadeBgm`, `setBgmVolume`)
- Supports pooled SFX playback for efficiency
- Supports tagged one-shot SFX that can be stopped by id
- Handles BGM setup and crossfades with smooth volume curves

Why it is reusable:

- Most gameplay/UI scripts can stay audio-agnostic and just call the global API
- Tag-based SFX control helps with stateful sounds and cleanup
- Pooling reduces unnecessary object churn in frequent SFX paths

## UI and UIKit notes

The current UI stack follows Spectacles UIKit patterns more consistently than the original challenge version.

- Inspector sections are grouped for cleaner setup
- Menu routes and tab behavior are centralized in `MenuController.ts`
- UIKit audio behavior is tied to master volume through `UIKitSoundMaster.ts`

## TypeScript migration notes

The entire gameplay script layer was rewritten in TypeScript to improve maintainability and reliability.

Main benefits in this codebase:

- Better contracts between flow, safe, modules, and services
- Safer refactors across large gameplay/state transitions
- Clearer script APIs for AssignableType and ScriptComponent boundaries

## Project layout quick guide

- `Assets/Scripts/GameFlowController.ts` - top-level game/session flow
- `Assets/Scripts/MenuController.ts` - menu and post-game UI
- `Assets/Scripts/Safe/` - safe runtime, module management, timer systems
- `Assets/Scripts/Modules/` - puzzle module implementations
- `Assets/Scripts/CoopNetworkController.ts` - Snap Cloud and streaming
- `Assets/Scripts/SoundManager.ts` - centralized audio service
- `Assets/Scripts/PushButton.ts` - reusable physical button interaction

## Getting started for contributors

- Open the project in Lens Studio and inspect scene wiring for `GameFlowController`.
- Verify required script inputs for menu, safe placement, network requirements, and audio.
- Start reading in this order:
  - `GameFlowController.ts`
  - `MenuController.ts`
  - `Safe/Safe.ts`
  - `Modules/*`
  - `CoopNetworkController.ts`
- Use debug flags in specific scripts when investigating runtime behavior.

## Backstory and credits

The Heist started as a Lenslist Spectacles challenge project and took 1st place. This open-source version reflects everything learned after shipping that first version: cleaner architecture, better visuals, stronger UIKit usage, and a full TypeScript foundation built for long-term development.
