import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import { uploadDiploma } from './upload.js';
import contractData from './DiplomaVerification.json' with { type: 'json' };

const app = express();
app.use(cors());
app.use(express.json());

// --- AYARLAR (Terminalindeki bilgilerle eşleşti) ---
const CONTRACT_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"; 
const RPC_URL = "http://127.0.0.1:8545"; 
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; 

// 1. DİPLOMA OLUŞTURMA (ISSUE)
app.post('/api/issue-diploma', async (req, res) => {
    try {
        // Frontend'den beklediğimiz veriler
        const { studentId, studentName, major } = req.body;

        // A. IPFS'e Yükle
        const { cid } = await uploadDiploma({ studentName, major });
        console.log("IPFS Yüklendi! CID:", cid);

        // B. Blockchain Bağlantısı
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, wallet);

        // C. Akıllı Sözleşmeye Yaz
        // Senin ABI'ne göre issueDiploma 3 parametre alıyor: _studentId, _ipfsCid, _diplomaHash
        // DiplomaHash için verinin benzersiz bir özetini (hash) oluşturuyoruz
        const diplomaHash = ethers.id(studentId + studentName + major); 
        
        console.log("Blockchain'e gönderiliyor...");
        const tx = await contract.issueDiploma(studentId, cid, diplomaHash);
        await tx.wait(); // İşlem onaylanana kadar bekle

        console.log("Blockchain Onaylandı! Hash:", tx.hash);

        res.status(200).json({
            success: true,
            cid: cid,
            diplomaHash: diplomaHash,
            transactionHash: tx.hash
        });

    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. DİPLOMA DOĞRULAMA (VERIFY)
app.post('/api/verify-diploma', async (req, res) => {
    try {
        const { diplomaHash } = req.body; // ABI'ne göre bytes32 diplomaHash bekliyor
        
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, provider);
        
        const isValid = await contract.verifyDiploma(diplomaHash);

        res.status(200).json({
            success: true,
            isValid: isValid,
            message: isValid ? "Diploma Geçerli" : "Diploma Geçersiz veya Kayıt Bulunamadı"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend ${PORT} portunda blockchain ile tam entegre çalışıyor!`));