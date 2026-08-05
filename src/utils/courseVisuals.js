// Shared visual treatment for courses that don't have (or shouldn't show) a photo banner:
// a deterministic pastel tile with the course's initials.
const PALETTES = [
  { bg: '#f0ecfc', text: '#8b7fd6' },
  { bg: '#e6f2fb', text: '#4a90c4' },
  { bg: '#e6f7f0', text: '#3ba17e' },
  { bg: '#fdf3e6', text: '#d6923f' },
];

export const getCourseInitials = (name = '') => {
  const words = name.trim().split(' ').filter(Boolean);
  if (!words.length) { return ''; }
  if (words.length === 1) { return words[0].substring(0, 2).toUpperCase(); }
  return (words[0][0] + words[1][0]).toUpperCase();
};

const hashString = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = Math.abs(Math.imul(31, hash) + str.charCodeAt(i));
  }
  return hash;
};

export const getCoursePalette = (seed = '') => PALETTES[hashString(seed) % PALETTES.length];
