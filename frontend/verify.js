const verifyBtn = document.getElementById('verifyBtn');

verifyBtn.addEventListener('click', async () => {
    const diplomaHash = document.getElementById('verifyHash').value.trim(); 
    const verifyStatusDiv = document.getElementById('verifyStatus');

    if (!diplomaHash) {
        alert("Lütfen hash kodunu girin!");
        return;
    }

    try {
        verifyStatusDiv.innerHTML = "<p style='text-align:center;'>🔍 Sorgulanıyor...</p>";
        
        const response = await fetch('http://localhost:3000/api/verify-diploma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diplomaHash: diplomaHash })
        });

        const result = await response.json();
        
        if (result.isValid) {
            verifyStatusDiv.innerHTML = `
                <div class="success-card" style="margin-top: 20px; border-color: #22c55e; background: #f0fdf4;">
                    ✅ BU DİPLOMA GEÇERLİDİR<br>
                    <small style="font-size: 11px; font-weight: 400;">Kayıt Blockchain üzerinde doğrulanmıştır.</small>
                </div>`;
        } else {
            verifyStatusDiv.innerHTML = `
                <div style="background:#fef2f2; color:#991b1b; padding:15px; border-radius:12px; border:1px solid #fecaca; margin-top: 20px; text-align: center;">
                    ❌ GEÇERSİZ VEYA KAYITSIZ DİPLOMA
                </div>`;
        }
    } catch (error) {
        verifyStatusDiv.innerHTML = "❌ Sunucu hatası.";
    }
});