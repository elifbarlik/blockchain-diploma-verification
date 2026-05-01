import { create } from 'kubo-rpc-client';

// Yerel IPFS daemon'ına (5001 portuna) bağlanır
const ipfs = create({ url: 'http://127.0.0.1:5001' });

export const uploadDiploma = async (diplomaData) => {
    try {
        // Veriyi JSON formatında IPFS'e ekler
        const result = await ipfs.add(JSON.stringify(diplomaData));
        
        return {
            cid: result.path,
            hash: result.cid.toString()
        };
    } catch (error) {
        console.error("IPFS Yükleme Hatası:", error);
        throw error;
    }
};