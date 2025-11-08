---
description: Comprehensive code review focusing on clarity, observability, security, accessibility, and performance per CLAUDE.md guidelines
allowed-tools: Bash(git:*)
---

# Code Review Analysis

Review current changes for clarity, observability, security, accessibility, and performance.

## Review Process:

1. **Change Overview**

    - Analyze git diff to understand scope of modifications
    - Identify files modified, added, or deleted
    - Review commit history and messages

2. **Clarity Review** (Primary Focus)

    - **Naming**: Check for descriptive names that say what they mean
    - **Anti-patterns**: Flag ambiguous terms (`data`, `info`, `stuff`, `manager`, `helper`)
    - **Specificity**: Ensure concrete names (`retryAfterMs` > `timeout`, `emailValidator` > `validator`)
    - **Brevity**: Remove redundant naming (`UserList` → `Users`)
    - **Consistency**: Verify naming follows conventions (camelCase functions, kebab-case files, SNAKE_CAPS constants)

3. ** PHP Standards **

    - **Type Safety**: Always specify parameters and return values ​​of functions and methods
    - **Control Flow**: Early returns over if-else chains

4. **Observability Review**

    - **Monitoring**: HighOrderFunctions for error handling/profiling
    - **Logging**: Meaningful logging without exposing secrets
    - **Error Handling**: Comprehensive error coverage with clear messages

5. **Security Review** (OWASP Focus)

    - **Input Validation**: Proper sanitization and validation
    - **SQL Injection**: Query builders instead of raw SQL strings
    - **Secret Exposure**: No hardcoded credentials or keys
    - **Authentication/Authorization**: Proper access control implementation

6. **Performance Review**

    - **Algorithm Efficiency**: Avoid O(n²) when possible
    - **Memory Management**: Proper resource cleanup
    - **Bundle Size**: Avoid unnecessary dependencies
    - **Database**: Efficient queries and indexing
    - **Premature Optimization**: Flag over-optimization

7. **Testing Quality**

    - **Behavior Testing**: Tests behavior, not implementation
    - **Test Structure**: Proper describe clause organization
    - **Assertions**: Use 3rd person verbs (not "should")
    - **Bug Coverage**: Tests for each bug fix

8. **Code Quality Standards**
    - **Comments**: Flag unnecessary comments (98% should be functions/variables)
    - **Functions**: Single responsibility, clear purpose
    - **Duplication**: Identify repeated code patterns
    - **Complexity**: Flag overly complex functions

## Output Format:

### Summary

-   [Brief overview of changes and scope]

### Critical Issues (Must Fix)

-   [Security vulnerabilities]
-   [Accessibility violations]
-   [Type safety issues]

### Major Issues (Should Fix)

-   [Performance concerns]
-   [Naming clarity problems]
-   [Architecture violations]

### Minor Issues (Consider)

-   [Style inconsistencies]
-   [Optimization opportunities]

### Recommendations

-   [Specific actionable improvements]
-   [Pattern suggestions]

### Approval Status

-   ✅ Approved | ⚠️ Approved with minor changes | ❌ Requires changes
