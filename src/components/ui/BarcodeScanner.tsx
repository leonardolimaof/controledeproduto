import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useProductStore } from '@/store/useProductStore';
import toast from 'react-hot-toast';

interface BarcodeScannerProps {
  onScanSuccess?: (barcode: string, product?: any) => void;
  onScanFailure?: (error: string) => void;
}

export default function BarcodeScanner({ onScanSuccess, onScanFailure }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraId, setCameraId] = useState<string>('');
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string>('');
  
  const products = useProductStore((state) => state.products);

  useEffect(() => {
    // Listagem das câmeras disponíveis
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setAvailableCameras(
            devices.map((device) => ({
              id: device.id,
              label: device.label || `Camera ${device.id}`,
            }))
          );
          setCameraId(devices[0].id);
        }
      })
      .catch((err) => {
        console.error('Error getting cameras', err);
        toast.error('Não foi possível acessar a câmera');
      });

    // Limpeza do scanner quando o componente for desmontado
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => console.log('Scanner stopped'))
          .catch((err) => console.error('Error stopping scanner', err));
      }
    };
  }, []);

  const startScanner = async () => {
    if (!cameraId) {
      toast.error('Nenhuma câmera selecionada');
      return;
    }

    // Configuração do scanner
    const html5QrCode = new Html5Qrcode('reader');
    scannerRef.current = html5QrCode;
    
    try {
      setIsScanning(true);
      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 100 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Evitar leituras repetidas do mesmo código em um curto período
          if (decodedText !== lastScannedBarcode) {
            setLastScannedBarcode(decodedText);
            
            // Verificar se o produto já existe
            const product = products.find((p) => p.barcode === decodedText);
            
            if (product) {
              toast.success(`Produto encontrado: ${product.name}`);
              if (onScanSuccess) onScanSuccess(decodedText, product);
            } else {
              toast.info(`Código lido: ${decodedText}. Produto não cadastrado.`);
              if (onScanSuccess) onScanSuccess(decodedText);
            }
          }
        },
        (errorMessage) => {
          // Erros de leitura não precisam ser exibidos ao usuário
          console.log(`QR Code scanning error: ${errorMessage}`);
        }
      );
    } catch (err) {
      setIsScanning(false);
      console.error('Error starting scanner', err);
      if (onScanFailure) onScanFailure('Erro ao iniciar o scanner');
      toast.error('Não foi possível iniciar o scanner');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner', err);
        toast.error('Erro ao parar o scanner');
      }
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCameraId(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        {/* Seleção de câmera */}
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Câmera
          </label>
          <select
            value={cameraId}
            onChange={handleCameraChange}
            disabled={isScanning}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          >
            {availableCameras.length === 0 ? (
              <option value="">Nenhuma câmera encontrada</option>
            ) : (
              availableCameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Botões de controle */}
        <div className="flex space-x-2 sm:self-end">
          {!isScanning ? (
            <button
              onClick={startScanner}
              disabled={!cameraId}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Iniciar Scanner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Parar Scanner
            </button>
          )}
        </div>
      </div>

      {/* Elemento onde o scanner será renderizado */}
      <div
        id="reader"
        className={`w-full ${
          !isScanning ? 'h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center' : ''
        } rounded-md overflow-hidden`}
      >
        {!isScanning && (
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <p>Scanner de código de barras desativado</p>
            <p className="text-sm mt-2">Clique em "Iniciar Scanner" para começar</p>
          </div>
        )}
      </div>

      {/* Último código lido */}
      {lastScannedBarcode && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Último código lido:
          </h3>
          <p className="mt-1 text-lg font-bold text-gray-800 dark:text-white break-all">
            {lastScannedBarcode}
          </p>
        </div>
      )}
    </div>
  );
}