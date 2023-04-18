import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { request } from '../../util/fetchAPI'
import { AiFillFileImage } from 'react-icons/ai'
import classes from './yachtEdit.module.css'

const YachtEdit = () => {
    const { id } = useParams()
    const [title, setTitle] = useState(null)
    const [desc, setDesc] = useState(null)
    const [price, setPrice] = useState(null)
    const [maxPassengers, setMaxPassengers] = useState(null)
    const [location, setLocation] = useState(null)
    const [metersLong, setMetersLong] = useState(null)
    const [initialPhoto, setInitialPhoto] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [error, setError] = useState(false)
    const [emptyFields, setEmptyFields] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchYachtData = async () => {
            try {
                const yacht = await request(`/yacht/find/${id}`, 'GET')
                setTitle(yacht.title)
                setDesc(yacht.desc)
                setPrice(yacht.price)
                setMaxPassengers(yacht.maxPassengers)
                setLocation(yacht.location)
                setTitle(yacht.title)
                setMetersLong(yacht.metersLong)
                setInitialPhoto(yacht.img)
            } catch (error) {
                console.log(error)
            }
        }
        fetchYachtData()
    }, [id])

    const handleEdit = async (e) => {
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

            if (filename) {
                body.img = filename
            }

            const updatedYacht = await request("/yacht/" + id, 'PUT', options, body)

            navigate(`/yacht/${updatedYacht._id}`)
        } catch (error) {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 2500);
        }
    }

    const changePhoto = (e) => {
        setInitialPhoto(null)
        setPhoto(e.target.files[0])
    }

    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <h3>Edit yacht</h3>
                <form onSubmit={handleEdit}>
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
                        <input type="file" id="image" style={{ display: 'none' }} onChange={changePhoto} />
                        {initialPhoto && <div style={{ marginTop: '12px' }}>{initialPhoto}</div>}
                        {photo && <div style={{ marginTop: '12px' }}>Photo name: {photo.name}</div>}
                    </div>
                    <button type="submit">Edit</button>
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
            </div>
        </div>
    )
}

export default YachtEdit