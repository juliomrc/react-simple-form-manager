# react-simple-form-manager

## Table of contents

-   [Motivation](#motivation)
-   [Setup](#setup)
-   [Usage examples](#usage-examples)
-   [API](#api)
-   [Type safety and intellisense](#type-safety-and-intellisense)

---

## Motivation

There are a lot of npm packages connected to [react forms](https://www.npmjs.com/search?q=react%20form) out there, and most of the popular ones support everything a form might require. Great, but that makes said tools complicated to use, even though a lot of forms might be small and simple. What's missing? Something simple to manage the state and trigger the validations for a form. That is it.

**What this package aims to achieve:** One hook to easily and quickly manage the form **data and validations** with **type support**.

**What this package does not provide:** Inputs, wrappers, or any other form of UI components.

Although this package can be used with plain javascript, types are included in the package and you will only get the full benefit of intellisense with typescript.

---

## Setup

`npm i react-simple-form-manager`. That is it.

## API

### Props

| Name               | Type                                             | Default   | Description                                                     |
| ------------------ | ------------------------------------------------ | --------- | --------------------------------------------------------------- |
| initialState       | [Partial\<TFormState\>](#form-state)             | {}        | Initial data for form state                                     |
| validators         | [FormValidators\<TFormState\>](#form-validators) | {}        | Object with callbacks used to validate each form field          |
| showErrorsAfter    | [ShowErrorsAfter](#show-errors-after)            | "submit"  | Moment when to trigger the visibility of the validation errors  |
| onSubmit           | (formState: TFormState) => void                  | undefined | Callback executed when the form is submitted with no errors     |
| allowInvalidSubmit | boolean                                          | undefined | Allow executing the `onSubmit` callback with errors or no edits |

### Output

| Name                         | Type                                                     | Description                                                 |
| ---------------------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| formState                    | [TFormState](#form-state)                                | The current form state                                      |
| hasEdits                     | boolean                                                  | If there was any change to the initialState                 |
| hasErrors                    | boolean                                                  | If there are any errors in the form state                   |
| visibleErrors                | [VisibleErrors](#visible errors)                         | Object with the errors that should be visible               |
| updaterAndValidatorForField  | (fieldName: string) => (fieldValue: TFormValue) => void; | Returns the callback to update the field value              |
| allowErrorVisibilityForField | (fieldName: string) => () => void;                       | Returns the callback to trigger the visibility of the error |
| updateAndValidateField       | (fieldName: string, fieldValue: TFormValue) => void;     | Callback to update the field value                          |
| updateAndValidateState       | (formState: TFormState) => void;                         | Callback to update the whole state at once                  |
| allowErrorVisibility         | (fieldName: string) => void;                             | Callback to trigger the visibility of the error             |
| handleSubmit                 | () => void;                                              | Callback to pass to the form `onSubmit`                     |

### Form state

To have full intellisense and type support, you should provide a form interface to the `useFormManager<MyCustomFormInterface>()`.

_Note_: Each field may be of any type, but nesting is not supported. If a field is `myCustomField: SomeComplexObject` the callback to update `myCustomField` will override the whole object every time.

```typescript
interface MyCustomFormInterface {
    firstName: string;
    lastName: string;
    age: number;
    address: SomeComplexAddress;
}

interface SomeComplexAddress {
    street: string;
    city: string;
}
...

const formManager = useFormManager<MyCustomFormInterface>({
    initialState: {
        firstName: "John",
        lastName: "Doe",
        age: 18,
        address: {
            street: "My street name",
            city: "My city name",
        },
    },
});
```

### Form validators

```typescript
type FormFieldHasErrors = (fieldValue: TFieldValue, formState?: TFormState) => boolean;
```

All validation callbacks are optional. Fields with no validation callback are always valid.
The callback should **return true if there are any errors**.

You can validate each field independently:

```typescript
export const requiredString = (fieldValue: string) => {
    return !fieldValue;
};

export const percentageValidator = (percentage: number) => {
    return !percentage || percentage < 0 || percentage > 100;
};
```

Or you can take other form fields into consideration:

```typescript
export const hasErrorInPaidAmount = (paidAmount: number, formState: TFormState) => {
    return !paidAmount || paidAmount > formState.totalAmount;
};
```

Each validator has the name of the field it corresponds to:

```typescript
interface MyCustomForm {
    firstName: string;
    lastName: string;
    age: number;
}

...

const formManager = useFormManager<MyCustomForm>({
    validators: {
        firstName: someValidator,
        lastName: someValidator,
        age: someOtherValidator,
    },
})
```

### Show errors after

```typescript
type ShowErrorsAfter = "customTouch" | "submit" | "always";
```

Fields are validated on each change, but you might want to show the errors only after the user tried to submit, or `onBlur`, or maybe when some other event happens.

-   `always` will always display the error message for every field.
-   `submit` will display the error messages for every field after the user tries to submit the form for the first time.
-   `customTouch` will display the error message for each field as soon as the `allowErrorVisibility` is executed, and for every field after the the user tries to submit the form for the first time.

### Visible errors

An object that has the field name and a boolean that represents if the error should be visible or not, with the signature `Type VisibleErrors = Partial\<Record\<keyof TFormData, boolean\>\>`.

For example, this is the VisibleErrors generated by the `MyCustomForm` type:

```typescript
interface MyCustomForm {
    firstName: string;
    lastName: string;
    age: number;
}
interface VisibleErrors {
    firstName: boolean;
    lastName: boolean;
    age: boolean;
}
```

## Type safety and intellisense

## Usage examples

Simple use case:

```tsx
import React from "react";
import { useFormManager } from "react-simple-form-manager";

interface SimpleFormData {
    firstName: string;
    lastName: string;
    age: number;
}

interface SimpleFormProps {
    onSubmit: (formState: SimpleFormData) => void;
}

export const SimpleForm: React.FC<SimpleFormProps> = (props) => {
    const formManager = useFormManager<SimpleFormData>({ onSubmit: props.onSubmit });

    return (
        <form onSubmit={formManager.handleSubmit}>
            <GenericTextInput
                label={"First Name"}
                onValueChange={formManager.updaterAndValidatorForField("firstName")}
                value={formManager.formState.firstName}
            />
            <GenericTextInput
                label={"Last Name"}
                onValueChange={formManager.updaterAndValidatorForField("lastName")}
                value={formManager.formState.lastName}
            />
            <GenericAmountInput
                label={"Age"}
                onValueChange={formManager.updaterAndValidatorForField("age")}
                value={formManager.formState.age}
            />
            <button type={"submit"}>Submit</button>
        </form>
    );
};
```

Slightly less simple use case:

```tsx
interface SlightlyLessSimpleForm {
    firstName: string;
    lastName: string;
    age: number;
    nationality: Nationality;
    hasDualNationality: boolean;
    address: ComplexAddress;
    loveForDogs: LoveForDogs;
}

enum Nationality {
    Portuguese = "portuguese",
    Spanish = "spanish",
}

interface ComplexAddress {
    country: string;
    city: string;
}

type LoveForDogs = "unconditional" | "dogs-are-fine" | "everyone-loves-dogs";

const initialFormState: Partial<SlightlyLessSimpleForm> = {
    firstName: "Julio",
    lastName: "Cordeiro",
    address: {
        country: "Poland",
        city: "Warsaw",
    },
    hasDualNationality: false,
    nationality: Nationality.Portuguese,
    loveForDogs: "everyone-loves-dogs",
};

export const SlightlyLessSimpleForm: React.FC = () => {
    const handleSubmit = (formState: SlightlyLessSimpleForm) => {
        console.log("Saved form state: ", formState);
    };

    const formManager = useFormManager<SlightlyLessSimpleForm>({
        initialState: initialFormState,
        onSubmit: handleSubmit,
        validators: {
            firstName: requiredValidator,
            lastName: requiredValidator,
        },
        showErrorsAfter: "customTouch",
    });

    const errorMessage = "This input is wrong";

    return (
        <form onSubmit={formManager.handleSubmit}>
            <GenericTextInput
                label={"First Name"}
                value={formManager.formState.firstName}
                onValueChange={formManager.updaterAndValidatorForField("firstName")}
                onBlur={formManager.allowErrorVisibilityForField("firstName")}
                errorMessage={formManager.visibleErrors.firstName && errorMessage}
            />
            <GenericTextInput
                label={"Last Name"}
                value={formManager.formState.lastName}
                onValueChange={formManager.updaterAndValidatorForField("lastName")}
                onBlur={formManager.allowErrorVisibilityForField("lastName")}
                errorMessage={formManager.visibleErrors.lastName && errorMessage}
            />
            <GenericAmountInput
                label={"Age"}
                onValueChange={formManager.updaterAndValidatorForField("age")}
                value={formManager.formState.age}
            />
            <GenericSelectInput
                label={"Nationality"}
                options={nationalityOptions}
                onValueChange={formManager.updaterAndValidatorForField("nationality")}
                value={formManager.formState.nationality}
            />
            <GenericCheckbox
                label={"hasDualNationality"}
                onValueChange={formManager.updaterAndValidatorForField("hasDualNationality")}
                value={formManager.formState.hasDualNationality}
            />
            <MyAddressComponent
                label={"address"}
                onValueChange={formManager.updaterAndValidatorForField("address")}
                value={formManager.formState.address}
            />
            <GenericSelectInput
                label={"loveForDogs"}
                options={loveForDogsOptions}
                onValueChange={formManager.updaterAndValidatorForField("loveForDogs")}
                value={formManager.formState.loveForDogs}
            />
            <button type={"submit"}>Submit</button>
        </form>
    );
};
```
