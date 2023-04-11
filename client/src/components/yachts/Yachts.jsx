import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { request } from '../../util/fetchAPI'
import YachtCard from '../yachtCard/YachtCard'
import classes from './yachts.module.css'

const Yachts = () => {
    const [yachts, setYachts] = useState([])

    useEffect(() => {
        const fetchYachts = async () => {
            try {
                const data = await request('/yacht/getAll', 'GET')
                setYachts(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchYachts()
    }, [])

    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <div className={classes.titles}>
                    <h5>Explore the catalog of yachts</h5>
                    <h2>Yachts</h2>
                </div>
                <div className={classes.yachts}>
                    {yachts?.length > 0
                        ? yachts.map((y) => (
                            <YachtCard yacht={y} key={y._id} />
                        ))
                        : <h2>No yachts currently on sale.</h2>
                    }
                </div>
            </div>
        </div>
    )
}

export default Yachts