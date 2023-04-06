import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { request } from '../../util/fetchAPI'
import { AiOutlineFileImage } from 'react-icons/ai'
import classes from './editProperty.module.css'
import { useSelector } from 'react-redux'

const EditProperty = () => {
    const { id } = useParams()
    const { token } = useSelector((state) => state.auth)
    const [propertyDetails, setPropertyDetails] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [initialPhoto, setInitialPhoto] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const data = await request(`/property/find/${id}`, 'GET')
                setPropertyDetails(data)
                setPhoto(data.img)
                setInitialPhoto(data.img)
            } catch (error) {
                console.error(error)
            }
        }
        fetchPropertyDetails()
    }, [id])

    const handleState = (e) => {
        setPropertyDetails(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        let filename = initialPhoto
        if (photo && photo !== initialPhoto) {
            const formData = new FormData()
            filename = crypto.randomUUID() + photo.name
            formData.append('filename', filename)
            formData.append('image', photo)

            const options = {
                "Authorization": `Bearer ${token}`,
            }

            await request("/upload/image", 'POST', options, formData, true)
        } 

        try {
            const options = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }

            await request(`/property/${id}`, 'PUT', options, { ...propertyDetails, img: filename })
            navigate(`/propertyDetail/${id}`)

        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <h2>Edit Property</h2>
                <form onSubmit={handleUpdate}>
                    <input value={propertyDetails?.title} type="text" placeholder='Title' name="title" onChange={handleState} />
                    <input value={propertyDetails?.type} type="text" placeholder='Type' name="type" onChange={handleState} />
                    <input value={propertyDetails?.desc} type="text" placeholder='Desc' name="desc" onChange={handleState} />
                    <input value={propertyDetails?.continent} type="text" placeholder='Continent' name="continent" onChange={handleState} />
                    <input value={propertyDetails?.price} type="number" placeholder='Price' name="price" onChange={handleState} />
                    <input value={propertyDetails?.sqmeters} type="number" placeholder='Sq. meters' name="sqmeters" onChange={handleState} />
                    <input value={propertyDetails?.beds} type="number" placeholder='Beds' name="beds" step={1} min={1} onChange={handleState} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                        <label htmlFor='photo'>Property picture <AiOutlineFileImage /></label>
                        <input
                            type="file"
                            id='photo'
                            style={{ display: 'none' }}
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />
                        {photo && <p>{photo}</p>}
                    </div>
                    <button type='submit'>Edit</button>
                </form>
            </div>
        </div>
    )
}

export default EditProperty