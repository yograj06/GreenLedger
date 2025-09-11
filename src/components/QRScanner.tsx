import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X } from 'lucide-react';

interface QRScannerProps {
  onScan: (code: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const startScanning = () => {
    setIsScanning(true);
    
    if (elementRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Success callback
          onScan(decodedText);
          stopScanning();
        },
        (error) => {
          // Error callback - only log important errors
          if (error.includes("NotFoundException")) {
            return; // Ignore "not found" errors as they're normal when scanning
          }
          onError?.(error);
        }
      );
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  if (!isScanning) {
    return (
      <Button 
        onClick={startScanning}
        variant="outline"
        className="w-full"
      >
        <Camera className="h-4 w-4 mr-2" />
        Scan QR Code
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Scanning QR Code</h3>
          <Button 
            onClick={stopScanning}
            variant="ghost" 
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div id="qr-reader" ref={elementRef} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Position the QR code within the frame to scan
        </p>
      </CardContent>
    </Card>
  );
}