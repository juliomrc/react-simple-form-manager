export const requiredValidator = (fieldValue: string | number | object) => {
    if (typeof fieldValue === "number") {
        return !(fieldValue || fieldValue === 0);
    }

    return !fieldValue;
};

export const maxLength = (stringValue: string) => {
    return stringValue.length > 15;
};
