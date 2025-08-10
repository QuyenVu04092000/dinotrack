import * as Yup from "yup";

export const validateSection = async (
  values: any,
  validationSchema: Yup.ObjectSchema<any>,
  setTouched: any,
  touchedFields: Record<string, boolean>,
): Promise<boolean> => {
  try {
    await validationSchema.validate(values, { abortEarly: false });
    setTouched(touchedFields, true);
    return true;
  } catch (err) {
    const errors: Record<string, string> = {};
    if (err instanceof Yup.ValidationError) {
      err.inner.forEach((error) => {
        if (error.path) {
          errors[error.path] = error.message;
          touchedFields[error.path] = true;
        }
      });
      setTouched(touchedFields, true);
    }
    return Object.keys(errors).length === 0;
  }
};

type FormValues = Record<string, any>;

// function get values changed in form
export const getChangedValues = (values: FormValues, initialValues: FormValues): Partial<FormValues> => {
  const changedValues: Partial<FormValues> = {};
  for (const key in values) {
    if (values[key] !== initialValues[key]) {
      changedValues[key] = values[key];
    }
  }
  return changedValues;
};

export const validateRecords = async (
  recordSchema: Yup.ObjectSchema<any>,
  records: any[],
): Promise<Record<string, Record<string, string>>> => {
  const validationErrors = {} as Record<string, Record<string, string>>;
  for (let i = 0; i < records.length; i++) {
    try {
      await recordSchema.validate(records[i], { abortEarly: false });
      validationErrors[records[i].id] = {};
    } catch (err: any) {
      const errors = {} as Record<string, string>;
      err.inner?.forEach((error: any) => {
        errors[error.path] = error.message;
      });
      validationErrors[records[i].id] = errors;
    }
  }
  return validationErrors;
};
