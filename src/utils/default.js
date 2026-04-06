function defaultIfNull(val, defaultVal) {
    if (val === undefined || val === null) {
        return defaultVal;
    }
    return val;
}

export function asList(list) {
    return defaultIfNull(list, []);
}

export function asInt(val, defaultVal = 0) {
    return defaultIfNull(val, defaultVal);
}

export function asObject(val) {
    return defaultIfNull(val, {});
}

export function asString(val, defaultVal = "") {
    return defaultIfNull(val, defaultVal);
}