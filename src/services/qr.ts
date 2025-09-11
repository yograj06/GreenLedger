// QR Code generation service using qrcode package

import QRCode from 'qrcode';

class QRCodeService {
  private readonly BASE_URL = window.location.origin;

  async generateDataUrl(code: string): Promise<string> {
    try {
      const verifyUrl = `${this.BASE_URL}/verify/${code}`;
      const dataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#15803d', // primary green
          light: '#f0fdf4' // primary light background
        },
        errorCorrectionLevel: 'M'
      });
      return dataUrl;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw new Error('QR code generation failed');
    }
  }

  async generateSVG(code: string): Promise<string> {
    try {
      const verifyUrl = `${this.BASE_URL}/verify/${code}`;
      const svg = await QRCode.toString(verifyUrl, {
        type: 'svg',
        width: 256,
        margin: 2,
        color: {
          dark: '#15803d',
          light: '#f0fdf4'
        }
      });
      return svg;
    } catch (error) {
      console.error('Failed to generate QR SVG:', error);
      throw new Error('QR SVG generation failed');
    }
  }

  generateCode(productId: string): string {
    // Generate unique code for product: gl-{shortId}
    const shortId = productId.slice(0, 8);
    return `gl-${shortId}`;
  }

  extractProductId(code: string): string | null {
    // Extract product ID from code format: gl-{shortId}
    if (!code.startsWith('gl-')) return null;
    return code.substring(3);
  }

  validateCode(code: string): boolean {
    // Accept both formats: gl-prod001, gl-prod002, etc. and gl-xxxxxxxx
    return /^gl-[a-zA-Z0-9]+$/.test(code);
  }
}

export default new QRCodeService();