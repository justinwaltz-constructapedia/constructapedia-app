function getColorTheme (selectedOption) {
    const baseThemeColors = {
        primary : "blue-grey darken-4",
        secondary : "blue-grey darken-4",
        text : "grey-text text-lighten-5"
    }
    if (selectedOption === "base") {
        return baseThemeColors;
    }
}
export {getColorTheme};
