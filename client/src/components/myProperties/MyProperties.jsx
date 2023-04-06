import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { request } from '../../util/fetchAPI'
import person from '../../assets/person.jpg'
import { FaBed, FaSquareFull } from 'react-icons/fa'

import classes from './myProperties.module.css'

const MyProperties = () => {
    const [properties, setProperties] = useState([])
    const { user, token } = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const options = { 'Authorization': `Bearer ${token}` }

                const data = await request('/property/find/myproperties', 'GET', options)

                setProperties(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchProperties()
    }, [])

    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <h3>My properties</h3>
                <div className={classes.properties}>
                    {properties.map((property) => (
                        <div key={property._id} className={classes.property}>
                            <Link to={`/propertyDetail/${property._id}`} className={classes.imgContainer}>
                                <img src={`http://localhost:5000/images/${property?.img}`} alt="" />
                            </Link>
                            <div className={classes.details}>
                                <div className={classes.priceAndOwner}>
                                    <span className={classes.price}>$ {property.price}</span>
                                    <img src={person} className={classes.owner} />
                                </div>
                                <div className={classes.moreDetails}>
                                    <span>{property.beds} <FaBed className={classes.icon} /></span>
                                    <span>{property.sqmeters} square meters<FaSquareFull className={classes.icon} /></span>
                                </div>
                                <div className={classes.desc}>
                                    {property.decs}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyProperties