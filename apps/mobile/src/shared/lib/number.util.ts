export const versionToNumber = (version?: string | null): number => {
  if (!version) return 0;
  const parts = version.split('.').map(part => parseInt(part, 10));
  return (parts[0] || 0) * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
};
