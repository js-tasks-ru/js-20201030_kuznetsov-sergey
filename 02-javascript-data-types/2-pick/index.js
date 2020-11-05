/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const newObj = {};
    for (let i in fields) {
        const field = fields[i];
        if (field in obj) {
            newObj[field] = obj[field];
        }
    }
    return newObj;
};
