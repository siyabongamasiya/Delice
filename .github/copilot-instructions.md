# Copilot Instructions for AI Agents

## Project Overview
- This is an Expo React Native project using file-based routing (see [app/](../app/)).
- Main entry: [app/_layout.tsx](../app/_layout.tsx). Tabs and modals are in [app/(tabs)/](../app/(tabs)/) and [app/modal.tsx](../app/modal.tsx).
- UI components are in [components/](../components/), with reusable primitives in [components/ui/](../components/ui/).
- Theming logic is in [constants/theme.ts](../constants/theme.ts) and [hooks/use-theme-color.ts](../hooks/use-theme-color.ts).

## Developer Workflows
- **Install dependencies:** `npm install`
- **Start development server:** `npx expo start`
- **Reset project to blank state:** `npm run reset-project` (runs [scripts/reset-project.js](../scripts/reset-project.js))
- For Android/iOS emulation, see Expo docs linked in [README.md](../README.md).

## Key Patterns & Conventions
- **File-based routing:** Pages/components in [app/](../app/) map to routes. Use folders and filenames to define navigation structure.
- **Theming:** Use `useThemeColor` and `theme.ts` for color and style consistency.
- **Component structure:** Prefer splitting UI into small, reusable components in [components/](../components/) and [components/ui/](../components/ui/).
- **TypeScript:** All code is TypeScript-first. Follow types in `tsconfig.json`.
- **No backend/server code** in this repo—focus is on client-side mobile app.

## Integration & External Dependencies
- Uses Expo and React Native libraries (see [package.json](../package.json)).
- No custom native modules or server integrations by default.

## Examples
- To add a new tab: create a file in [app/(tabs)/](../app/(tabs)/), e.g., `profile.tsx`.
- To add a new UI primitive: add to [components/ui/](../components/ui/), then import where needed.
- To update theme: edit [constants/theme.ts](../constants/theme.ts) and use `useThemeColor` in components.

## References
- [README.md](../README.md) for getting started and workflow links
- [Expo Router docs](https://docs.expo.dev/router/introduction/) for routing details

---
_Keep instructions concise and project-specific. Update this file if project structure or conventions change._
