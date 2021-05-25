function getColorTheme (selectedOption) {
    const baseThemeColors = {
        primary = "white",
        secondary = "blue"
    }
    if (selectedOption === "base") {
        return baseThemeColors;
    }
}
export {getColorTheme};
