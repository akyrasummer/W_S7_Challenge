import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full name is required'),

  size: Yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required')
});

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' }
];

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateField = async (field, value) => {
    const trimmedValue = value.trim();
    try {
      await validationSchema.validateAt(field, { ...formData, [field]: trimmedValue });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: err.message,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate fields on change
    validateField(name, value);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      toppings: checked
        ? [...prevData.toppings, name]
        : prevData.toppings.filter((topping) => topping !== name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate the entire form before submission
      await validationSchema.validate(formData, { abortEarly: false });

      // Success message
      let message = `Thank you for your order, ${formData.fullName}! Your ${
        formData.size === 'S' ? 'small' : formData.size === 'M' ? 'medium' : 'large'
      } pizza with`;

      message += formData.toppings.length === 0
        ? ' no toppings is on the way.'
        : ` ${formData.toppings.length} toppings is on the way.`;

      setSuccessMessage(message);

      // Reset form after successful submission
      setFormData({
        fullName: '',
        size: '',
        toppings: [],
      });
      setErrors({});
    } catch (err) {
      const newErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
      }
      setErrors(newErrors);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isFormValid = formData.fullName.trim().length >= 3 && ['S', 'M', 'L'].includes(formData.size);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="input-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          placeholder="Type full name"
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && (
          <div className="error-message">{errors.fullName}</div>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="size">Size</label>
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
        >
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.size && (
          <div className="error-message">{errors.size}</div>
        )}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type="checkbox"
              onChange={handleCheckboxChange}
              checked={formData.toppings.includes(topping.text)}
            />
            {topping.text}
          </label>
        ))}
      </div>

      <input
        type="submit"
        value="Submit"
        disabled={isSubmitting || !isFormValid}
      />
    </form>
  );
}
