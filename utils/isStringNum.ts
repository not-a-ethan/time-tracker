export function isStringNum(str: any) {
    return !isNaN(str) && !isNaN(parseFloat(str))
}