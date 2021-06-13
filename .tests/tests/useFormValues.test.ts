import { renderHook, act } from "@testing-library/react-hooks";
import { useFormValues } from "@src/useFormManager/useFormValues";

interface FormState {
    firstName: string;
    lastName: string;
    age: number;
}

const initialState: FormState = {
    firstName: "",
    lastName: "Doe",
    age: 18,
};
test("Does not break with undefined initialState", () => {
    const { result } = renderHook(() => useFormValues<FormState>());

    expect(result.current.formState.firstName).toBe(undefined);
});

test("Updates the state properly", () => {
    const { result } = renderHook(() => useFormValues<FormState>(initialState));

    expect(result.current.formState).toEqual(initialState);

    const updatedFirstName = "John";

    act(() => {
        result.current.updateState({ firstName: updatedFirstName });
    });

    expect(result.current.formState).toEqual({
        firstName: updatedFirstName,
        lastName: "Doe",
        age: 18,
    });
});

test("Updates edits flag properly", () => {
    const { result } = renderHook(() => useFormValues<FormState>(initialState));

    expect(result.current.hasEdits).toBe(false);

    act(() => {
        result.current.updateState({ lastName: "Doe" });
    });

    expect(result.current.hasEdits).toBe(true);

    act(() => {
        result.current.updateState({ firstName: "John" });
    });

    expect(result.current.hasEdits).toBe(true);
});
