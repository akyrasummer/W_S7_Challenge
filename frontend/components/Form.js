import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
  .min(3, validationErrors.fullNameTooShort)
  .max(20, validationErrors.fullNameTooLong)
  .required('Full name is required'),

  size: Yup.string()
  .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
  .required('Size is required'),

  toppings: Yup.array().min(1, 'At least one topping must be selected')
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
const [formData, setFormData] = useState({
  fullName: '',
  size: '',
  toppings: []
})

const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [successMessage, setSuccessMessage] = useState('');

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value
  })
}

const handleCheckboxChange = (e) => {
  const { name, checked } = e.target;
  if (checked) {
    setFormData({
      ...formData,
      toppings: [...formData.toppings, name]
    })
  } else {
    setFormData({
      ...formData,
      toppings: formData.toppings.filter(topping => topping !== name)
    })
  } 
}



const handleSubmit = (e) => {
  e.preventDefault();
  validationSchema
  .validate(formData, { abortEarly: false })
  .then(() => {
    setIsSubmitting(true);
    setErrors({});

    let message = `Thank you for your order, ${formData.fullName}! Your `;
    message += `${formData.size === 'S' ? 'small' : formData.size === 'M' ? 'medium' : 'large'} pizza`;
    if (formData.toppings.length === 0) {
      message += ' with no toppings';
    } else {
      message += ` with ${formData.toppings.length} topping${formData.toppings.length > 1 ? 's' : ''}`;
    }
    
    setSuccessMessage(message);

    setFormData({ // resets form after successful submit
      fullName: '',
      size: '',
      toppings: [],
    });
    setIsSubmitting(false);
  })
  .catch((validationErrors) => {
    setIsSubmitting(false);
    const newErrors = {};
    validationErrors.inner.forEach((error) => {
      newErrors[error.path] = error.message;
    })
    setErrors(newErrors);
  })
}



useEffect(() => {
  if (isSubmitting) {
    const message = formData.toppings.length === 0
      ? "Thank you for your order! No toppings selected."
      : `Thank you for your order! Toppings selected: ${formData.toppings.join(", ")}.`;
    setSuccessMessage(message);
  }
}, [isSubmitting, formData.toppings]);



const isFormValid = formData.fullName.length >= 3 && ['S', 'M', 'L'].includes(formData.size);


  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      
      {/* Success message */}
      {successMessage && <div className="success">{successMessage}</div>}
      
      {/* Failure message */}
      {!isSubmitting && Object.keys(errors).length > 0 && (
        <div className="failure">Something went wrong</div>
      )}

      <div className="input-group">
        <div>
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
        {errors.fullName && <div className="error">{errors.fullName}</div>}
      </div>

      <div className="input-group">
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={formData.size} onChange={handleChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
  
        {errors.size && <div className="error">{errors.size}</div>}
      </div>

      <div className="input-group">
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
      </div>

      <input 
        type="submit" 
        value="Order Pizza" 
        disabled={!isFormValid} 
      />
    </form>
  );
}

