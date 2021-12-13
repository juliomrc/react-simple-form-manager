import { renderHook, act } from "@testing-library/react-hooks";
import { useFormValidations } from "@src/useFormManager/useFormValidations";
import { UseFormValidationsProps } from "@src/useFormManager/types";

interface FormState {
    firstName: string;
    lastName: string;
    age: number;
}

test("Does not break with undefined initialState", () => {
    const { result } = renderHook(() => useFormValidations<FormState>({}));

    expect(result.current.errorsState.firstName).toBeFalsy();
    expect(result.current.visibleErrors.firstName).toBeFalsy();
    expect(result.current.hasErrors).toBe(false);
});

test("Updates the error state properly", () => {
    const { result } = renderHook(() => useFormValidations<FormState>({}));

    act(() => {
        result.current.setFieldErrorState("firstName", true);
    });

    expect(result.current.errorsState).toEqual({ firstName: true });
});

test("Updates hasErrors flag properly", () => {
    const { result } = renderHook(() => useFormValidations<FormState>({}));

    expect(result.current.hasErrors).toBe(false);

    act(() => {
        result.current.setFieldErrorState("firstName", true);
    });

    expect(result.current.hasErrors).toBe(true);

    act(() => {
        result.current.setFieldErrorState("firstName", false);
    });

    expect(result.current.hasErrors).toBe(false);
});

describe("Updates the visibleErrors properly", () => {
    it("Always shows errors for showErrorsAfter=always", () => {
        const { result } = renderHook(() =>
            useFormValidations<FormState>({ showErrorsAfter: "always" }),
        );

        act(() => {
            result.current.setFieldErrorState("firstName", true);
        });

        expect(result.current.visibleErrors.firstName).toBeTruthy();
    });

    it("Shows the error only after submitting for showErrorsAfter=submit", () => {
        const { result, rerender } = renderHook(
            (props: UseFormValidationsProps) => useFormValidations<FormState>(props),
            {
                initialProps: { showErrorsAfter: "submit" },
            },
        );

        act(() => {
            result.current.setFieldErrorState("firstName", true);
        });

        expect(result.current.visibleErrors.firstName).toBeFalsy();

        rerender({ triedSubmitting: true });

        expect(result.current.visibleErrors.firstName).toBeTruthy();
    });

    it("Still shows the error after submit for showErrorsAfter=customTouch", () => {
        const { result, rerender } = renderHook(
            (props: UseFormValidationsProps) => useFormValidations<FormState>(props),
            {
                initialProps: { showErrorsAfter: "customTouch" },
            },
        );

        act(() => {
            result.current.setFieldErrorState("firstName", true);
        });

        expect(result.current.visibleErrors.firstName).toBeFalsy();

        rerender({ triedSubmitting: true });

        expect(result.current.visibleErrors.firstName).toBeTruthy();
    });

    it("Shows the error after callback for showErrorsAfter=customTouch", () => {
        const { result } = renderHook(() =>
            useFormValidations<FormState>({ showErrorsAfter: "customTouch" }),
        );

        act(() => {
            result.current.setFieldErrorState("firstName", true);
        });

        expect(result.current.visibleErrors.firstName).toBeFalsy();

        act(() => {
            result.current.allowErrorVisibility("firstName");
        });

        expect(result.current.visibleErrors.firstName).toBeTruthy();
    });

    it("Hides the error after allowErrorVisibility callback with visible=false for showErrorsAfter=customTouch", () => {
        const { result } = renderHook(() =>
            useFormValidations<FormState>({ showErrorsAfter: "customTouch" }),
        );

        act(() => {
            result.current.setFieldErrorState("firstName", true);
        });

        expect(result.current.visibleErrors.firstName).toBeFalsy();

        act(() => {
            result.current.allowErrorVisibility("firstName");
        });

        expect(result.current.visibleErrors.firstName).toBeTruthy();

        act(() => {
            result.current.allowErrorVisibility("firstName", false);
        });

        expect(result.current.visibleErrors.firstName).toBeFalsy();
    });

    it("Hides all the errors after resetErrorVisibility for showErrorsAfter=customTouch", () => {
        const { result } = renderHook(() =>
            useFormValidations<FormState>({ showErrorsAfter: "customTouch" }),
        );

        act(() => {
            result.current.setFieldErrorState("firstName", true);
            result.current.setFieldErrorState("lastName", true);
            result.current.allowErrorVisibility("firstName");
            result.current.allowErrorVisibility("lastName");
        });

        expect(result.current.visibleErrors.firstName).toBeTruthy();
        expect(result.current.visibleErrors.lastName).toBeTruthy();

        act(() => {
            result.current.resetAllErrorsVisibility();
        });

        expect(result.current.visibleErrors.firstName).toBeFalsy();
        expect(result.current.visibleErrors.lastName).toBeFalsy();
    });
});
