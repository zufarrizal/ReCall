# ReCall

ReCall adalah aplikasi desktop Windows berbasis Go + Wails untuk menyusun agenda pada kalender harian dan memberikan alarm secara otomatis. Data tersimpan lokal di SQLite dan aplikasi tetap berjalan melalui system tray ketika jendela ditutup.

## Fitur

- Kalender waktu yang dapat digulir untuk melihat seluruh 24 jam, dengan tampilan 1 hari, 3 hari, atau 1 minggu.
- Beberapa agenda pada waktu yang sama ditata berdampingan agar semuanya tetap terlihat dan dapat dipilih.
- Buat, ubah, dan hapus agenda melalui modal aplikasi.
- Sepuluh pilihan warna agenda dengan nama kategori yang dapat diubah melalui modal **Atur nama**.
- Alarm dengan pola suara native Windows, bunyi toast pengingat, dan dialog pengingat di aplikasi.
- Berjalan di background melalui system tray; menu tray dapat membuka atau keluar dari aplikasi.
- Penyimpanan SQLite lokal, tanpa server dan tanpa akun.
- Validasi judul, waktu, durasi, warna, dan offset alarm.
- Tampilan responsif dengan loading/action state dan toast sukses/error.

## Teknologi dan arsitektur

- Go 1.23+ dan Wails v2.
- TypeScript + Vite untuk View.
- SQLite pure-Go (`modernc.org/sqlite`) untuk Model/repository.
- Pola MVP: `internal/model` dan `internal/repository` menangani data, `app.go` menjadi Presenter/binding Wails, dan `frontend/src` menjadi View.

Database dibuat otomatis di `%APPDATA%\ReCall\recall.db`. SQLite memakai mode WAL, busy timeout, index waktu mulai, dan query terparameterisasi. Nama kategori disimpan pada tabel `color_categories`; migrasi menambahkan pilihan warna baru tanpa menimpa nama yang sudah dipersonalisasi.

## Menjalankan untuk pengembangan

Prasyarat: Go, Node.js/npm, Microsoft Edge WebView2 Runtime, dan Wails CLI.

```powershell
go install github.com/wailsapp/wails/v2/cmd/wails@v2.12.0
wails dev
```

## Pengujian

```powershell
go test ./...
go vet ./...
cd frontend
npm test
npm run build
```

Test mencakup validasi model, keamanan renderer nama kategori, layout agenda yang bertumpuk, serta alur SQLite create, list, pembaruan nama warna, alarm jatuh tempo, penandaan notifikasi, dan delete.

## Peta kode Graphify

Repository menyertakan knowledge graph pada `graphify-out/graph.json`. Gunakan query terarah sebelum membaca source secara luas:

```powershell
graphify query "alur penyimpanan agenda"
graphify explain "SQLiteRepository"
graphify path "App" "Scheduler"
```

Setelah mengubah kode, jalankan `graphify update .` agar mapping tetap sinkron.

## Build portable Windows

```powershell
wails build -clean -platform windows/amd64 -webview2 embed
```

Executable portable dihasilkan sebagai `build/bin/ReCall.exe`. Opsi `embed` menyertakan bootstrapper WebView2 untuk membantu mesin Windows yang belum memiliki runtime tersebut. Data pengguna tetap disimpan di `%APPDATA%\ReCall`.

## Perilaku background

Menutup jendela tidak menghentikan aplikasi; ReCall menyembunyikan jendela dan mempertahankan scheduler alarm. Gunakan menu **Keluar** pada ikon ReCall di system tray untuk menghentikan aplikasi sepenuhnya. Jalur keluar eksplisit ini tidak dicegat oleh perilaku "tutup ke tray".
