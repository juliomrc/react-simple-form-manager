import React from "react";
import { SimpleForm } from "./simple-form/SimpleForm";
import { SlightlyLessSimpleForm } from "./slightly-less-simple-form/SlightlyLessSimpleForm";
import styles from "./form-examples.scss";

export const FormExamples: React.FC = () => {
    return (
        <>
            <div className={styles.formGroup}>
                <h2>This is a simple form</h2>
                <SimpleForm />
            </div>
            <div className={styles.formGroup}>
                <h2>This is a slightly less simple form</h2>
                <SlightlyLessSimpleForm />
            </div>
        </>
    );
};
