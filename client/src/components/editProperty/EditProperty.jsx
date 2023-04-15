import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { request } from '../../util/fetchAPI'
import { AiOutlineFileImage } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import classes from './editProperty.module.css'

const EditProperty = () => {
    const { id } = useParams()
    const { token } = useSelector((state) => state.auth)
    const [propertyDetails, setPropertyDetails] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [initialPhoto, setInitialPhoto] = useState(null)
    const [error, setError] = useState(false)
    const [emptyFields, setEmptyFields] = useState(false)
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
            if (Object.values(propertyDetails).some((v) => v === '')) {
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

            await request(`/property/${id}`, 'PUT', options, { ...propertyDetails, img: filename })
            navigate(`/propertyDetail/${id}`)

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
                <h2>Edit Property</h2>
                <form onSubmit={handleUpdate}>
                    <input value={propertyDetails?.title} type="text" placeholder='Title' name="title" onChange={handleState} />
                    <select required name='type' onChange={handleState}>
                        <option disabled>Select Type</option>
                        <option value='beach'>Beach</option>
                        <option value='village'>Village</option>
                        <option value='mountain'>Mountan</option>
                    </select>
                    <input value={propertyDetails?.desc} type="text" placeholder='Desc' name="desc" onChange={handleState} />
                    <select required name='continent' onChange={handleState}>
                        <option disabled>Select Continent</option>
                        <option value='Europe'>Europe</option>
                        <option value='Asia'>Asia</option>
                        <option value='South America'>South America</option>
                        <option value='North America'>North America</option>
                        <option value='Australia'>Australia</option>
                        <option value='Africa'>Africa</option>
                    </select>
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
                        {photo && <p>{photo.name}</p>}
                    </div>
                    <button type='submit'>Edit</button>
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

export default EditProperty