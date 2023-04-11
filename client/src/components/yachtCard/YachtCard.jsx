import React from 'react'
import classes from './yachtCard.module.css'
import { Link } from 'react-router-dom'
import { BsFillPersonFill } from 'react-icons/bs'

const YachtCard = ({ yacht }) => {

    return (
        <Link to={`/yacht/${yacht._id}`} className={classes.container}>
            <div className={classes.wrapper}>
                <div className={classes.imgContainer}>
                    <img src={`http://localhost:5000/images/${yacht.img}`} />
                </div>
                <h3 className={classes.title}>{yacht.title}</h3>
                <div className={classes.priceAndMaxPassengers}>
                    <span>$ {yacht.price}</span>
                    <span className={classes.passengers}><BsFillPersonFill />  {yacht.maxPassengers}</span>
                </div>
            </div>
        </Link>
    )
}

export default YachtCard