/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === 0 || string === '') return '';
    if (size === undefined) return string;
    let out = string[0];
    let counter = 1;
    for (let i = 1; i < string.length; i++) {
        if (string[i] !== string[i-1]) {
            out += string[i];
            counter = 1;
        } else if (counter < size) {
            out += string[i];
            counter++;
        }
    }
    return out;
}
