import { renderHook, act } from "@testing-library/react-hooks";
import { useFormManager } from "@src/useFormManager";
import React from "react";

interface FormState {
    firstName: string;
    lastName: string;
    age: number;
    likesPets: boolean;
}

it("Does not break with undefined props and has proper initial values", () => {
    const { result } = renderHook(() => useFormManager<FormState>({ onSubmit: jest.fn() }));

    expect(result.current.formState.firstName).toBe(undefined);
    expect(result.current.visibleErrors.firstName).toBe(undefined);
    expect(result.current.hasEdits).toBeFalsy();
    expect(result.current.hasErrors).toBeFalsy();
});

it("Validates initial data", () => {
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: jest.fn(),
            initialState: {
                age: 10,
            },
            validators: {
                age: (age: number) => age < 18,
            },
        }),
    );

    expect(result.current.hasErrors).toBeTruthy();
});

it("Updates individual fields value and validation properly", () => {
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: jest.fn(),
            validators: {
                age: (age: number) => age < 18,
            },
            showErrorsAfter: "always",
        }),
    );

    const invalidAge = 15;

    act(() => {
        result.current.updateAndValidateField("age", invalidAge);
    });

    expect(result.current.formState.age).toBe(invalidAge);
    expect(result.current.visibleErrors.age).toBeTruthy();

    const validAge = 20;

    act(() => {
        result.current.updateAndValidateField("age", validAge);
    });

    expect(result.current.formState.age).toBe(validAge);
    expect(result.current.visibleErrors.age).toBeFalsy();
});

it("Updates the whole state values and validations properly", () => {
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: jest.fn(),
            initialState: {
                firstName: "John",
                age: 20,
            },
            validators: {
                age: (age: number) => age < 18,
            },
            showErrorsAfter: "always",
        }),
    );

    act(() => {
        result.current.updateAndValidateState({ age: 15, lastName: "Doe" });
    });

    expect(result.current.formState).toEqual({ age: 15, lastName: "Doe", firstName: "John" });
    expect(result.current.visibleErrors).toEqual({ age: true });
});

it("Triggers all validations and updates field with updaterFieldAndTriggerAllValidations", () => {
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: jest.fn(),
            initialState: {
                firstName: "John",
                age: 15,
                likesPets: false,
            },
            validators: {
                age: (age: number) => age < 18,
                likesPets: (likesPets: boolean, formState?: FormState) => {
                    // Every grown adult must like pets :)
                    if (formState?.age && formState.age > 25) {
                        return !likesPets;
                    }
                    return false;
                },
            },
            showErrorsAfter: "always",
        }),
    );

    expect(result.current.visibleErrors).toEqual({ age: true, likesPets: false });

    act(() => {
        result.current.updaterForFieldToTriggerAllValidations("age")(50);
    });

    expect(result.current.formState).toEqual({ age: 50, firstName: "John", likesPets: false });
    expect(result.current.visibleErrors).toEqual({ age: false, likesPets: true });
});

it("Returns callbacks to update the correct fields", () => {
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: jest.fn(),
            validators: {
                age: (age: number) => age < 18,
            },
            showErrorsAfter: "customTouch",
        }),
    );

    const updatedAge = 15;
    act(() => {
        const callbackToUpdateAge = result.current.updaterAndValidatorForField("age");
        callbackToUpdateAge(updatedAge);
    });

    expect(result.current.formState.age).toBe(updatedAge);
    expect(result.current.visibleErrors.age).toBeFalsy();

    act(() => {
        const callbackToUpdateAllowAgeErrorVisibility =
            result.current.allowErrorVisibilityForField("age");
        callbackToUpdateAllowAgeErrorVisibility();
    });

    expect(result.current.visibleErrors.age).toBeTruthy();
});

it("Only submits edited forms", () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: mockSubmit,
        }),
    );

    act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn } as unknown as React.SyntheticEvent);
    });

    expect(mockSubmit).toHaveBeenCalledTimes(0);

    act(() => {
        result.current.updateAndValidateField("firstName", "John");
    });
    act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn } as unknown as React.SyntheticEvent);
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);
});

it("Does not submit forms with errors", () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: mockSubmit,
            validators: {
                age: (age: number) => age < 18,
            },
        }),
    );

    act(() => {
        result.current.updateAndValidateField("age", 15);
        result.current.handleSubmit({ preventDefault: jest.fn } as unknown as React.SyntheticEvent);
    });

    expect(mockSubmit).toHaveBeenCalledTimes(0);

    act(() => {
        result.current.updateAndValidateField("age", 20);
    });
    act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn } as unknown as React.SyntheticEvent);
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);
});

it("Bypasses edits and errors validations with allowSubmitWhen: always", () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: mockSubmit,
            initialState: {
                age: 15,
            },
            validators: {
                age: (age: number) => age < 18,
            },
            allowSubmitWhen: "always",
        }),
    );

    act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn } as unknown as React.SyntheticEvent);
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);
});

it("Bypasses only edits with allowSubmitWhen: hasNoErrors", () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: mockSubmit,
            initialState: {
                age: 20,
            },
            validators: {
                age: (age: number) => age < 18,
            },
            allowSubmitWhen: "hasNoErrors",
        }),
    );

    act(() => {
        result.current.handleSubmit();
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);

    act(() => {
        result.current.updateAndValidateField("age", 15);
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);
});

it("Properly resets state", () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
        useFormManager<FormState>({
            onSubmit: mockSubmit,
            initialState: {
                age: 15,
            },
            validators: {
                age: (age: number) => age < 18,
            },
            allowSubmitWhen: "hasNoErrors",
            showErrorsAfter: "customTouch",
        }),
    );

    act(() => {
        result.current.updateAndValidateField("firstName", "John");
        result.current.allowErrorVisibility("age", true);
        result.current.handleSubmit();
    });

    expect(result.current.hasEdits).toBeTruthy();
    expect(result.current.hasErrors).toBeTruthy();
    expect(result.current.visibleErrors.age).toBeTruthy();

    act(() => {
        result.current.resetFormWithNewState({ age: 14 });
    });

    expect(result.current.hasEdits).toBeFalsy();
    expect(result.current.hasErrors).toBeTruthy();
    expect(result.current.visibleErrors.age).toBeFalsy();
    expect(result.current.formState).toEqual({ age: 14 });
});
