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
import Comment from '../comment/Comment'


const YachtDetails = () => {
    const { user, token } = useSelector((state) => state.auth)
    const { id } = useParams()
    const [yacht, setYacht] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [desc, setDesc] = useState(null)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [success, setSuccess] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    // todo display message
    const [shortComment, setShortComment] = useState(false)
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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await request(`/comment/${id}`, 'GET')
                setComments(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchComments()
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

    const handleComment = async () => {

        if (commentText?.length < 2) {
            setShortComment(true)
            setTimeout(() => {
                setShortComment(false)
            }, 2500)
            return
        }

        try {
            const options = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }

            const newComment = await request(`/comment`, 'POST', options, { text: commentText, listing: id })
            setComments((prev) => {
                return [newComment, ...prev]
            })

            setCommentText('')
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
                    <div className={classes.metersLong}>Meters long: <span>{yacht?.metersLong}</span></div>
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
                {shortComment && (
                    <div>
                        <div className={classes.error}>
                            Comment must be at least 2 characters long!
                        </div>
                    </div>
                )}
            </div>
            {user?._id != null && <div className={classes.commentSection}>
                {/* comment input */}
                <div className={classes.commentInput}>
                    <img src={`http://localhost:5000/images/${user?.profileImg}`} />
                    <input value={commentText} type="text" placeholder='Type message...' onChange={(e) => setCommentText(e.target.value)} />
                    <button onClick={handleComment}>Post</button>
                </div>
                {/* displaying comments */}
                <div className={classes.comments}>
                    {
                        comments?.length > 0
                            ? (
                                comments?.map((comment) => (
                                    <Comment setComments={setComments} key={comment._id} comment={comment} />
                                ))
                            )
                            : (
                                <h2 className={classes.noCommentsMessage}>
                                    No comments yet. Be the the first to leave a comment!
                                </h2>
                            )
                    }
                </div>
            </div>}
        </div>
    )
}

export default YachtDetails