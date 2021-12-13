export const copyObjectKeysAndMapToNewValue = <TObject>(
    objToCopy: TObject,
    newValue: unknown,
): TObject => {
    const newObjWithMappedValues = Object.keys(objToCopy).reduce((acc, field) => {
        return {
            ...acc,
            [field]: newValue,
        };
    }, {} as TObject);

    return newObjWithMappedValues;
};
