import React, { useState } from 'react';
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
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: []
  });

  const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        toppings: [...formData.toppings, name]
      });
    } else {
      setFormData({
        ...formData,
        toppings: formData.toppings.filter((topping) => topping !== name)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      let message = `Thank you for your order, ${formData.fullName}! Your`;
      message += `${formData.size === 'S' ? ' small' : formData.size === 'M' ? ' medium' : ' large'} pizza`;

      if (formData.toppings.length === 0) {
        message += ` with no toppings is on the way.`;
      } else {
        message += ` with ${formData.toppings.join(', ')} is on the way.`;
      }

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

  const isFormValid = formData.fullName.length >= 3 && ['S', 'M', 'L'].includes(formData.size);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errors.fullName && <div className="error-message">{errors.fullName}</div>}


      <div className="input-group">
        <label htmlFor="fullName">Full Name</label><br />
        <input
          placeholder="Type full name"
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>
      {errors.size && <div className="error-message">{errors.size}</div>}
      <div className="input-group">
        <label htmlFor="size">Size</label><br />
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
      </div>
      <div className='input-group'>
        <label>Toppings</label><br />
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type="checkbox"
              onChange={handleCheckboxChange}
              checked={formData.toppings.includes(topping.text)}
            />
            {topping.text}<br />
          </label>
        ))}
        <input
          type="submit"
          value="Order Pizza"
          disabled={isSubmitting || !isFormValid}
        />
      </div>
    </form>
  );
}
