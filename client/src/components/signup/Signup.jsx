import React from 'react'
import { useState } from 'react'
import { AiOutlineFileImage } from 'react-icons/ai'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import classes from './signup.module.css'
import { register } from '../../redux/authSlice'


const Signup = () => {
  const [state, setState] = useState({})
  const [photo, setPhoto] = useState("")
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      let filename = null
      if (photo) {
        const formData = new FormData()
        filename = crypto.randomUUID() + photo.name
        formData.append('filename', filename)
        formData.append('image', photo)

        await fetch(`http://localhost:5000/upload/image`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          method: 'POST',
          body: formData
        })
      } else {
        return
      }

      const res = await fetch(`http://localhost:5000/auth/register`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ ...state, profileImg: filename })
      })
      const data = await res.json()
      dispatch(register(data))
      navigate("/")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <input type="text" name="username" placeholder='Username...' onChange={handleState} />
          <input type="text" name="email" placeholder='Email...' onChange={handleState} />
          <label htmlFor='photo'>Upload photo <AiOutlineFileImage /></label>
          <input style={{ display: 'none' }} id='photo' type="file" onChange={(e) => setPhoto(e.target.files[0])} />
          <input type="password" name="password" placeholder='Password...' onChange={handleState} />
          <button type="submit">Register</button>
          <p>Already have an account? <Link to='/signin'>Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Signup