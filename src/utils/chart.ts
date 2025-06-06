export const getColorByLabel = (label: string): string => {
  // Generate chart color by name
  const hash = Array.from(label).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099",
    "#3B3EAC", "#0099C6", "#DD4477", "#66AA00", "#B82E2E",
    "#316395", "#994499", "#22AA99", "#AAAA11", "#6633CC",
    "#E67300", "#8B0707", "#329262", "#5574A6", "#B77322", 
    "#16D620", "#B91383", "#F4359E", "#9C5935", "#A9C413",
    "#2A778D", "#668D1C", "#BEA413", "#0C5922", "#743411",
    "#D6A4A4", "#A4D6D6", "#D6D6A4", "#A4A4D6", "#D6A4D6",
    "#A4D6A4", "#D6A4A4", "#A4D6D6", "#D6D6A4", "#A4A4D6"
  ];
  return colors[hash % colors.length];
}

export const sortPids = (pids: string[]): string[] => {
  return pids.sort((a, b) => a.localeCompare(b));
}