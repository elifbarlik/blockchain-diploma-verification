const diplomaForm = document.getElementById('diplomaForm');
const confirmModal = document.getElementById('confirmModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmMessage = document.getElementById('confirmMessage');
const statusDiv = document.getElementById('status');

let pendingData = null; // Veriyi onaylanana kadar burada tutacağız

// 1. Form Gönderildiğinde Modalı Aç
diplomaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Değerleri al
    const studentIdInput = document.getElementById('studentId').value.trim();
    const gpaInput = document.getElementById('gpa').value.trim();

    // HATA KONTROLÜ 1: Öğrenci Numarası 10 Hane Kontrolü
    if (studentIdInput.length !== 11) {
        alert("HANE SAYISINI KONTROL EDİN\n\nÖğrenci numarası tam olarak 11 haneli olmalıdır. Lütfen girdiğiniz numarayı tekrar gözden geçirin.");
        return;
    }

    // HATA KONTROLÜ 2: GPA Nokta (,) kullanımı yasak, virgül (.) zorunlu
    if (gpaInput.includes(',')) {
        alert("VİRGÜL HATASI\n\nLütfen not ortalamasını NOKTA (.) kullanarak giriniz. Örnek: 3.50");
        return;
    }

    // Sayısal kontrol için virgülü noktaya çevirip test ediyoruz
    const gpaValue = parseFloat(gpaInput.replace('.', ','));

    // HATA KONTROLÜ 3: GPA 0-4 arası sınır kontrolü
    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) {
        alert("ORTALAMANIZI KONTROL EDİN\n\nNot ortalaması 0.00 ile 4.00 arasında olmalıdır!");
        return;
    }
    
    pendingData = {
        studentId: studentIdInput,
        studentName: document.getElementById('studentName').value,
        major: document.getElementById('department').value,
        university: "X Üniversitesi",
        degree: document.getElementById('degree').value,
        graduationDate: document.getElementById('graduationDate').value,
        gpa: gpaInput // Kullanıcının girdiği formatta saklıyoruz
    };

    // Bilgileri modal içinde göster (Not Ortalamasını da ekledik)
    confirmMessage.innerHTML = `
        <strong>Öğrenci:</strong> ${pendingData.studentName}<br>
        <strong>Numara:</strong> ${pendingData.studentId}<br>
        <strong>Bölüm:</strong> ${pendingData.major}<br>
        <strong>Not Ortalaması:</strong> ${pendingData.gpa}<br>
        <strong>Tarih:</strong> ${pendingData.graduationDate}
    `;
    
    confirmModal.style.display = 'flex';
});

// 2. "Eminim" Denirse Blockchain İşlemini Başlat
confirmBtn.addEventListener('click', async () => {
    confirmModal.style.display = 'none';
    statusDiv.innerHTML = "⏳ Kayıt oluşturuluyor (IPFS + Blockchain)...";

    try {
        const response = await fetch('http://localhost:3000/api/issue-diploma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingData)
        });

        const result = await response.json();

        if (result.success) {
            statusDiv.innerHTML = `
                <div class="success-card">
                    <p style="font-weight: bold; margin-bottom: 10px;">✅ Başarıyla Kaydedildi!</p>
                    <div class="result-item"><strong>IPFS CID:</strong><br>${result.cid}</div>
                    <div class="result-item"><strong>Diploma Hash:</strong><br>${result.diplomaHash}</div>
                    <div class="result-item"><strong>Blockchain TX:</strong><br>${result.transactionHash}</div>
                    
                    <!-- Eklenen Rehber Not Kısmı -->
                    <div style="background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 12px; border-radius: 10px; margin-top: 15px; font-size: 0.85rem; text-align: left; line-height: 1.4;">
                        <strong>📌 ÖNEMLİ NOT:</strong> Doğrulama sayfasında sorgulama yapmak için yukarıdaki <b>Diploma Hash</b> kodunu kullanmanız gerekmektedir. Bu kod bu diplomaya özel üretilmiştir.
                    </div>
                </div>`;
            diplomaForm.reset(); // Formu temizle
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        statusDiv.innerHTML = `<div style="color:red; margin-top:10px;">❌ Hata: ${error.message}</div>`;
    }
});

// 3. "Vazgeç" Denirse Modalı Kapat
cancelBtn.addEventListener('click', () => {
    confirmModal.style.display = 'none';
    pendingData = null;
});
