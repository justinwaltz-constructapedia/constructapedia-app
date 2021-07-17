function getColorTheme(selectedOption) {
  const baseThemeColors = {
    primary: 'white',
    secondary: 'whte',
    text: 'blue-grey-text text-darken-4',
  };
  if (selectedOption === 'base') {
    return baseThemeColors;
  }
}
export { getColorTheme };
