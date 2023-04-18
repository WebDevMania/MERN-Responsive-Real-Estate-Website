import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../redux/authSlice'
import { request } from '../../util/fetchAPI'
import { AiFillFileImage } from 'react-icons/ai'
import classes from './updateProfile.module.css'

const UpdateProfile = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emptyFields, setEmptyFields] = useState(false)
    const [shortPassword, setShortPassword] = useState(false)
    const [error, setError] = useState(false)
    const [initialPF, setInitialPF] = useState(false)
    const [profilePic, setProfilePic] = useState(false)
    const { token, user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const {username, email, profileImg} = await request(`/user/find/${user._id}`, 'GET')
                setUsername(username)
                setEmail(email)
                setInitialPF(profileImg)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserData()
    }, [])


    const handleUpdate = async (e) => {
        e.preventDefault()

        if (email === '' || username === '') {
            setEmptyFields(true)
            setTimeout(() => {
                setEmptyFields(false)
            }, 2500)
            return
        }

        // we will not include the pass if it's length is < 1, because 0 characters means that the user 
        // doesn't want to update his password

        if ((password.length > 5) == false && password.length !== 0) {
            setShortPassword(true)
            setTimeout(() => {
                setShortPassword(false)
            }, 2500)
            return
        }

        try {
            let filename = null
            if (profilePic) {
                const formData = new FormData()
                filename = crypto.randomUUID() + profilePic.name
                formData.append('filename', filename)
                formData.append('image', profilePic)

                const options = {
                    "Authorization": `Bearer ${token}`,
                }

                await request("/upload/image", 'POST', options, formData, true)
            } 

            const options = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }


            let body = { username, email }

            if (Boolean(filename)) {
                body.profileImg = filename
            }

            if (password.length > 5) {
                body.password = password
            }

            await request(`/user/${user._id}`, 'PUT', options, body)
            dispatch(logout())
            navigate(`/signin`)

        } catch (error) {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 2500)
        }
    }

    const changePhoto = (e) => {
        setInitialPF(null)
        setProfilePic(e.target.files[0])
    }

    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <h2>Update Profile</h2>
                <form onSubmit={handleUpdate}>
                    <input value={username} type="text" placeholder='Username...' onChange={(e) => setUsername(e.target.value)} />
                    <input value={email} type="email" placeholder='Email...' onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Password...' onChange={(e) => setPassword(e.target.value)} />
                    <div className={classes.inputBoxImage}>
                        <label htmlFor='image'>Photo    <AiFillFileImage /></label>
                        <input type="file" id="image" style={{ display: 'none' }} onChange={changePhoto} />
                        {initialPF && <div style={{ marginTop: '12px' }}>{initialPF}</div>}
                        {profilePic && <div style={{ marginTop: '12px' }}>Photo name: {profilePic.name}</div>}
                    </div>
                    <button type='submit'>Update</button>
                </form>
                {error && (
                    <div className={classes.error}>
                        There was an error editing the listing! Try again.
                    </div>
                )}
                {emptyFields && (
                    <div className={classes.error}>
                        All fields must be filled!
                    </div>
                )}
                {shortPassword && (
                    <div className={classes.error}>
                        Password must be atleast 6 characters long!
                    </div>
                )}
            </div>
        </div>
    )
}

export default UpdateProfile