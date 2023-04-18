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
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs'


const YachtDetails = () => {
    const { id } = useParams()
    const [yacht, setYacht] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [desc, setDesc] = useState(null)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [success, setSuccess] = useState(false)
    const { user, token } = useSelector((state) => state.auth)
    const formRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchYachtDetails = async () => {
            try {
                const yacht = await request(`/yacht/find/${id}`, 'GET')
                setYacht(yacht)
                setIsBookmarked(yacht.bookmarkedUsers.includes(user._id))
            } catch (error) {
                console.log(error)
            }
        }
        fetchYachtDetails()
    }, [id])


    const handleCloseForm = () => {
        setShowModal(false)
        setDesc('')
    }


    const handleContactOwner = async (e) => {
        e.preventDefault()

        emailjs.sendForm("service_mjoebse", "template_ebfbr9s", formRef.current, '5T3Wb_hkHjKTOJDYQ')
            .then((result) => {
                handleCloseForm()
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                }, 2500)
            }, (error) => {
                console.log(error.text);
            });
    }

    const handleDelete = async () => {
        try {
            await request(`/yacht/${id}`, "DELETE", { 'Authorization': `Bearer ${token}` })
            navigate('/yachts')
        } catch (error) {
            console.log(error)
        }
    }
    const handleBookmark = async () => {
        try {
            await request(`/yacht/bookmark/${id}`, 'PUT', { Authorization: `Bearer ${token}` })
            setIsBookmarked(prev => !prev)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={classes.container}>
            <h3 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '32px', marginTop: '-2.5rem' }}>Yacht Details</h3>
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
                            <div className={classes.contactBookmarkControls}>
                                <button onClick={() => setShowModal(prev => !prev)}>Contact me on: {yacht?.currentOwner?.email}</button>
                                <span onClick={handleBookmark}>
                                    {isBookmarked ? (
                                        <BsFillBookmarkFill size={25} />
                                    ) : (
                                        <BsBookmark size={25} />
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                    {showModal && (
                        <div className={classes.contactForm} onClick={handleCloseForm}>
                            <div className={classes.contactFormWrapper} onClick={(e) => e.stopPropagation()}>
                                <h2>Send Email To Owner</h2>
                                <form onSubmit={handleContactOwner} ref={formRef}>
                                    <input value={user?.email} type="text" placeholder='My email' name="from_email" />
                                    <input value={user?.username} type="text" placeholder='My username' name="from_name" />
                                    <input value={yacht?.currentOwner?.email} type="email" placeholder='Owner email' name="to_email" />
                                    <input value={desc} type="text" placeholder='Desc' name="message" onChange={(e) => setDesc(e.target.value)} />
                                    <button>Send</button>
                                </form>
                                <AiOutlineClose onClick={handleCloseForm} className={classes.removeIcon} />
                            </div>
                        </div>
                    )}
                </div>
                {success && (
                    <div className={classes.success}>
                        You've successfully contacted the owner of the yacht!
                    </div>
                )}
            </div>
        </div>
    )
}

export default YachtDetails