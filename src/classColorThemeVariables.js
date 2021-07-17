function getColorTheme(selectedOption) {
  const baseThemeColors = {
    primary: 'white',
    secondary: 'whte',
    text: 'black',
  };
  if (selectedOption === 'base') {
    return baseThemeColors;
  }
}
export { getColorTheme };
