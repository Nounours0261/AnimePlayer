export const themeColors = ["yellow", "green", "blue", "purple", "red", "orange"];

export function setTheme(color) {
    if (!themeColors.includes(color)) {
        console.error(`Could not set theme to unknown color '${color}'.`);
        return;
    }

    function f(property) {
        document.documentElement.style.setProperty(`--highlight${property}`, `var(--${color}${property})`);
    }

    ["-l2", "-l1", "", "-d1", "-d2", "-d3"].map(f);

    const opposite = themeColors[(themeColors.findIndex((c) => {
        return c === color;
    }) + 3) % 6];

    function g(property, suffix) {
        document.documentElement.style.setProperty(`--error${property}`, `var(--${opposite}${suffix})`);
    }

    g("", "-d2");
    g("-l1", "-d1");
    g("-l2", "");
    g("-l3", "-l1");
}