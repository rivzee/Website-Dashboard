# Bulk Translation Script - All Pages
# Translates common English terms to Indonesian across all files

$translations = @{
    # Dashboard & Pages
    "Order Management" = "Kelola Pesanan"
    "My Orders" = "Pesanan Saya"
    "Job Details" = "Detail Pekerjaan"
    "Activity Log" = "Log Aktivitas"
    "Reports" = "Laporan"
    "Settings" = "Pengaturan"
    
    # Common Actions
    "View Details" = "Lihat Detail"
    "Download" = "Unduh"
    "Upload" = "Unggah"
    "Submit" = "Kirim"
    "Update" = "Perbarui"
   "Create" = "Buat"
    "Remove" = "Hapus"
    
    # Status & States
    "Pending" = "Menunggu"
    "In Progress" = "Sedang Diproses"
    "Completed" = "Selesai"
    "Cancelled" = "Dibatalkan"
    "Failed" = "Gagal"
    
    # Messages
    "Loading..." = "Memuat..."
    "No data available" = "Tidak ada data"
    "Successfully" = "Berhasil"
    "Error" = "Kesalahan"
    "Warning" = "Peringatan"
    
    # Forms
    "Username" = "Nama Pengguna"
    "Description" = "Deskripsi"
    "Category" = "Kategori"
    "Price" = "Harga"
    "Date" = "Tanggal"
    "Time" = "Waktu"
    
    # Navigation
    "Home" = "Beranda"
    "About" = "Tentang"
    "Contact" = "Kontak"
    "Services" = "Layanan"
    "Portfolio" = "Portofolio"
    "Testimonials" = "Testimoni"
}

$dashboardFiles = Get-ChildItem -Path "src\app\dashboard" -Filter "*.tsx" -Recurse
$landingFiles = Get-ChildItem -Path "src\app" -Filter "page.tsx" | Where-Object { $_.DirectoryName -notlike "*dashboard*" }

$allFiles = $dashboardFiles + $landingFiles

Write-Host "Found $($allFiles.Count) files to translate`n"

foreach ($file in $allFiles) {
    Write-Host "Translating: $($file.FullName.Replace($PWD, '.'))"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($key in $translations.Keys) {
        if ($content -match [regex]::Escape($key)) {
            $content = $content -replace [regex]::Escape($key), $translations[$key]
            $modified = $true
        }
    }
    
    if ($modified) {
        $content | Set-Content $file.FullName -NoNewline -Encoding UTF8
        Write-Host "  ✓ Translated" -ForegroundColor Green
    } else {
        Write-Host "  - No changes" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Translation complete! Translated $($allFiles.Count) files."
