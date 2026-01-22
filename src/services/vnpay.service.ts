import { VNPay, HashAlgorithm } from 'vnpay';

export const vnpay = new VNPay({
    tmnCode: process.env.VNP_TMN_CODE || '',
    secureSecret: process.env.VNP_HASH_SECRET || '',
    vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    testMode: true, // Để true khi dùng sandbox
    hashAlgorithm: HashAlgorithm.SHA512, // Tùy chọn, mặc định là SHA512
    enableLog: true, // Bật log để debug
});

// Hàm chuyển đổi tiền tệ đơn giản (Ví dụ: 1 USD = 25000 VND)
// VNPay chỉ chấp nhận VND
export const convertUsdToVnd = (usd: number): number => {
    return Math.round(usd * 25000);
};

// Hàm lấy ngày giờ hiện tại theo định dạng yyyyMMddHHmmss (nếu cần dùng thủ công)
export const getFormattedDate = () => {
    const date = new Date();
    return date.toISOString().slice(0, 19).replace(/[-T:]/g, "");
};