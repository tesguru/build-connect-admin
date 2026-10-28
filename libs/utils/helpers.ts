export const encryptUrl = (data: string) => {
  return btoa(encodeURIComponent(data)); // Base64 encode
};

export const decryptUrl = (encryptedData: string) => {
  return decodeURIComponent(atob(encryptedData)); // Base64 decode
};

export const formatName = (...parts: (string | null | undefined)[]) =>
  parts
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const formatStatus = (value?: string | null) =>
  value
    ? value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .trim()
    : "";