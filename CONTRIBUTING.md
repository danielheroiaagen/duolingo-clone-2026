# Contributing to Duolingo Clone 2026

First off, thanks for taking the time to contribute! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Git Workflow](#git-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code.

## Git Workflow

We use **Git Flow** for version control:

```
main          ────────────────────────────────> (Production)
                    ↑ merge via PR only
develop       ──────────────────────────────> (Integration)
              ↙ ↘           ↙ ↘
        feature/x    feature/y    hotfix/z
```

### Branches

| Branch | Purpose | Base Branch | Merges Into |
|--------|---------|-------------|-------------|
| `main` | Production-ready code | - | - |
| `develop` | Integration branch | `main` | `main` (via release) |
| `feature/*` | New features | `develop` | `develop` |
| `hotfix/*` | Urgent production fixes | `main` | `main` + `develop` |
| `release/*` | Release preparation | `develop` | `main` + `develop` |

### Rules

1. **NEVER push directly to `main`** - Always use Pull Requests
2. **NEVER push directly to `develop`** - Use feature branches
3. All PRs require at least one approval
4. All PRs must pass CI checks (lint, build, tests)

## Branch Naming Convention

```
<type>/<short-description>
```

### Types

- `feature/` - New features (e.g., `feature/voice-assistant`)
- `fix/` - Bug fixes (e.g., `fix/login-redirect`)
- `hotfix/` - Urgent production fixes (e.g., `hotfix/security-patch`)
- `refactor/` - Code refactoring (e.g., `refactor/stores-migration`)
- `docs/` - Documentation (e.g., `docs/api-reference`)
- `chore/` - Maintenance (e.g., `chore/update-dependencies`)

### Examples

```bash
# Good
feature/add-leaderboard
fix/exercise-progress-bar
hotfix/auth-token-expiry
refactor/zustand-stores

# Bad
new-feature
my-branch
test123
```

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons, etc. |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |
| `ci` | CI/CD changes |

### Examples

```bash
# Good
feat(voice): add speech-to-text transcription
fix(auth): resolve token refresh loop
refactor(stores): migrate to Zustand 5 patterns
docs(readme): update installation instructions

# Bad
fixed stuff
WIP
updates
```

## Pull Request Process

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature
   ```

2. **Make your changes** following code standards

3. **Commit your changes** using conventional commits

4. **Push to your branch**:
   ```bash
   git push -u origin feature/my-feature
   ```

5. **Open a Pull Request** to `develop`

6. **Fill out the PR template** completely

7. **Request reviews** from maintainers

8. **Address feedback** and update your PR

9. **Merge** once approved and CI passes

## Code Standards

### TypeScript

- Use **const types pattern** for string literals:
  ```typescript
  // ✅ Good
  const STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
  } as const;
  type Status = (typeof STATUS)[keyof typeof STATUS];

  // ❌ Bad
  type Status = "active" | "inactive";
  ```

- Use **flat interfaces** (max 1 level of nesting)
- **Never use `any`** - use `unknown` or generics
- Use `import type` for type-only imports

### React

- Use **named imports** from React
- Use **ref as prop** (React 19 pattern, no forwardRef)
- Separate **container** and **presentational** components
- Extract business logic to **custom hooks**

### Zustand

- Use **persist middleware** for user data
- Use **immer middleware** for complex state
- Use **useShallow** for object selectors
- Create **selectors** for computed values

### Before Submitting

```bash
npm run lint    # Must pass
npm run build   # Must pass
```

---

Thank you for contributing! 🚀
