# Changelog

Semua perubahan penting ReCall dicatat di file ini.

## [0.1.2] - 2026-07-26

### Added

- Knowledge graph Graphify dan aturan query-first untuk navigasi codebase yang lebih efisien.

### Fixed

- Alarm kini memutar pola suara native Windows sebagai fallback ketika audio toast dinonaktifkan.

## [0.1.1] - 2026-07-26

### Fixed

- Menu **Keluar** pada system tray kini benar-benar menghentikan aplikasi dan tidak lagi dicegat oleh handler tutup-ke-tray.
- Area waktu kalender kini dapat digulir vertikal untuk melihat seluruh jam dan horizontal pada layar sempit.

## [0.1.0] - 2026-07-26

### Added

- Kalender agenda harian dengan pilihan tampilan 1, 3, dan 7 hari.
- CRUD agenda, pilihan warna, validasi input, modal konfirmasi, dan toast status.
- Database SQLite lokal dengan migrasi awal dan index waktu.
- Scheduler alarm background, toast Windows, bunyi, dialog aplikasi, serta system tray.
- Unit test untuk validasi model dan alur repository SQLite.
- Dokumentasi pengembangan, pengujian, lokasi data, dan build portable Windows.
