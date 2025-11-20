Peran: Anda adalah seorang developer Google Apps Script profesional.
 
Tugas: Amati struktur yang saya sematkan ini dengan sangat teliti. Implementasikan ke dalam script lengkap untuk aplikasi web Google Apps Script (GAS) yang berfungsi sebagai sistem CRUD (Create, Read, Update, Delete) terintegrasi dengan Google Sheet.
 
1.	Struktur Google Sheet
a)	Sheet DataKegiatan: Ini adalah sheet utama untuk menyimpan semua data input terdiri dari kolom:
•	Kolom A: No.
•	Kolom B: Desa
•	Kolom C: Jenis Program
•	Kolom D: Kode Rekening
•	Kolom E: Uraian Kegiatan
•	Kolom F: Lokasi
•	Kolom G: Prioritas
•	Kolom H: Kategori Program
•	Kolom I: Jenis Kegiatan
•	Kolom J: Volume Rencana
•	Kolom K: Volume Realisasi
•	Kolom L: Satuan
•	Kolom M: Anggaran (Rp)
•	Kolom N: Realisasi (Rp)
•	Kolom O: Sisa (Rp)
•	Kolom P: Pemanfaat Laki-laki
•	Kolom Q: Pemanfaat Perempuan
•	Kolom R: Pemanfaat RTM
•	Kolom S: Tanggal Mulai
•	Kolom T: Tanggal Selesai
•	Kolom U: Upload Foto.
b)	Sheet DataMaster: Sheet ini digunakan sebagai sumber data untuk dropdown.
•	Rentang A2:A berisi daftar 18 Desa (isian sheet DataMaster kolom B)
•	Rentang B2:B berisi daftar 2 Jenis Program (isian sheet DataMaster kolom C)
•	Rentang C2:C berisi daftar 216 Kode Rekening (isian sheet DataMaster kolom D)
•	Rentang D2:D berisi daftar 13 Prioritas (isian sheet DataMaster kolom H)
•	Rentang E2:E berisi daftar 8 Kategori Program (isian sheet DataMaster kolom I)
•	Rentang F2:F berisi daftar 55 Jenis Kegiatan (isian sheet DataMaster kolom J).

 
2.	Tampilan dan Fitur Halaman Utama (Tujuan Fungsional)
a)	Header:
•	Latar belakang: warna #181e71
•	Elemen Kiri:
o	Kiri: Icon menu grid (3x3 kotak kecil, seperti “apps menu) [berfungsi sebagai sidebar menu] dibungkus segi empat warna #2a2f85
o	Di kanan icon grid, teks judul: "Monitoring Kegiatan Desa Kecamatan Bandung Tahun 2025".
•	Elemen Kanan:
o	Tombol input data dengan logo + dibungkus lingkaran dilapisi segi empat warna #a90093
o	Sejajar kiri dengan tombol input: adalah logo ▼ (Panah kebawah); digunakan untuk toggle “Filter Bar” (Di bawah header tabel).
•	Semua text dan icon warna #fbfcfc
b)	Tabel Data
•	Baris 1: Header Tabel (Kolom): warna latar  #0e1346
•	Baris 2: Filter Bar warna #0078B5 (Letak dibawah header tabel)
o	Tombol refresh dengan logo ↻ (sejajar kolom “No.”) [Fungsi: Refresh seluruh filter] #fbfcfc
o	Dropdown: Semua Desa, Pilihan 18 Desa (sejajar kolom “Desa”)
o	Dropdown: Semua Jenis Program, Sarpras, Non Sarpras (sejajar kolom “Jenis Program”)
o	Dropdown: Terdapat ikon kaca pembesar di dalamnya; Semua Kode Rekening, Pilihan 216 Kode Rekening (sejajar kolom “Kode Rekening”)
o	Fitur pencarian: Terdapat ikon kaca pembesar (sejajar kolom “Uraian Kegiatan”)
o	Dropdown: Semua Prioritas, Pilihan 13 Prioritas (sejajar kolom “Prioritas”)
o	Dropdown: Semua Kategori Program, Pilihan 8 Kategori Program (sejajar kolom “Kategori Program”)
o	Dropdown: Terdapat ikon kaca pembesar di dalamnya; Semua Jenis Kegiatan, Pilihan 54 Jenis Kegiatan (sejajar kolom “Jenis Kegiatan”)
o	Input Tanggal: Tgl Awal (dengan ikon kalender); sejajar kolom “Anggaran (Rp)”
o	Input Tanggal: Tgl Akhir (dengan ikon kalender); sejajar kolom “Realisasi (Rp)”.Input Tanggal: Tgl Akhir (dengan ikon kalender); sejajar kolom “Realisasi (Rp)”.
•	Baris 3 – seterusnya: Isian Tabel/Baris
Gunakan table-hover atau table-striped.
•	Footer Tabel (Paginasi)
Letaknya fix di kiri bawah (align-left), bukan center. Komponen yang harus ada:
-	Dropdown jumlah item per halaman.
-	 Text range: “{start}-{end} of {total}”.
-	Tombol: First, Prev, Next, Last.
 
3.	Spesifikasi Modal Form Input (Untuk file Form.html)
Ini adalah bagian dari index.html (sebagai Bootstrap Modal).
a)	Header Modal (#0e1346):
-	Judul: "Form Input-Edit".
-	Tombol × (Close) di sudut kanan atas.
b)	Body Modal (#181e71):
-	Gunakan layout form Bootstrap.
-	Judul bagian: "Data Kegiatan" (dengan garis pemisah di bawahnya).
-	Tata Letak Form berurutan dari atas:
o	Baris 1 (Grid 100/33):
	Kiri: Desa (Dropdown/Select, lebar 33%, placeholder "---Pilih---").
	Tengah: Jenis Program (Dropdown/Select, lebar 33%, placeholder "---Pilih---").
	Kanan: Kode Rekening (Dropdown/Select, lebar 33%, placeholder "---Pilih---").
o	Baris 2 (Grid 50/50):
	Kiri: Uraian Kegiatan (Input uraian kegiatan, lebar 50%).
	Kanan: Lokasi (Input lokasi, lebar 50%).
o	Baris 3 (Grid 100/33):
	Kiri: Prioritas (Dropdown/Select, lebar 33%, placeholder "---Pilih---").
	Tengah: Kategori Program (Dropdown/Select, lebar 33%, placeholder "---Pilih---").
	Kanan: Jenis Kegiatan (Dropdown/Select, lebar 33%, placeholder "---Pilih---").
o	Baris 4 (Grid 100/33)
	Kanan: Volume Rencana: Input Angka (type="number").
	Tengah: Volume Realisasi: Input Angka (type="number").
	Kiri: Satuan: Input Teks (type="text") (placeholder "Orang, OH, Paket, Meter, KPM").
o	Baris 5 (Grid 100/33)
	Kanan: Anggaran (Rp)
	Tengah: Realisasi (Rp)
	Kiri: Sisa (Rp) = [Otomatis}
o	Baris 6 (Grid 100/33)
	Kanan: Pemanfaat Laki-laki: Input Angka (type=”number”).
	Tengah: Pemanfaat Perempuan: Input Angka (type=”number”).
	Kiri: Pemanfaat RTM: Input Angka (type=”number”).
o	Baris 7 (Grid 50/50):
	Kiri: Tanggal Mulai: (Date input, lebar 50%, placeholder "Tanggal").
	Kanan: Tanggal Selesai: (Date input, lebar 50%, placeholder "Tanggal").
o	Baris 8 (100):
	Upload Foto (Upload Foto, lebar 50% dari kanan).
o	Border Form warna #4248b5
c)	Footer Modal:
-	Tombol disejajarkan ke kanan.
-	Paling kanan: Submit (#04bd4d)
-	Bersebelahan kiri dari Submit: Reset #a90093
-	Bersebelahan kiri Reset: Close (#f4296c)
d)	Tampilan “+ Input” modal  minimalis elegan
-	Buat modal bisa digulir/scroll
 
4.	Side Bar Sliding Menu (#0e1346)
•	Menampilkan dua menu: Dana Desa Tahun 2026; atas (yang memuat halaman ini) dan Dana Desa Tahun 2025; bawahnya (#181e71)
•	Tombol Close (X)
 
5.	Struktur Kode & Fungsionalitas Modular
Buatkan script dengan struktur modular yang rapi mudah di modifikasi, mampu menampung skalabilitas data besar dan sudah ditanamkan otomatisasi script untuk membuat tabel di google spreed (misal: setup.gs)
 
6.	Beri petunjuk / urutan langkah-langkah yang jelas tahapan untuk:
a)	Membuat Google sheet.
b)	Menambahkan kode.
c)	Mempublikasikan aplikasi web agar saya bisa membukanya dan mengisi formulir.