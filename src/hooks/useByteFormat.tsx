export const formatBytes = (bytes: string | number, decimals = 2): string => {
  let byteNum = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(byteNum) || byteNum === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(byteNum) / Math.log(k));
  const result = parseFloat((byteNum / Math.pow(k, i)).toFixed(dm));

  return `${result} ${sizes[i]}`;
};
