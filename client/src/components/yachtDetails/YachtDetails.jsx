import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { request } from '../../util/fetchAPI'
import classes from './yachtDetails.module.css'
import { useSelector } from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai'
import emailjs from '@emailjs/browser'
import { useRef } from 'react'


const YachtDetails = () => {
    const { id } = useParams()
    const [yacht, setYacht] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState("Yacht...")
    const [desc, setDesc] = useState(null)
    const { user, token } = useSelector((state) => state.auth)
    const formRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchYachtDetails = async () => {
            try {
                const yacht = await request(`/yacht/find/${id}`, 'GET')
                setYacht(yacht)
            } catch (error) {
                console.log(error)
            }
        }
        fetchYachtDetails()
    }, [id])


    const handleCloseForm = () => {
        setShowModal(false)
        setTitle('')
        setDesc('')
    }


    const handleContactOwner = async (e) => {
        e.preventDefault()

        emailjs.sendForm("service_t06pp54", "template_98hv8r4", formRef.current, '3oTJ216_DibDrfWHo')
            .then((result) => {
                console.log(result.text);
                console.log(result.text)
            }, (error) => {
                console.log(error.text);
            });
    }

    const handleDelete = async(e) => {
        try {
            await request(`/yacht/${id}`, "DELETE", {'Authorization': `Bearer ${token}`})
            navigate('/yachts')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <div className={classes.left}>
                    <img src={`http://localhost:5000/images/${yacht?.img}`} />
                </div>
                <div className={classes.right}>
                    <div className={classes.top}>
                        <h2>Title: {yacht?.title}</h2>
                        {yacht?.currentOwner?._id.toString() === user._id &&
                            (
                                <div className={classes.actions}>
                                    <Link to={`/yacht-edit/${id}`}>Edit</Link>
                                    <span onClick={handleDelete}>Delete</span>
                                </div>
                            )}
                    </div>
                    <div className={classes.location}>Location: <span>{yacht?.location}</span></div>
                    <div className={classes.price}>Price: <span>$ {yacht?.price}</span></div>
                    <div className={classes.passengers}>Max passengers allowed: <span>{yacht?.maxPassengers}</span></div>
                    <div className={classes.descContainer}>Description: <p>{yacht?.desc}</p></div>
                    <div className={classes.ownerDetails}>
                        <span>Owner name: {yacht?.currentOwner?.username}</span>
                        {yacht?.currentOwner?._id.toString() !== user._id && (
                            <button onClick={() => setShowModal(prev => !prev)}>Contact me on: {yacht?.currentOwner?.email}</button>
                        )}
                    </div>
                    {showModal && (
                        <div className={classes.contactForm} onClick={handleCloseForm}>
                            <div className={classes.contactFormWrapper} onClick={(e) => e.stopPropagation()}>
                                <h2>Send Email To Owner</h2>
                                <form onSubmit={handleContactOwner} ref={formRef}>
                                    <input value={user?.email} type="text" placeholder='My email' name="from_email" />
                                    <input value={user?.username} type="text" placeholder='My username' name="from_username" />
                                    <input value={yacht?.currentOwner?.email} type="email" placeholder='Owner email' name="to_email" />
                                    <input value={title} type="text" placeholder='Title' name="from_title" onChange={(e) => setTitle(e.target.value)} />
                                    <input value={desc} type="text" placeholder='Desc' name="message" onChange={(e) => setDesc(e.target.value)} />
                                    <button>Send</button>
                                </form>
                                <AiOutlineClose onClick={handleCloseForm} className={classes.removeIcon} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default YachtDetails