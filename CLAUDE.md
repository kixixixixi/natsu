# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` or `npm run dev`
- **Build**: `pnpm build` or `npm run build`
- **Production server**: `pnpm start` or `npm run start`
- **Linting**: `pnpm lint` or `npm run lint`
- **Type checking**: `pnpm typecheck` or `npm run typecheck`
- **Code formatting**: `pnpm format` or `npm run format`

## Package Manager

This project uses **pnpm** (version 10.14.0) as specified in `packageManager` field. Use pnpm commands for dependency management.

## Architecture

This is a **Next.js 15** application using React 19 with TypeScript:

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode disabled)
- **Styling**: No specific CSS framework configured
- **Audio**: Tone.js library included for audio synthesis

### Project Structure

- `app/` - Next.js App Router directory
  - `layout.tsx` - Root layout with Japanese locale (`lang="ja"`)
  - `page.tsx` - Main page component (currently minimal)
- Configuration files at root level

### Development Configuration

- **ESLint**: Configured with React, TypeScript, and accessibility rules
- **Prettier**: Code formatting configured
- **TypeScript**: Target ES2017, strict mode disabled
- Ignores `.next` directory during linting

### Key Dependencies

- **tone**: Audio synthesis library (v15.2.7) - suggests this may be a music/audio application
- Standard Next.js, React, and TypeScript setup

## Code Style

- React components don't need explicit React imports (configured in ESLint)
- Unused variables with `_` prefix are allowed
- Accessibility rules enforced via jsx-a11y plugin