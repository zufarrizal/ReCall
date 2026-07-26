# Graph Report - ReCall  (2026-07-26)

## Corpus Check
- 35 files · ~14,309 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 319 nodes · 392 edges · 27 communities (21 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ba4f20c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- App
- compilerOptions
- runtime/package.json
- SQLiteRepository
- frontend/package.json
- wails.json
- runtime.d.ts
- Scheduler
- models.ts
- EventsOn
- Agenda
- TestAgendaValidate
- ReCall
- ReCall
- Changelog
- AGENTS.md
- ReCall v0.1.1
- ReCall v0.1.2
- alarm_sound_windows.go
- models.ts
- App.js
- calendar-layout.ts
- TestColorCategoryValidate

## God Nodes (most connected - your core abstractions)
1. `App` - 20 edges
2. `compilerOptions` - 16 edges
3. `SQLiteRepository` - 15 edges
4. `Scheduler` - 9 edges
5. `Open()` - 8 edges
6. `ReCall` - 8 edges
7. `renderCalendar()` - 7 edges
8. `Changelog` - 7 edges
9. `load()` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App` --references--> `SQLiteRepository`  [EXTRACTED]
  app.go → internal/repository/sqlite.go
- `App` --references--> `Scheduler`  [EXTRACTED]
  app.go → internal/service/scheduler.go
- `TestBeforeCloseAllowsExplicitQuit()` --calls--> `NewApp()`  [INFERRED]
  app_test.go → app.go
- `main()` --calls--> `NewApp()`  [INFERRED]
  main.go → app.go
- `layoutOverlappingAgendas()` --indirect_call--> `agenda()`  [INFERRED]
  frontend/src/calendar-layout.ts → frontend/tests/calendar-layout.test.ts

## Import Cycles
- None detected.

## Communities (27 total, 6 thin omitted)

### Community 1 - "main.ts"
Cohesion: 0.10
Nodes (31): ColorCategoryView, colorEditorRows(), colorLegend(), colorOptions(), escapeHtml(), addDays(), Agenda, blocks() (+23 more)

### Community 2 - "App"
Cohesion: 0.12
Nodes (9): Agenda, ColorCategory, Context, NewApp(), T, TestBeforeCloseAllowsExplicitQuit(), Bool, main() (+1 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, esModuleInterop, isolatedModules, lib, module, moduleResolution, noEmit, noImplicitReturns (+12 more)

### Community 4 - "runtime/package.json"
Cohesion: 0.11
Nodes (18): author, bugs, url, description, homepage, keywords, license, main (+10 more)

### Community 5 - "SQLiteRepository"
Cohesion: 0.19
Nodes (11): DB, Agenda, ColorCategory, Context, Open(), T, TestSQLiteColorCategoriesCanBeRenamed(), TestSQLiteColorCategoryNamePersistsAfterReopen() (+3 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.13
Nodes (14): devDependencies, typescript, vite, name, private, scripts, build, dev (+6 more)

### Community 7 - "wails.json"
Cohesion: 0.17
Nodes (11): author, email, name, frontend:build, frontend:dev:serverUrl, frontend:dev:watcher, frontend:install, name (+3 more)

### Community 8 - "runtime.d.ts"
Cohesion: 0.25
Nodes (7): EnvironmentInfo, NotificationAction, NotificationCategory, NotificationOptions, Position, Screen, Size

### Community 9 - "Scheduler"
Cohesion: 0.39
Nodes (4): Agenda, NewScheduler(), Once, Scheduler

### Community 11 - "EventsOn"
Cohesion: 0.67
Nodes (3): EventsOn(), EventsOnce(), EventsOnMultiple()

### Community 12 - "Agenda"
Cohesion: 0.29
Nodes (3): NormalizeColorKey(), Agenda, ColorCategory

### Community 13 - "TestAgendaValidate"
Cohesion: 0.67
Nodes (3): T, TestAgendaRejectsUnsafeColorKey(), TestAgendaValidate()

### Community 16 - "ReCall"
Cohesion: 0.22
Nodes (8): Build portable Windows, Fitur, Menjalankan untuk pengembangan, Pengujian, Perilaku background, Peta kode Graphify, ReCall, Teknologi dan arsitektur

### Community 17 - "Changelog"
Cohesion: 0.12
Nodes (15): [0.1.0] - 2026-07-26, [0.1.1] - 2026-07-26, [0.1.2] - 2026-07-26, [0.1.3] - 2026-07-26, [0.1.4] - 2026-07-26, Added, Added, Added (+7 more)

### Community 19 - "ReCall v0.1.1"
Cohesion: 0.40
Nodes (4): Fitur, Perbaikan, ReCall v0.1.1, Unduhan

### Community 20 - "ReCall v0.1.2"
Cohesion: 0.50
Nodes (3): Pengembangan, Perbaikan, ReCall v0.1.2

### Community 23 - "models.ts"
Cohesion: 0.25
Nodes (3): Agenda, ColorCategory, model

### Community 25 - "calendar-layout.ts"
Cohesion: 0.38
Nodes (5): CalendarInterval, layoutOverlappingAgendas(), PositionedAgenda, TimedAgenda, agenda()

## Knowledge Gaps
- **91 isolated node(s):** `name`, `private`, `type`, `version`, `dev` (+86 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `App` connect `App` to `Scheduler`, `SQLiteRepository`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `SQLiteRepository` connect `SQLiteRepository` to `Scheduler`, `App`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Scheduler` connect `Scheduler` to `App`, `SQLiteRepository`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Open()` (e.g. with `TestSQLiteColorCategoriesCanBeRenamed()` and `TestSQLiteColorCategoryNamePersistsAfterReopen()`) actually correct?**
  _`Open()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `runtime.js` be split into smaller, more focused modules?**
  _Cohesion score 0.03076923076923077 - nodes in this community are weakly interconnected._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0975609756097561 - nodes in this community are weakly interconnected._