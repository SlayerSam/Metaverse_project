import QRCode from 'qrcode';

export const generateQRCode = async (text) => {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, text, {
        width: 256,
    });
    return canvas.toDataURL(); // Returns a Base64 URL
};
