import React from 'react'
import { useState } from 'react'
import { AiFillFileImage } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { request } from '../../util/fetchAPI'
import classes from './createYacht.module.css'

const CreateYacht = () => {
    const [title, setTitle] = useState(null)
    const [desc, setDesc] = useState(null)
    const [price, setPrice] = useState(null)
    const [maxPassengers, setMaxPassengers] = useState(null)
    const [location, setLocation] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [error, setError] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()


    const handleCreate = async (e) => {
        e.preventDefault()

        try {
            let filename = null
            if (photo) {
                const formData = new FormData()
                filename = crypto.randomUUID() + photo.name
                formData.append('filename', filename)
                formData.append('image', photo)

                const options = {
                    "Authorization": `Bearer ${token}`,
                }

                await request("/upload/image", 'POST', options, formData, true)
            } else {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 2500)
                return
            }

            if (title === '' || desc === '' || price === '' || maxPassengers === '' || location === '') {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 2500)
                return
            }

            const options = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }

            const state = {
                title,
                desc,
                price,
                maxPassengers,
                location
            }

            const newYacht = await request("/yacht", 'POST', options, { ...state, img: filename })

            navigate(`/yacht/${newYacht._id}`)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <h3>Create yacht</h3>
                <form onSubmit={handleCreate}>
                    <div className={classes.inputBox}>
                        <label>Title</label>
                        <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Desc</label>
                        <input type="text" name="desc" onChange={(e) => setDesc(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Price</label>
                        <input type="number" name="price" onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Max Passengers</label>
                        <input type="number" name="maxPassengers" onChange={(e) => setMaxPassengers(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Location</label>
                        <input type="text" name="location" onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className={classes.inputBoxImage}>
                        <label htmlFor='image'>Photo    <AiFillFileImage /></label>
                        <input type="file" id="image" style={{ display: 'none' }} onChange={(e) => setPhoto(e.target.files[0])} />
                        {photo && <div style={{marginTop: '12px'}}>Photo name: {photo.name}</div>}
                    </div>
                    <button type="submit">Post</button>
                </form>
                {error && (
                    <div className={classes.error}>
                        
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateYacht