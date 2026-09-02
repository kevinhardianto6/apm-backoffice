# APM Kit — Ingestion Pilot

Server penerima data minimal untuk menjalankan pilot SDK, **sebelum** backend
Fase 3 dibangun. Tujuannya satu: memberi SDK tujuan kirim yang nyata, supaya
kita bisa melihat data aslinya dan membawa angka sungguhan ke rapat.

**Ini bukan backend produksi.** Tidak ada auth serius, tidak ada scaling, tidak
ada retensi. Sengaja dibuat sekecil mungkin dan sekali pakai.

---

## Yang perlu di-install

**Tidak ada.** Semua sudah tersedia di Mac yang punya Xcode Command Line Tools:

| Perkakas | Dipakai untuk | Cek |
|---|---|---|
| `python3` | server + pembaca data | `python3 --version` |
| `openssl` | bikin sertifikat | `openssl version` |
| `sqlite3` | (opsional) query manual | `sqlite3 --version` |

Kalau `python3` belum ada: `xcode-select --install`.

---

## Kenapa harus HTTPS

SDK menetapkan TLS 1.2+ pada session-nya sendiri (SEC-10) dan **menolak HTTP
polos** — ini sudah dibuktikan di feat-011. Jadi server pilot pun wajib HTTPS,
dan sertifikatnya harus dipercaya Simulator. Skrip di bawah mengurus itu.

---

## Cara menjalankan

```bash
# 1. Buat sertifikat (sekali saja)
./make-cert.sh
#    kalau nanti diakses dari device fisik, pakai IP Mac kamu:
#    ./make-cert.sh 192.168.1.5

# 2. Percayai sertifikatnya di Simulator (Simulator harus sudah booted)
xcrun simctl keychain booted add-root-cert certs/server.pem

# 3. Jalankan server
python3 ingest.py

# 4. Di terminal lain — pastikan server sehat sebelum menyentuh app
python3 send-test-data.py
python3 stats.py
```

Kalau langkah 4 menampilkan angka, server siap. Baru arahkan SDK ke sana.

---

## Menghubungkan SDK

Di app pilot:

```swift
APM.start(config: .init(
    endpoint: URL(string: "https://localhost:8443/v1/ingest")!,
    apiKey: "pilot-key-ganti-nanti"
))
```

Ganti `localhost` dengan IP Mac kamu bila memakai device fisik.

---

## Read API (untuk Backoffice)

Server ini juga melayani Read API sesuai `docs/01-Kontrak-Data-API.md` §10, supaya
backoffice bisa mulai dibangun di atas data sungguhan.

**Autentikasi terpisah dari jalur ingest (SEC-16).** Kunci app bersifat write-only dan
tertanam di binary, jadi ia tidak memberi akses baca apa pun. Read API memakai token
sendiri:

```bash
APM_READ_TOKEN='token-baca-yang-panjang' python3 ingest.py
```

Kirim lewat header `X-APM-Read-Token`, atau `?token=` saat mencoba di browser.

### Endpoint

| Endpoint | Fungsi |
|---|---|
| `GET /v1/apps` | Daftar app yang punya data |
| `GET /v1/apps/{id}/overview` | Metrik headline + tren vs periode sebelumnya |
| `GET /v1/apps/{id}/issues` | Daftar issue (sudah dikelompokkan §6) |
| `GET /v1/issues/{id}` | Detail issue + breakdown + sample event + breadcrumbs |
| `GET /v1/apps/{id}/network` | Agregasi per host; `&host=…&failure_category=…` untuk drill-down |
| `POST /v1/apps/{id}/users/resolve` | Identifier mentah → `user_ref` (input tidak disimpan) |
| `GET /v1/apps/{id}/users/{user_ref}` | Ringkasan user + timeline sesi |
| `PATCH /v1/issues/{id}` | Ubah status: `new` / `triaged` / `resolved` / `ignored` |

**Parameter umum:** `days` (default 7), `real_users_only` (default `true` — mengecualikan
sesi emulator/dev-mode, BE-24/FE-22), `type`, `status`, `sort` (`impact` / `events` /
`recent`), `limit`.

### Coba cepat

```bash
python3 test-readapi.py          # menguji seluruh endpoint sekaligus

curl -sk -H "X-APM-Read-Token: pilot-read-token-ganti-nanti" \
  "https://localhost:8443/v1/apps/com.company.merchant/overview?days=7" | python3 -m json.tool
```

### CORS

Backoffice saat development berjalan di port lain, jadi origin berikut diizinkan secara
default: `localhost:3000`, `localhost:5173`, `127.0.0.1:3000`. Ubah lewat:

```bash
APM_CORS_ORIGINS='http://localhost:4200' python3 ingest.py
```

### Catatan implementasi yang perlu diketahui Frontend

- **Fingerprint dihitung saat baca**, bukan di-materialize saat ingest. Untuk volume
  pilot hasilnya identik; backend Fase 3 akan menghitungnya saat ingest (BE-09) demi
  performa. Bentuk respons tidak berubah.
- **Fingerprint `crash` menyimpang sementara dari §6.** Spec meminta N frame teratas
  non-sistem, tetapi frame belum tersedia sebelum ada symbolication service. Sementara
  ini memakai (nama + reason yang dinormalisasi). **Pengelompokan crash akan berubah**
  ketika symbolication masuk — itu diharapkan, bukan regresi.
- **`source_line` tidak ikut fingerprint** (sesuai §6): menyunting baris di atas call
  site tidak melahirkan issue duplikat. Sudah diverifikasi.
- **Status issue disimpan di tabel `issue_status`**, bertahan lintas restart.

---

## Melihat data

```bash
python3 stats.py                      # ringkasan: crash-free, top issue, per host
python3 stats.py --all-sessions       # termasuk sesi emulator/dev
python3 stats.py --user usr_8f14e45f  # telusuri satu user
python3 stats.py --raw 5              # 5 event terakhir, mentah
python3 stats.py --crumbs crash       # timeline breadcrumb sebelum crash terakhir
```

Secara default `stats.py` **mengecualikan sesi emulator dan developer-mode** —
sama seperti toggle "Real users only" di mockup dashboard. Metrik headline jadi
mencerminkan user sungguhan.

---

## Mencari user lewat nomor HP

Server tidak pernah menyimpan nomor mentah. `user_id` yang dikirim SDK langsung
di-hash jadi `user_ref` dengan kunci server (BE-21), lalu nilai mentahnya
dibuang. Untuk mencari balik, hash nomornya dengan cara yang sama:

```bash
python3 -c "
import hmac, hashlib, os
key = os.environ.get('APM_SERVER_KEY','ganti-dengan-nilai-acak-panjang').encode()
print('usr_' + hmac.new(key, b'0812345678', hashlib.sha256).hexdigest()[:12])
"
# lalu: python3 stats.py --user usr_xxxxxxxxxxxx
```

Verifikasi bahwa tidak ada PII yang lolos:

```bash
sqlite3 apm.db "SELECT COUNT(*) FROM events WHERE attrs LIKE '%08%' AND attrs LIKE '%@%'"
```

---

## Menguji kill switch

SDK mengambil `GET /v1/config` saat startup. Untuk mematikan SDK dari jarak
jauh tanpa rilis app: ubah `REMOTE_CONFIG["enabled"]` di `ingest.py` menjadi
`False`, restart server, lalu jalankan ulang app.

Ini juga cara memverifikasi MOB-21 di kondisi nyata, bukan hanya di unit test.

---

## Menguji kontrak response (§7)

`send-test-data.py` sudah menguji jalur `202` dan `400`. Untuk menguji reaksi
SDK terhadap kondisi lain (`429`, `5xx`, `413`), ubah sementara handler
`do_POST` agar mengembalikan kode tersebut, lalu amati apakah SDK:

- menahan data di disk dan mencoba lagi dengan backoff (`5xx`)
- menghormati `Retry-After` (`429`)
- **membuang** batch dan tidak mencoba selamanya (`400`)

---

## Konfigurasi lewat environment

```bash
APM_PORT=9000 \
APM_DB=pilot.db \
APM_APP_KEY=kunci-rahasia \
APM_SERVER_KEY=pepper-hmac-yang-panjang-dan-acak \
python3 ingest.py
```

`APM_SERVER_KEY` adalah pepper untuk hashing `user_id`. **Ganti sebelum
mengumpulkan data sungguhan**, dan pakai nilai yang sama sepanjang pilot —
mengubahnya di tengah jalan memutus korelasi user historis.

---

## Skema database

Satu tabel datar, gampang di-query:

```sql
SELECT type, COUNT(*) FROM events GROUP BY type;

SELECT json_extract(attrs,'$.host')             AS host,
       json_extract(attrs,'$.failure_category') AS kategori,
       COUNT(*)
FROM events WHERE type='network_failure'
GROUP BY host, kategori ORDER BY 3 DESC;
```

Kolom penting: `ts_server` (jam kita — dipakai untuk urutan) vs `ts_client`
(jam device — tidak dipercaya), `user_ref` (hash), dan flag `is_emulator` /
`is_rooted` / `is_dev_mode` untuk menyaring sesi non-real.

---

## Setelah pilot

Data di `apm.db` bisa langsung jadi bahan bicara: crash-free rate sungguhan,
host mana yang bermasalah, berapa user terdampak. Itu yang dibawa ke rapat
berikutnya — bukan mockup lagi.

Backend Fase 3 nanti menggantikan ini sepenuhnya; jangan bangun apa pun di
atasnya.
