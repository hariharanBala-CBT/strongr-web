export function formatAddress(part) {
    if (!part) return '';
    const partString = String(part).trim();
    return partString.endsWith(',') ? partString : partString + ', ';
  }
  