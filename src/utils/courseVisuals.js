// Course card thumbnail tint, per the Striverra design system's card-accent tints
// (striverra-openedx-app-design-system.html #coursecards): "Tint rotation: lilac,
// teal, peach, blue, olive, sage, rose" — never the primary ramp, or every tile
// reads as an active state.
const TINTS = ['#F2F0FF', '#D9F1F1', '#FBF2ED', '#E6F2FF', '#EEF6E5', '#E4F1EE', '#FFECEC'];

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

export const getCourseTint = (seed = '') => TINTS[hashString(seed) % TINTS.length];
