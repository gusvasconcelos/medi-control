---
name: planning
description: Project planning and architecture decision-making workflow. Use when starting new projects, designing systems, choosing technologies, or making architectural decisions. Emphasizes simplicity, type-safety, and avoiding over-engineering while ensuring observability and maintainability.
---

# Planning Guidelines

Workflow for project planning, architecture decisions, and technical design.

## When to Use
- Starting new projects
- Choosing technologies/frameworks
- Designing system architecture
- Planning refactoring efforts
- Making technical decisions
- Evaluating trade-offs

## Planning Process

### 1. Understand Requirements
Ask:
- What problem are we solving?
- Who are the users?
- What are the constraints? (time, performance, scale)
- What are the non-negotiables?

### 2. Define Success Criteria
Establish:
- Measurable outcomes
- Performance targets
- Quality standards
- Timeline constraints

### 3. Choose Technologies

#### Decision Framework
Evaluate based on:
1. **Type-safety**: Does it support e2e type-safety?
2. **Developer experience**: How easy to use and maintain?
3. **Ecosystem**: Libraries, tools, community support?
4. **Performance**: Meets requirements?
5. **Team knowledge**: Learning curve vs timeline?

#### Prefer Technologies That Support
- e2e type-safety
- Built-in observability/monitoring
- Active maintenance
- Strong PHP support
- Testing capabilities

### 4. Design Architecture

#### Core Principles
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)
- Avoid premature optimization
- No over-engineering

#### Architecture Checklist
- [ ] e2e type-safety (API → Database)
- [ ] Error monitoring/observability
- [ ] Automated testing strategy
- [ ] Accessibility (a11y, WCAG 2.0)
- [ ] Security (OWASP best practices)
- [ ] Scalability path (if needed)

#### Common Patterns

**Backend (PHP 8.2/Laravel 12)**
- Eloquent models for database queries
- Type-safe API layer (Laravel API Resources)
- Error monitoring (Discord logging integration)
- Validation library (Laravel Validation)

**Database**
- Choose based on data model:
  - Relational: PostgreSQL
- Prioritize type-safe query builders

### 5. Plan Structure

Principles:
- Co-locate related files
- No premature abstraction
- Single-file folders should be files

#### Naming Strategy
Plan for:
- Descriptive, specific names
- Consistent conventions (`PascalCase` for classes, `camelCase` for functions, `SNAKE_CASE` for constants)
- No abbreviations

#### Testing Rules
- Test behavior, not implementation
- Write tests for bugs before fixing
- Use descriptive test names (3rd person verbs)

### 7. Plan Observability

#### Monitoring Requirements
- [ ] Error tracking (Discord logging integration)

### 8. Security Planning

#### OWASP Checklist
- [ ] Input validation
- [ ] SQL injection prevention (query builders)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication/authorization
- [ ] Secure dependencies
- [ ] Environment variables handling

## Decision Making

### Technology Choices

#### When to Choose
**Simple projects**:
- Stick to basics
- Proven technologies
- Minimal dependencies

**Complex projects**:
- Invest in type-safety
- Strong tooling
- Robust ecosystem

#### Red Flags
- No PHP support
- Poor documentation
- Inactive maintenance
- Complex API for simple tasks
- Requires many packages

### Avoid Over-Engineering

#### Signs of Over-Engineering
- Abstractions used once
- Frameworks for simple tasks
- Premature optimization
- Complex patterns for simple problems
- "Future-proofing" without requirements

#### Keep It Simple
- Start minimal, add as needed
- One abstraction layer at a time
- Refactor when patterns emerge (2-3 uses)
- Concrete before abstract

## Planning Document Template

Structure technical plans as:

### Project: [Name]

#### Goal
[One paragraph: what and why]

#### Success Criteria
- [Measurable outcome 1]
- [Measurable outcome 2]

#### Technology Stack
- Frontend: [Choice + justification]
- Backend: [Choice + justification]
- Database: [Choice + justification]
- Hosting: [Choice + justification]

#### Architecture
[High-level diagram or description]

Key decisions:
- [Decision 1]: [Rationale]
- [Decision 2]: [Rationale]

#### File Structure
```
[Proposed structure]
```

#### Testing Strategy
- Unit: [Scope]
- Integration: [Scope]
- E2E: [Scope]

#### Observability
- Error tracking: [Tool]
- Monitoring: [Tool]
- Logging: [Strategy]

#### Security
- [Key consideration 1]
- [Key consideration 2]

#### Accessibility
- [Key consideration 1]
- [Key consideration 2]

#### Timeline
- Phase 1: [Scope + duration]
- Phase 2: [Scope + duration]

#### Risks
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

## Review Before Starting

- [ ] Requirements clearly defined
- [ ] Success criteria measurable
- [ ] Technology choices justified
- [ ] Architecture supports requirements
- [ ] Type-safety end-to-end
- [ ] Testing strategy defined
- [ ] Observability planned
- [ ] Security considered
- [ ] Accessibility addressed
- [ ] Timeline realistic
- [ ] No over-engineering
- [ ] KISS and YAGNI applied
