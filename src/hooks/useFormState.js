import { useState } from "react";

export default function useFormState(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const v = type === "checkbox" ? checked : value;

    setValues(prev => {
      const next = { ...prev, [name]: v };
      const fieldErrors = validate(next);
      setErrors(prevErr => ({ ...prevErr, [name]: fieldErrors[name] }));
      return next;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validate(values);
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const validateAll = () => {
    const v = validate(values);
    setErrors(v);
    const hasErrors = Object.keys(v).length > 0;
    return { v, hasErrors };
  };

  return { values, setValues, touched, setTouched, errors, setErrors, handleChange, handleBlur, validateAll };
}
