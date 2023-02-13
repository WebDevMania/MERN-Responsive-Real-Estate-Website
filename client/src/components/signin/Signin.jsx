import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../redux/authSlice'
import { request } from '../../util/fetchAPI'
import classes from './signin.module.css'


const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const options = {
        "Content-Type": "application/json",
      }

      const data = await request('/auth/login', "POST", options, {email, password})

      dispatch(login(data))
      navigate("/")
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Sign in</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder='Email...' onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder='Password...' onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Sign in</button>
          <p>Already have an account? <Link to='/signup'>Register</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Signup