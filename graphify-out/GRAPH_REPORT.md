# Graph Report - ReCall  (2026-07-26)

## Corpus Check
- 24 files · ~11,207 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 247 nodes · 292 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `31ae6e35`
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

## God Nodes (most connected - your core abstractions)
1. `App` - 17 edges
2. `compilerOptions` - 16 edges
3. `SQLiteRepository` - 13 edges
4. `Scheduler` - 9 edges
5. `ReCall` - 8 edges
6. `renderCalendar()` - 7 edges
7. `load()` - 6 edges
8. `Open()` - 6 edges
9. `key()` - 5 edges
10. `renderMonth()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App` --references--> `SQLiteRepository`  [EXTRACTED]
  app.go → internal/repository/sqlite.go
- `App` --references--> `Scheduler`  [EXTRACTED]
  app.go → internal/service/scheduler.go
- `TestBeforeCloseAllowsExplicitQuit()` --calls--> `NewApp()`  [INFERRED]
  app_test.go → app.go
- `main()` --calls--> `NewApp()`  [INFERRED]
  main.go → app.go
- `NewScheduler()` --references--> `SQLiteRepository`  [EXTRACTED]
  internal/service/scheduler.go → internal/repository/sqlite.go

## Import Cycles
- None detected.

## Communities (19 total, 5 thin omitted)

### Community 1 - "main.ts"
Cohesion: 0.14
Nodes (19): addDays(), Agenda, blocks(), esc(), fmt(), iso(), key(), load() (+11 more)

### Community 2 - "App"
Cohesion: 0.14
Nodes (8): Agenda, Context, NewApp(), T, TestBeforeCloseAllowsExplicitQuit(), Bool, main(), App

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, esModuleInterop, isolatedModules, lib, module, moduleResolution, noEmit, noImplicitReturns (+12 more)

### Community 4 - "runtime/package.json"
Cohesion: 0.11
Nodes (18): author, bugs, url, description, homepage, keywords, license, main (+10 more)

### Community 5 - "SQLiteRepository"
Cohesion: 0.21
Nodes (8): DB, Agenda, Context, Open(), T, TestSQLiteCRUDAndDue(), SQLiteRepository, Time

### Community 6 - "frontend/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, typescript, vite, name, private, scripts, build, dev (+4 more)

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

### Community 16 - "ReCall"
Cohesion: 0.22
Nodes (8): Build portable Windows, Fitur, Menjalankan untuk pengembangan, Pengujian, Perilaku background, Peta kode Graphify, ReCall, Teknologi dan arsitektur

### Community 17 - "Changelog"
Cohesion: 0.25
Nodes (7): [0.1.0] - 2026-07-26, [0.1.1] - 2026-07-26, Added, Added, Changelog, Fixed, [Unreleased]

## Knowledge Gaps
- **71 isolated node(s):** `graphify`, `Added`, `Fixed`, `Added`, `Fitur` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `App` connect `App` to `Scheduler`, `SQLiteRepository`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `SQLiteRepository` connect `SQLiteRepository` to `Scheduler`, `App`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Scheduler` connect `Scheduler` to `App`, `SQLiteRepository`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `graphify`, `Added`, `Fixed` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `runtime.js` be split into smaller, more focused modules?**
  _Cohesion score 0.03076923076923077 - nodes in this community are weakly interconnected._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14461538461538462 - nodes in this community are weakly interconnected._
- **Should `App` be split into smaller, more focused modules?**
  _Cohesion score 0.13852813852813853 - nodes in this community are weakly interconnected._