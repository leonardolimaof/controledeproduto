/**
 * Verifica se um código de barras está em um formato válido
 * (Esta é uma implementação básica, você pode expandir para algoritmos específicos como EAN, UPC, etc.)
 */
export function isValidBarcode(barcode: string): boolean {
  // Verifica se o código é numérico e tem um comprimento razoável
  return /^\d{8,13}$/.test(barcode);
}

/**
 * Formata um código de barras para exibição
 */
export function formatBarcode(barcode: string): string {
  // Poderia implementar formatação por tipo de código (EAN, UPC, etc.)
  // Esta é uma implementação simples
  if (barcode.length === 13) {
    // Formato EAN-13
    return `${barcode.slice(0, 1)} ${barcode.slice(1, 7)} ${barcode.slice(7)}`;
  } else if (barcode.length === 8) {
    // Formato EAN-8
    return `${barcode.slice(0, 4)} ${barcode.slice(4)}`;
  }
  return barcode;
}

/**
 * Verifica se um código de barras já está em uso
 */
export function isBarcodeUnique(barcode: string, existingBarcodes: string[]): boolean {
  return !existingBarcodes.includes(barcode);
}