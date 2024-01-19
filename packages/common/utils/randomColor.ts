// Source: https://css-tricks.com/snippets/javascript/random-hex-color/
// Note: May generate invalid colors. See comments & try improving this.
export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}