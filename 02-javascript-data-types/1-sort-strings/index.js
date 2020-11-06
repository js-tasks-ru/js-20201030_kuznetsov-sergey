/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const array = [...arr];
    let order;
    switch(param) {
        case 'asc': 
            order = 1;
            break;
        case 'desc': 
            order = -1;
            break;
    }
    array.sort((a, b) => {
        return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'}) * order;
    });

    return array;
}
