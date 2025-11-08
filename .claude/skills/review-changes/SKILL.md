---
name: review-changes
description: Systematic code review workflow for evaluating changes against coding standards. Use when reviewing pull requests, commits, diffs, or code changes. Ensures type-safety, maintainability, readability, and adherence to best practices before code is merged.
---

# Review Changes

Systematic workflow for reviewing code changes against established standards.

## When to Use
- Reviewing pull requests
- Evaluating commits or diffs
- Pre-merge code validation
- Refactoring assessment
- Architecture review

## Review Process

### 1. Understand the Change
Read the changes completely before commenting:
- What problem does this solve?
- What is the scope of impact?
- Are tests included?

### 2. Type Safety Review
Check for:
- All functions and methods have type declarations

### 3. Code Organization
Verify:
- All files are named using the appropriate naming convention
- Code proximity to usage (not prematurely abstracted)
- Single-file folders are flattened
- Proper file naming (PascalCase for classes, camelCase for functions, SNAKE_CASE for constants)

### 4. Naming & Clarity
Evaluate:
- Descriptive names (no abbreviations)
- Specific over vague
- No redundant terms

### 5. Control Flow
Verify:
- Early returns (no if-else chains)

### 6. Testing
Check for:
- Tests exist for new functionality

### 7. Best Practices
Confirm:
- No premature optimization
- No over-engineering (KISS, YAGNI)
- No useless abstractions
- Comments converted to code
- Error monitoring/observability considered
- Accessibility (a11y) addressed
- Security (OWASP) followed

### 8. Git Hygiene
Check:
- Commit messages don't include "Claude Code"
- Clear, descriptive commit messages
- Logical commit organization

## Review Output Format

Structure feedback as:

### Required Changes (Blocking)
Critical issues that must be fixed:
- Type safety violations
- Security issues
- Breaking changes without migration path

### Suggested Improvements (Non-blocking)
Recommendations for better code:
- Naming improvements
- Structural optimizations
- Readability enhancements

### Positive Feedback
Highlight good practices:
- Excellent type safety
- Clear naming
- Good test coverage

## Example Review Comments

Good:
```
❌ Line 45: Missing type declaration for function `getUserData`.
Suggestion: Define proper type for user data.
```

```
💡 Line 67: Consider using early return here to reduce nesting.
```

```
✅ Excellent use of type-safety!
```

## Priority Levels

1. **Critical** - Blocks merge: security, type-safety violations, breaking changes
2. **High** - Should fix before merge: maintainability issues, significant readability problems
3. **Medium** - Nice to have: naming improvements, minor refactoring
4. **Low** - Optional: style preferences, subjective improvements

## Review Checklist

Quick validation before approval:

- [ ] All functions and methods have type declarations
- [ ] All files are named using the appropriate naming convention
- [ ] Code proximity to usage (not prematurely abstracted)
- [ ] Single-file folders are flattened
- [ ] Proper file naming (PascalCase for classes, camelCase for functions, SNAKE_CASE for constants)
- [ ] Descriptive names (no abbreviations)
- [ ] Specific over vague
- [ ] No redundant terms
- [ ] Early returns implemented
- [ ] Tests included for new features/fixes
- [ ] PHP best practices followed
- [ ] Git commits are clean
- [ ] Clear, descriptive commit messages
- [ ] Logical commit organization
