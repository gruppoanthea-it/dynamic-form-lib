/**
 * Function that checks if two object are equals (deep check)
 * @param o1 First object
 * @param o2 Second object
 */
export function equals(o1: any, o2: any): boolean {
    for (const key in o1) {
        if (o1.hasOwnProperty(key)) {
            if (typeof o1[key] === 'object') {
                if (equals(o1[key], o2[key])) {
                    return true;
                }
            } else {
                if (o1[key] !== o2[key]) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Function to deep clone an object
 * @param obj Object to clone
 */
export function deepCopy(obj: any): any {
    let copy;
    if (null == obj || 'object' !== typeof obj) {
        return obj;
    }
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = deepCopy(obj[attr]);
            }
        }
        return copy;
    }
    return null;
}
