// Return true if the field has ERROR
export const requiredValidator = (fieldValue: string | number | object) => {
    if (typeof fieldValue === "number") {
        return !(fieldValue || fieldValue === 0);
    }

    return !fieldValue;
};

export const yourCustomStringValidation = (stringValue: string) => {
    return stringValue.length <= 15;
};
