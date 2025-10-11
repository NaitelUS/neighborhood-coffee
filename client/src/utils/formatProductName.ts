// client/src/utils/formatProductName.ts
export const formatProductName = (name: string, option?: string) => {
  if (!option) return name;
  const normalizedName = name.toLowerCase();
  const normalizedOption = option.toLowerCase();
  return normalizedName.includes(`(${normalizedOption})`)
    ? name
    : `${name} (${option})`;
};
