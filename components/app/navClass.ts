export function navClass(active: boolean, isDark: boolean) {
  if (isDark) {
    return active
      ? "rounded border border-[#c8b273]/50 bg-[#c8b273]/15 px-3 py-1.5 text-[#c8b273]"
      : "rounded border border-transparent px-3 py-1.5 text-[#b7b2a6] hover:border-[#3a3a3a] hover:text-[#e8e4d9]";
  }

  return active
    ? "rounded border border-[#0c5f59] bg-[#0f766e] px-3 py-1.5 text-white"
    : "rounded border border-transparent px-3 py-1.5 text-[#2b342f] hover:border-[#d0d8d5] hover:bg-white/80";
}
