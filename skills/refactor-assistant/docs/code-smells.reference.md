# Code Smells Quick Reference

## Method Level
| Smell | Threshold | Refactoring |
|-------|-----------|-------------|
| Long Method | >40 lines | Extract Method |
| Long Parameter List | >3 params | Introduce Parameter Object |
| Deep Nesting | >3 levels | Guard Clauses, Early Return |
| Duplicate Code | 2+ occurrences | Extract Method / Module |

## Class Level
| Smell | Signal | Refactoring |
|-------|--------|-------------|
| God Class | >300 lines, many responsibilities | Extract Class |
| Feature Envy | Method uses another class's data more than its own | Move Method |
| Data Clumps | Same group of fields appears together repeatedly | Extract Class / Value Object |
| Primitive Obsession | Strings/numbers used where domain types fit | Introduce Value Object |

## Architecture Level
| Smell | Signal | Refactoring |
|-------|--------|-------------|
| Circular Dependencies | A depends on B, B depends on A | Dependency Inversion |
| Shotgun Surgery | One change requires editing many files | Move Method, Inline Class |
| Divergent Change | One class changes for multiple unrelated reasons | Extract Class (SRP) |
