# Changelog

Semua perubahan penting ReCall dicatat di file ini.

## [0.2.0] - 2026-07-26

### Added

- Agenda yang waktunya bertumpuk pada hari yang sama kini ditampilkan berdampingan dan tetap dapat dibuka satu per satu.
- Pilihan warna agenda diperluas menjadi sepuluh kategori.
- Nama setiap kategori warna kini dapat diubah melalui modal dan disimpan permanen di SQLite.

### Changed

- Pilihan warna pada formulir dan legenda kalender kini dibaca dari database, bukan nama yang ditulis langsung di frontend.

### Fixed

- Metadata versi pada executable Windows kini mengikuti versi rilis dari konfigurasi `info.productVersion` Wails.

## [0.1.4] - 2026-07-26

### Fixed

- Area kolom kanan kalender Minggu tidak lagi menjadi gelap saat digeser horizontal pada jendela yang tidak dimaksimalkan.
- Lebar badan kalender Minggu kini mencakup seluruh tujuh kolom sehingga latar dan garis grid tetap konsisten sampai kolom terakhir.

## [0.1.3] - 2026-07-26

### Fixed

- Header hari dan badan grid pada tampilan minggu kini tetap sejajar saat kalender digeser horizontal.

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
