const defaultWarn = console.warn;
console.warn = (...args) => {
    defaultWarn("\x1b[33m[WARN]");
    defaultWarn(...args);
    defaultWarn("[/WARN]\x1b[0m");
};

const defaultError = console.error;
console.error = (...args) => {
    defaultError("\x1b[31m[ERROR]");
    defaultError(...args);
    defaultError("[/ERROR]\x1b[0m");
};

function logColor(colorCode) {
    return (arg) => {
        console.log(`\x1b[3${colorCode}m%s\x1b[0m`, arg);
    };
}

console.red = logColor(1);
console.green = logColor(2);
console.yellow = logColor(3);
console.blue = logColor(4);
console.magenta = logColor(5);
console.cyan = logColor(6);
console.grey = logColor(7);