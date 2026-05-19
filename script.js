// Data produk dibuat lebih sederhana, quantity (qty) dimasukkan langsung ke tiap produk
let products = [
    { name: "Daging Sapi", price: 15000, unit: "100g", qty: 0, image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&q=80" },
    { name: "Daging Kambing", price: 14000, unit: "100g", qty: 0, image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&q=80" },
    { name: "Daging Ayam", price: 4000, unit: "100g", qty: 0, image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80" },
    { name: "Telur", price: 3000, unit: "100g", qty: 0, image: "https://images.unsplash.com/photo-1639194335563-d56b83f0060c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Udang", price: 8000, unit: "100g", qty: 0, image: "https://images.unsplash.com/photo-1559742811-822873691df8?w=400&q=80" },
    { name: "Cumi", price: 7000, unit: "100g", qty: 0, image: "https://images.unsplash.com/photo-1716175908279-fccb15fff4b7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Ikan", price: 12000, unit: "1kg", qty: 0, image: "https://images.unsplash.com/photo-1576330383200-2bf325cfec52?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

// Fungsi bantuan untuk memformat uang menjadi tulisan Rupiah (Sederhana)
function formatUang(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// Fungsi untuk memunculkan produk ke HTML (Layar)
function tampilkanProduk() {
    let container = document.getElementById("products-container");
    let html = "";
    
    // Perulangan sederhana (for loop)
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        
        // Membangun HTML menggunakan string
        html += `
            <div class="product-card">
                <div class="product-image" style="background-image: url('${p.image}');"></div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${formatUang(p.price)} / ${p.unit}</div>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="tambahQty(${i}, -1)">-</button>
                        <input type="number" class="qty-input" value="${p.qty}" readonly>
                        <button class="qty-btn" onclick="tambahQty(${i}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Masukkan semua HTML yang dibuat ke dalam layar
    container.innerHTML = html;
}

// Fungsi saat tombol + atau - ditekan
function tambahQty(index, jumlah) {
    let produk = products[index];
    
    // Tambah atau kurang kuantitasnya
    produk.qty = produk.qty + jumlah;
    
    // Pastikan tidak boleh kurang dari 0
    if (produk.qty < 0) {
        produk.qty = 0;
    }
    
    // Refresh / tampilkan ulang produk dan hitung harganya
    tampilkanProduk();
    hitungSubtotal();
}

// Fungsi untuk menghitung harga sementara di kanan bawah layar
function hitungSubtotal() {
    let totalHarga = 0;
    
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        totalHarga = totalHarga + (p.price * p.qty);
    }
    
    document.getElementById("subtotal").textContent = formatUang(totalHarga);
}

// Menjalankan fungsi pertama kali agar layar tidak kosong
tampilkanProduk();


// --- LOGIKA SAAT TOMBOL CHECKOUT DIKLIK --- //
document.getElementById("checkout-btn").addEventListener("click", function() {
    // 1. Ambil semua nilai dari inputan pengguna
    let nama = document.getElementById("nama").value;
    let jarak = document.getElementById("jarak").value;
    let kodeMember = document.getElementById("member").value;
    let kodeVoucher = document.getElementById("voucher").value;
    
    // 2. Validasi sederhana
    if (nama == "") {
        alert("Nama tidak boleh kosong!");
        return; // Hentikan kode jika nama kosong
    }
    
    if (jarak == "" || jarak <= 0) {
        alert("Jarak tidak valid! Harus lebih dari 0.");
        return;
    }
    
    // Konversi jarak menjadi angka bulat
    jarak = parseInt(jarak);
    
    // 3. Logika ongkos kirim sederhana (menggunakan if else)
    let ongkir = 0;
    if (jarak <= 5) {
        ongkir = 0; // Gratis ongkir
    } else if (jarak <= 10) {
        ongkir = 10000;
    } else if (jarak <= 40) {
        ongkir = 30000;
    } else {
        alert("Jarak terlalu jauh (maksimal 40km)");
        return; // Hentikan kode
    }
    
    // 4. Hitung total harga barang yang dibeli
    let totalBarang = 0;
    let daftarBarangHtml = ""; // Menyimpan tulisan HTML untuk struk belanja
    
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        
        // Cek jika barang ini ada isinya (dibeli)
        if (p.qty > 0) {
            let hargaTotalProduk = p.price * p.qty;
            totalBarang = totalBarang + hargaTotalProduk;
            
            // Tambahkan ke struk
            daftarBarangHtml += `
                <li class="receipt-item">
                    <span>${p.qty}x ${p.name}</span>
                    <span>${formatUang(hargaTotalProduk)}</span>
                </li>
            `;
        }
    }
    
    if (totalBarang == 0) {
        alert("Anda belum memilih barang satupun!");
        return;
    }
    
    // 5. Hitung diskon sederhana
    let diskonMember = 0;
    let diskonVoucher = 0;
    let member = false;
    let voucher = false;
    
    // Validasi dan cek kode member dengan if-else
    if (kodeMember == "MEMBER123") {
        member = true;
        diskonMember = totalBarang * 0.10; // Diskon member = 10% dari barang
    } else if (kodeMember == "MEMBER456") {
        member = true;
        diskonMember = totalBarang * 0.10; // Diskon member = 10% dari barang
    }
    else if (kodeMember == "MEMBER789") {
        member = true;
        diskonMember = totalBarang * 0.10; // Diskon member = 10% dari barang
    } 
    else if (kodeMember != "") {
        alert("Kode Member tidak valid!");
        return;
    }
    
    // Validasi dan cek kode voucher dengan if-else
    if (kodeVoucher == "IDHUL2024") {
        voucher = true;
        diskonVoucher = 15000; // Diskon voucher = Potongan 15 ribu
    } else if (kodeVoucher == "PROMO2026") {
        voucher = true;
        diskonVoucher = 15000; // Diskon voucher = Potongan 15 ribu
    }
    else if (kodeVoucher == "BANDUNG2026") {
        voucher = true;
        diskonVoucher = 15000; // Diskon voucher = Potongan 15 ribu
    } 
    else if (kodeVoucher != "") {
        alert("Kode Voucher tidak valid!");
        return;
    }
    
    // 6. Hitung total akhir
    let totalAkhir = totalBarang + ongkir - diskonMember - diskonVoucher;
    
    // Mencegah total menjadi minus
    if (totalAkhir < 0) {
        totalAkhir = 0;
    }
    
    // 7. Sembunyikan halaman checkout dan tampilkan halaman hasil
    document.getElementById("checkout-page").classList.remove("active");
    document.getElementById("result-page").classList.add("active");
    
    // 8. Tulis isi ke dalam halaman hasil
    document.getElementById("res-nama").textContent = nama;
    document.getElementById("res-jarak").textContent = jarak;
    document.getElementById("res-items").innerHTML = daftarBarangHtml;
    document.getElementById("res-total-barang").textContent = formatUang(totalBarang);
    
    // Tampilkan Kode Member jika ada
    if (member == true) {
        document.getElementById("res-kode-member-row").style.display = "block";
        document.getElementById("res-kode-member").textContent = kodeMember;
    } else {
        document.getElementById("res-kode-member-row").style.display = "none";
    }
    
    // Tampilkan Kode Voucher jika ada
    if (voucher == true) {
        document.getElementById("res-kode-voucher-row").style.display = "block";
        document.getElementById("res-kode-voucher").textContent = kodeVoucher;
    } else {
        document.getElementById("res-kode-voucher-row").style.display = "none";
    }
    
    // Atur teks ongkos kirim (hijau kalau gratis)
    if (ongkir == 0) {
        document.getElementById("res-ongkir").textContent = "Gratis";
        document.getElementById("res-ongkir").classList.add("text-green");
    } else {
        document.getElementById("res-ongkir").textContent = formatUang(ongkir);
        document.getElementById("res-ongkir").classList.remove("text-green");
    }
    
    // Tampilkan atau Sembunyikan Diskon Member
    if (member == true) {
        document.getElementById("row-diskon-member").style.display = "flex";
        document.getElementById("res-diskon-member").textContent = "-" + formatUang(diskonMember);
    } else {
        document.getElementById("row-diskon-member").style.display = "none";
    }
    
    // Tampilkan atau Sembunyikan Diskon Voucher
    if (voucher == true) {
        document.getElementById("row-diskon-voucher").style.display = "flex";
        document.getElementById("res-diskon-voucher").textContent = "-" + formatUang(diskonVoucher);
    } else {
        document.getElementById("row-diskon-voucher").style.display = "none";
    }
    
    // Masukkan Total Akhir
    document.getElementById("res-total-akhir").textContent = formatUang(totalAkhir);
});

// Fungsi saat tombol "Kembali Berbelanja" ditekan
document.getElementById("back-btn").addEventListener("click", function() {
    // Sembunyikan halaman hasil dan tampilkan halaman checkout lagi
    document.getElementById("result-page").classList.remove("active");
    document.getElementById("checkout-page").classList.add("active");
});
