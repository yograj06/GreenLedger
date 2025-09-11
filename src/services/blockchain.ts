// Mock blockchain service for demo transactions

export interface BlockchainTransaction {
  hash: string;
  hashShort: string;
  blockNumber: number;
  timestamp: number;
  transactionType: string;
  data: any;
  polygonscanUrl: string;
}

class BlockchainService {
  private readonly POLYGONSCAN_BASE = 'https://mumbai.polygonscan.com/tx/';

  generateTransaction(type: string, data: any): BlockchainTransaction {
    const hash = this.generateTxHash();
    const blockNumber = this.generateBlockNumber();
    const timestamp = Date.now();

    return {
      hash,
      hashShort: `${hash.slice(0, 6)}...${hash.slice(-4)}`,
      blockNumber,
      timestamp,
      transactionType: type,
      data,
      polygonscanUrl: `${this.POLYGONSCAN_BASE}${hash}`
    };
  }

  private generateTxHash(): string {
    // Generate realistic-looking transaction hash (64 chars)
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  private generateBlockNumber(): number {
    // Generate realistic block number for Mumbai testnet
    const baseBlock = 30000000;
    const randomOffset = Math.floor(Math.random() * 1000000);
    return baseBlock + randomOffset;
  }

  // Specific transaction types for GreenLedger
  mintCropRegistration(productId: string, farmerData: any): BlockchainTransaction {
    return this.generateTransaction('crop_registration', {
      productId,
      farmer: farmerData,
      event: 'crop_registered'
    });
  }

  mintStatusUpdate(shipmentId: string, status: string, location?: string): BlockchainTransaction {
    return this.generateTransaction('status_update', {
      shipmentId,
      status,
      location,
      event: 'status_changed'
    });
  }

  mintPaymentEscrow(paymentId: string, amount: number, parties: any): BlockchainTransaction {
    return this.generateTransaction('payment_escrow', {
      paymentId,
      amount,
      parties,
      event: 'escrow_created'
    });
  }

  mintPaymentRelease(paymentId: string, recipient: string): BlockchainTransaction {
    return this.generateTransaction('payment_release', {
      paymentId,
      recipient,
      event: 'payment_released'
    });
  }

  mintTrustScoreUpdate(userId: string, oldScore: number, newScore: number): BlockchainTransaction {
    return this.generateTransaction('trust_update', {
      userId,
      oldScore,
      newScore,
      event: 'trust_score_updated'
    });
  }

  verifyTransaction(hash: string): boolean {
    // Mock verification - always returns true for demo
    return hash.startsWith('0x') && hash.length === 66;
  }
}

export default new BlockchainService();