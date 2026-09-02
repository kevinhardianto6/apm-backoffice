# 04 — Frontend (Website Backoffice)

**PRD APM Kit** · Untuk tim Frontend

> Konteks proyek: `00-Overview.md`
> Read API & bentuk data: `01-Kontrak-Data-API.md` §10 — **jangan disalin ke sini, referensikan saja**

---

## 1. Yang Dibangun Tim Ini

Website internal tempat engineer menganalisis data yang dikumpulkan SDK. Diakses dari jaringan internal / VPN, bukan dari internet publik.

### Prinsip produk: berorientasi Issue, bukan event

Engineer datang ke dashboard membawa pertanyaan **"apa yang paling parah, dan siapa yang kena"** — bukan untuk membaca log baris per baris.

Backend sudah mengelompokkan event menjadi **Issue** lewat fingerprinting (`01` §6). Satu Issue bisa mewakili puluhan ribu event dari satu bug yang sama. Tampilan utama adalah daftar Issue yang terurut berdasarkan dampak; event mentah hanya muncul sebagai sampel di dalam detail Issue.

> Kalau UI menampilkan event mentah sebagai tampilan utama, dashboard akan menjadi ribuan baris nyaris identik dan praktis tidak terpakai — ini kesalahan paling umum pada tool monitoring buatan sendiri.

---

## 2. Ketergantungan Lintas Tim

| Yang tim ini **butuhkan** | Dari | Kapan |
|---|---|---|
| Read API sesuai `01` §10 | Backend | M4 |
| Agregasi pra-hitung (crash-free rate, persentil latency) — BE-16 | Backend | M4 |
| Aturan fingerprinting yang stabil & berversi | Backend | M4 |
| Daftar nilai enum `failure_category` (`01` §5) | Backend / kontrak | M4 |
| Endpoint resolve + user lookup (BE-23), filter `integrity` + exclude sesi non-real (BE-24) | Backend | M4 |
| Integrasi SSO + model peran | Backend | M4 |
| Status symbolication per build | Backend | M4 |

| Yang tim lain **butuhkan** dari tim ini | Untuk | Kapan |
|---|---|---|
| Umpan balik kebutuhan query & bentuk data | Backend — desain Read API | M4 |
| Tampilan peringatan integrasi (sesi tanpa `user_id`, symbol belum diupload) | Mobile & Backend — jalur umpan balik ke developer | M4 |

> **Catatan urutan kerja:** seluruh pekerjaan Frontend berada di Fase 3. Namun keterlibatan sejak M0 tetap diperlukan untuk mereview bentuk Read API — desain API yang dibuat tanpa masukan Frontend hampir selalu perlu dirombak setelah UI mulai dibangun.

---

## 3. Requirement Fungsional

### 3.1 Overview

| ID | Requirement | Prio |
|---|---|---|
| FE-01 | Halaman overview: crash-free session rate, error rate, network failure rate, tren vs periode sebelumnya | P0 |
| FE-02 | Pemilih app — hanya menampilkan app yang boleh diakses user | P0 |

### 3.2 Issue Explorer

| ID | Requirement | Prio |
|---|---|---|
| FE-03 | Daftar issue: judul, jumlah kejadian, jumlah user terdampak, pertama & terakhir terlihat | P0 |
| FE-04 | Filter: versi app, OS, platform, kategori, rentang waktu, status | P0 |
| FE-05 | Sort: paling sering, paling banyak user terdampak, paling baru | P0 |
| FE-06 | Detail issue: stack trace tersimbolikasi, dengan **penanda visual untuk frame milik app sendiri** | P0 |
| FE-06b | Untuk issue bertipe `error`: tampilkan asal pemanggilan (`source_file` · `source_function` · `source_line`, `01` §4.4) sebagai lokasi yang bisa langsung dituju engineer. Ini pengganti stack trace untuk error manual, yang memang tidak punya frame. | P0 |
| FE-06c | Tampilkan issue bertipe `termination` (`01` §4.7) dengan jelas **terpisah dari crash** — mis. badge berbeda dan penjelasan singkat bahwa ini proses dihentikan OS karena tekanan sumber daya (`termination_reason`), bukan crash aplikasi. Jangan gabungkan ke metrik crash. | P0 |
| FE-07 | Timeline breadcrumb pada detail issue — tampilan "kotak hitam" | P0 |
| FE-08 | Breakdown per device, versi OS, versi app pada detail issue | P0 |
| FE-09 | Status issue: new / triaged / resolved / ignored | P0 |
| FE-18 | Salin detail issue sebagai teks/markdown untuk ditempel ke tiket | P1 |

> **FE-06 — kenapa penanda frame penting:** stack trace crash sebagian besar berisi frame dari framework sistem yang tidak bisa diapa-apakan. Frame milik aplikasi sendiri biasanya hanya 2–3 baris dan itulah satu-satunya yang bisa ditindaklanjuti. Tanpa penanda visual, engineer harus memindai manual setiap kali.

> **FE-06b — kenapa asal pemanggilan penting.** Error manual (`logError`) tidak punya stack trace. Tanpa `source_file`/`source_function`, pesan seperti "Produk tidak tersedia" muncul berulang tanpa ada cara mengetahui dari mana asalnya — persis yang terjadi pada data pilot pertama. Ketiganya terisi otomatis oleh SDK, jadi selalu tersedia.

> **FE-06c — kenapa `termination` tidak boleh terlihat seperti crash.** Proses yang dihentikan OS (kehabisan memori, thermal) tidak punya stack trace dan tidak disebabkan kode aplikasi. Menampilkannya bercampur dengan crash membuat engineer mencari bug yang tidak ada, dan mencemari crash-free rate. Tetapi ini tetap sinyal kualitas yang nyata — OOM kill berarti aplikasi memakai memori terlalu banyak — jadi ditampilkan, hanya dengan bingkai yang benar.

> **FE-07 — kenapa breadcrumb jadi fitur utama, bukan pelengkap:** stack trace menjawab *di mana* aplikasi berhenti; breadcrumb menjawab *apa yang terjadi sebelumnya*. Untuk bug yang sulit direproduksi — misalnya crash yang hanya terjadi setelah koneksi berpindah wifi ke seluler — timeline inilah satu-satunya petunjuk. Tampilkan sebagai urutan kronologis dengan penanda waktu relatif terhadap crash.

### 3.3 Network Explorer

| ID | Requirement | Prio |
|---|---|---|
| FE-10 | Agregasi per host: persentil latency (p50/p95/p99), rasio kegagalan | P0 |
| FE-11 | Drill-down kegagalan per `failure_category`, dengan **tampilan khusus untuk kegagalan SSL/pinning** | P0 |

> **FE-11** menjawab langsung insiden yang melatarbelakangi proyek ini. Untuk kategori `ssl_certificate` dan `ssl_pinning_rejected`, tampilkan: host terdampak, jumlah user, sebaran versi app & OS, dan kapan pertama kali muncul. Pola khas kegagalan pinning adalah lonjakan tajam pada satu host di seluruh versi app sekaligus — bentuk grafiknya sendiri sudah menjadi diagnosis.

### 3.4 Rilis & Alert

| ID | Requirement | Prio |
|---|---|---|
| FE-12 | Perbandingan rilis: metrik kesehatan versi N vs N-1 | P1 |
| FE-13 | Konfigurasi alert: threshold, kondisi, kanal notifikasi | P1 |

### 3.5 Administrasi

| ID | Requirement | Prio |
|---|---|---|
| FE-14 | Halaman admin: registry app, penerbitan & rotasi kunci, manajemen anggota | P0 |
| FE-15 | RBAC: peran viewer / member / admin, di-scope **per app** | P0 |
| FE-16 | Login via SSO perusahaan | P0 |

> **FE-15** berpasangan dengan SEC-17 di sisi Backend. UI menyembunyikan app yang tidak boleh diakses, tapi penegakan sesungguhnya ada di query layer backend. **UI bukan lapisan keamanan** — ia hanya mencegah kebingungan, bukan penyalahgunaan.

### 3.6 Kualitas Tampilan

| ID | Requirement | Prio |
|---|---|---|
| FE-17 | Menampilkan status symbolication; **peringatan jelas jika symbol untuk suatu build belum diupload** | P0 |
| FE-19 | Empty state informatif: belum ada data, integrasi belum selesai, filter terlalu sempit | P1 |
| FE-20 | Tampilan responsif untuk layar laptop; mobile tidak diprioritaskan | P2 |

> **FE-17 mencegah kesalahpahaman yang mahal.** Crash tanpa symbol tampil sebagai daftar alamat memori. Tanpa peringatan eksplisit, engineer akan mengira sistemnya rusak, padahal masalahnya ada di pipeline CI yang gagal mengunggah symbol. Peringatannya harus menyebutkan build mana yang bermasalah dan apa tindakan yang perlu dilakukan.

> **Kondisi saat ini (pra-symbolication).** Symbolication service belum ada (BE-10/11, Fase 3), jadi **semua** crash saat ini belum tersimbolikasi dan `fingerprint` crash sementara memakai (nama + reason yang dinormalisasi), bukan frame teratas seperti yang diminta `01` §6. Dua konsekuensi untuk Frontend:
>
> 1. UI harus **luwes menghadapi ketiadaan frame** — tampilkan apa yang ada, jangan rusak, dan munculkan catatan FE-17 bahwa symbolication tertunda.
> 2. **Pengelompokan crash akan berubah** ketika symbolication masuk. Itu diharapkan, bukan regresi — jangan merancang UI yang mengasumsikan issue ID crash bersifat permanen.

### 3.7 User Lookup & Integritas Sesi

| ID | Requirement | Prio |
|---|---|---|
| FE-21 | Layar **User Lookup**: cari user by `user_ref`, **atau** by identifier mentah (nomor telepon/email) yang di-resolve lewat `POST .../users/resolve` (`01` §10, BE-23). Tampilkan ringkasan user + timeline sesi (outcome per sesi + breadcrumb). Badge **"no PII stored"** eksplisit di layar. | P0 |
| FE-22 | Filter & segmentasi berdasarkan flag `integrity` (emulator/root/dev-mode) di Overview, Issue, dan Network; plus toggle **"exclude sesi non-real"** (emulator/debug) dari metrik headline (crash-free rate dll.). | P1 |
| FE-23 | Tampilkan flag `integrity` di tempat relevan: kartu **"Environment"** pada detail issue (mis. "Emulator 2% · Rooted 5% · Dev mode 8%" dari user terdampak) dan chip di ringkasan User Lookup. | P1 |

> **FE-21 — cari via nomor HP tanpa menyimpan nomornya.** Search menerima identifier mentah, tapi resolusi ke `user_ref` terjadi di server (hash dengan `server_key`, BE-23); nilai mentah tidak disimpan dan tidak pernah muncul di storage. Inilah yang membuat badge "no PII stored" tetap jujur meski support bisa mencari berdasarkan nomor HP.

> **FE-22 — kenapa exclude sesi non-real penting.** Crash yang hanya terjadi di emulator QA atau device developer bukan masalah user asli. Tanpa opsi ini, angka crash-free tercemar sesi non-produksi. Dengan toggle, tim dapat angka bersih untuk user sungguhan — sekaligus bisa menyorot crash yang justru terkonsentrasi di device root/emulator (mungkin bukan bug aplikasi).

### 3.8 Peringatan Integrasi

Beberapa masalah hanya bisa dideteksi sistem, tapi hanya bisa diperbaiki developer aplikasi. Website adalah tempat pertemuan keduanya — tampilkan sebagai notifikasi persisten di level app, bukan toast sesaat:

| Kondisi | Pesan yang perlu disampaikan |
|---|---|
| Sebagian besar sesi tanpa `user_id` (app host belum memanggil `setUser`, MOB-28) | App mana, % sesi terdampak, dan bahwa User Lookup jadi terbatas untuk app itu |
| Symbol belum diupload untuk build tertentu (FE-17) | Build mana, berapa crash yang tertunda symbolication |
| SDK melaporkan event terbuang (MOB-27) | Berapa banyak dan penyebabnya (antrean penuh / payload ditolak) |
| Versi SDK sudah usang | Versi terpasang, versi terbaru, dan apa yang berubah |

---

## 4. Catatan Desain

**Kepadatan informasi.** Ini alat kerja, bukan halaman pemasaran. Engineer akan membukanya berkali-kali sehari untuk memindai daftar panjang — utamakan tabel yang padat dan mudah dipindai daripada kartu besar berjarak lebar.

**Waktu selalu relatif dan absolut.** Tampilkan "3 jam lalu" untuk pemindaian cepat, dengan waktu persis muncul saat kursor diarahkan. Timeline breadcrumb memakai selisih waktu terhadap crash (`-4,2 dtk`), bukan jam absolut.

**Angka butuh pembanding.** "1.204 crash" tidak bermakna tanpa konteks. Sandingkan dengan periode sebelumnya, atau nyatakan sebagai rasio terhadap jumlah sesi.

**Status kosong yang jujur.** Bedakan dengan jelas antara "tidak ada masalah" dan "tidak ada data yang masuk". Keduanya menghasilkan tampilan kosong, tetapi artinya berlawanan — dan salah tafsir di sini berarti masalah production tidak tertangani karena dikira aman.

**Tautan yang bisa dibagikan.** Setiap tampilan issue dan hasil filter harus punya URL sendiri, agar bisa ditempel ke tiket atau percakapan tim.

---

## 5. Definition of Done

**M4 — Website v1**
- [ ] Seluruh FE P0 terpenuhi
- [ ] User Lookup: cari by `user_ref` **dan** by identifier mentah (resolve) berfungsi; badge "no PII stored" tampil (FE-21)
- [ ] Filter `integrity` + toggle exclude sesi non-real berfungsi (FE-22); kartu Environment tampil di detail issue (FE-23)
- [ ] Diuji dengan data production nyata dari app pilot, bukan data dummy
- [ ] Waktu muat halaman issue memenuhi p95 < 1 detik pada volume nyata
- [ ] Isolasi tenant diverifikasi bersama Backend: user tim A tidak melihat app tim B
- [ ] Seluruh empty state dan peringatan integrasi (§3.8) terpasang

**M5 — Kesiapan onboarding tim lain**
- [ ] Alur pendaftaran app baru dapat diselesaikan sendiri oleh tim adopter tanpa bantuan
- [ ] Uji kegunaan singkat dengan satu engineer dari tim lain: menemukan penyebab satu bug nyata tanpa dipandu
