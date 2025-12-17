# Fungsi untuk menemukan dan mengganti teks dalam file
$translations = @{
    "Total Users" = "Total Pengguna"
    "Total Services" = "Total Layanan"  
    "Total Orders" = "Total Pesanan"
    "Completed Orders" = "Pesanan Selesai"
    "Pending Orders" = "Pesanan Pending"
    "Recent Orders" = "Pesanan Terbaru"
    "Recent Users" = "Pengguna Terbaru"
    "Recent Activity" = "Aktivitas Terbaru"
    "View All" = "Lihat Semua"
    "Loading..." = "Memuat..."
    "No data" = "Tidak ada data"
    "Add User" = "Tambah Pengguna"
    "Add Service" = "Tambah Layanan"
    "Edit" = "Ubah"
    "Delete" = "Hapus"
    "Save" = "Simpan"
    "Cancel" = "Batal"
    "Export" = "Ekspor"
    "Full Name" = "Nama Lengkap"
    "Email Address" = "Alamat Email"
    "Phone Number" = "Nomor Telepon"
    "Role" = "Peran"
    "Status" = "Status"
    "Actions" = "Aksi"
    "Active" = "Aktif"
    "Inactive" = "Nonaktif"
    "Search" = "Cari"
    "Filter" = "Filter"
}

# File yang akan diproses
$files = @(
    "src\app\dashboard\admin\page.tsx",
    "src\app\dashboard\users\page.tsx",
    "src\app\dashboard\services\page.tsx",
    "src\app\dashboard\admin\orders\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Translating: $file"
        $content = Get-Content $file -Raw
        
        foreach ($key in $translations.Keys) {
            $content = $content -replace [regex]::Escape($key), $translations[$key]
        }
        
        $content | Set-Content $file -NoNewline
        Write-Host "  ✓ Done"
    }
}

Write-Host "`nTranslation complete!"
