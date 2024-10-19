import { handleRequest } from 'msw'
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

const [errors, setErrors] = useState({})
const [isSubmitting, setIsSubmitting] = useState(false)

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
      toppings: formData.toppings.filter((topping) => topping !== name)
    })
  }
}

const handleSubmit = (e) => {
  e.preventDefault();
  validationSchema
  .validate(formData, { abortEarly: false })
  .then(() => {
    setIsSubmitting(true)
    setErrors({});

    setFormData({
      fullName: '',
      size: '',
      toppings: []
    })
  })
  .catch((validationErrors) => {
    setIsSubmitting(false);
    const errors = {};
    validationErrors.inner.forEach((error) => {
      errors[error.path] = error.message;
    })
    setErrors(errors)
  })
}


  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {isSubmitting && <div className='success'>Thank you for your order!</div>}
      {isSubmitting && formData.toppings.length === 0 && 
  (<div className="success">Thank you for your order! No toppings selected.</div>)}
      {!isSubmitting && errors && <div className='failure'>Something went wrong</div>}
     
{isSubmitting && formData.toppings.length > 0 && (
  <div className="success">Thank you for your order! Toppings selected: {formData.toppings.join(', ')}</div>
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
        {errors.fullName && (<div className='error'>{errors.fullName}</div>)}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={formData.size} onChange={handleChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && (<div className='error'>{errors.size}</div>)}
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
    
      {errors.toppings && <div className='error'>{errors.toppings}</div>
      }
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" 
      value="Order Pizza" 
      disabled={!formData.fullName || !formData.size || errors.fullName || errors.size}/>
    </form>
  )
}
