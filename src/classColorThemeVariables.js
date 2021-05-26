function getColorTheme (selectedOption) {
    const baseThemeColors = {
        primary : "black",
        secondary : "black",
        text : "white-text"
    }
    if (selectedOption === "base") {
        return baseThemeColors;
    }
}
export {getColorTheme};
