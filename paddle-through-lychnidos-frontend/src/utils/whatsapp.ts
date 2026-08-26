// wa.me needs a full international number with no leading "+" or local
// trunk prefix. Numbers in this dataset are North Macedonian local format
// (e.g. "070 212 046", no country code) - convert 0XXXXXXXX to 389XXXXXXXX.
// Numbers that already include a country code (start with 3 digits other
// than a local trunk "0") are passed through digit-stripped as-is.
export function toWhatsAppNumber(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) {
    return `389${digits.slice(1)}`;
  }
  return digits;
}
