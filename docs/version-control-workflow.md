## Branching Strategy
- **Feature Branches**: Each new feature is developed in its own branch
  - Format: `feature/description-of-feature`
  - Example: `feature/user-authentication`
    Features are squash-merged into dev branch to ensure a linear history
    Merge commits are used to merge into main.
- **Bug Fix Branches**: Dedicated branches for bug fixes
  - Format: `description-of-fix`
- **Main Branches**:
  - `main`: Production-ready code
  - `dev`: Integration branch for features
  
## Development Process
1. **Feature Development**:
   - Create feature branch from `dev`
   - Develop and test locally
   - Push changes for review

2. **Code Review**:
   - Pull request template with checklist
   - Minimum 1 team member approvals required
   - Automated checks must pass:
     - ESLint validation
     - TypeScript compilation
     - Build verification

3. **Preview Deployments**:
   - Automatic Vercel preview deployments for each PR
   - Team members can test changes in staging environment
   - Feedback collected through PR comments

4. **Merge Process**:
   - Squash and merge to `dev`
   - Automated deployment to staging
   - Final testing before production release

5. **Pre-commit Checks**:
   - **Code Formatting**: Prettier automatically formats code
   - **Linting**: ESLint checks for code style and potential errors
   - **Type Checking**: TypeScript validates type safety
   - **Commit Message Hook**: Enforces conventional commit format
   These hooks run automatically when you try to commit, preventing:
   - Inconsistent code formatting
   - Type errors
   - Linting violations
   - Invalid commit messages

### Commit Conventions
[Github Commit Conventions](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)
We follow conventional commits format enforced by a pre-commit hook:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/modifications
- `chore:` Maintenance tasks

#### Quality Assurance
- Automated CI/CD pipeline with Vercel
- Regular code reviews and pair programming sessions

For detailed workflow documentation, see our [Version Control Guide](docs/version-control.md).
