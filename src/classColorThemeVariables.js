function getColorTheme (selectedOption) {
    const baseThemeColors = {
        primary : "black",
        secondary : "grey darken-4",
        text : "grey-text text-lighten-4"
    }
    if (selectedOption === "base") {
        return baseThemeColors;
    }
}
export {getColorTheme};
