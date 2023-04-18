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
    const [metersLong, setMetersLong] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [error, setError] = useState(false)
    const [emptyFields, setEmptyFields] = useState(false)
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
                setEmptyFields(true)
                setTimeout(() => {
                    setEmptyFields(false)
                }, 2500)
                return
            }

            if (title === '' || desc === '' || price === '' || maxPassengers === '' || location === '' || metersLong === '') {
                setEmptyFields(true)
                setTimeout(() => {
                    setEmptyFields(false)
                }, 2500)
                return
            }

            const options = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }

            const body = {
                title,
                desc,
                price,
                maxPassengers,
                location,
                metersLong
            }

            const newYacht = await request("/yacht", 'POST', options, { ...body, img: filename })

            navigate(`/yacht/${newYacht._id}`)
        } catch (error) {
            setError(true)
            setTimeout(() => {
                 setError(false)
            }, 2500);
        }
    }


    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <h3>Create yacht</h3>
                <form onSubmit={handleCreate}>
                    <div className={classes.inputBox}>
                        <label>Title</label>
                        <input value={title} type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Desc</label>
                        <input value={desc} type="text" name="desc" onChange={(e) => setDesc(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Price</label>
                        <input value={price} type="number" name="price" onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Max Passengers</label>
                        <input value={maxPassengers} type="number" name="maxPassengers" onChange={(e) => setMaxPassengers(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Location</label>
                        <input value={location} type="text" name="location" onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className={classes.inputBox}>
                        <label>Meters long</label>
                        <input value={metersLong} type="text" name="metersLong" onChange={(e) => setMetersLong(e.target.value)} />
                    </div>
                    <div className={classes.inputBoxImage}>
                        <label htmlFor='image'>Photo    <AiFillFileImage /></label>
                        <input type="file" id="image" style={{ display: 'none' }} onChange={(e) => setPhoto(e.target.files[0])} />
                        {photo && <div style={{ marginTop: '12px' }}>Photo name: {photo.name}</div>}
                    </div>
                    <button type="submit">Post</button>
                </form>
                {error && (
                    <div className={classes.error}>
                        There was an error creating a listing! Try again.
                    </div>
                )}
                {emptyFields && (
                    <div className={classes.error}>
                        All fields must be filled!
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateYacht