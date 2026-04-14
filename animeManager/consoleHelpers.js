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
