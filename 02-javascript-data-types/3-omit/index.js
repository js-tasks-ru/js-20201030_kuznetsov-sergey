/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    const newObj = {};

    for (let field in obj) {
        newObj[field] = obj[field];
    }

    for (let i in fields) {
        const field = fields[i];
        if (field in obj) {
            delete newObj[field];
        }
    }
    
    return newObj;
};
