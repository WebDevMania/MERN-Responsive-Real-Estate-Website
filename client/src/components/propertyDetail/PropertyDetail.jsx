import React from 'react'
import classes from './propertyDetail.module.css'
import person from '../../assets/person.jpg'
import emailjs from '@emailjs/browser'
import { useSelector } from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { request } from '../../util/fetchAPI'
import { FaBed, FaSquareFull } from 'react-icons/fa'
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs'
import { useRef } from 'react'
import Comment from '../comment/Comment'

const PropertyDetail = () => {
  const { token, user } = useSelector((state) => state.auth)
  const [propertyDetail, setPropertyDetail] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [desc, setDesc] = useState("")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [success, setSuccess] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  // todo display message
  const [shortComment, setShortComment] = useState(false)
  const { id } = useParams()
  const formRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await request(`/property/find/${id}`, "GET")
        setIsBookmarked(data?.bookmarkedUsers?.includes(user?._id))
        setPropertyDetail(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchDetails()
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
    setShowForm(false)
    setDesc('')
  }

  const handleContactOwner = async (e) => {
    e.preventDefault()

    emailjs.sendForm("service_mjoebse", "template_w5mthmm", formRef.current, '5T3Wb_hkHjKTOJDYQ')
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
      await request(`/property/${id}`, 'DELETE', { 'Authorization': `Bearer ${token}` })
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleBookmark = async () => {
    try {
      await request(`/property/bookmark/${id}`, 'PUT', { Authorization: `Bearer ${token}` })
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
      <h3 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '32px', marginTop: '-2.5rem' }}>Property Details</h3>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <img src={`http://localhost:5000/images/${propertyDetail?.img}`} />
        </div>
        <div className={classes.right}>
          <h3 className={classes.title}>
            Title: {`${propertyDetail?.title}`}
            {user?._id === propertyDetail?.currentOwner?._id && (
              <div className={classes.controls}>
                <Link to={`/editProperty/${id}`}>Edit</Link>
                <button onClick={handleDelete}>Delete</button>
              </div>)
            }
          </h3>
          <div className={classes.details}>
            <div className={classes.typeAndContinent}>
              <div>Type: <span>{`${propertyDetail?.type}`}</span></div>
              <div>Continent: <span>{`${propertyDetail?.continent}`}</span></div>
            </div>
            <div className={classes.priceAndOwner}>
              <span className={classes.price}><span>Price: $ </span>{`${propertyDetail?.price}`}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                Owner: {propertyDetail?.currentOwner?.profileImg
                  ? (
                    <img src={`http://localhost:5000/images/${propertyDetail?.currentOwner?.profileImg}`} className={classes.owner} />
                  ) : (
                    <img src={person} className={classes.owner} />)
                }</span>
            </div>
            <div className={classes.moreDetails}>
              <span>{propertyDetail?.beds} <FaBed className={classes.icon} /></span>
              <span>{propertyDetail?.sqmeters} square meters <FaSquareFull className={classes.icon} /></span>
            </div>
          </div>
          <p className={classes.desc}>
            Desc: <span>{`${propertyDetail?.desc}`}</span>
          </p>
          {user?._id != null && (user?._id !== propertyDetail?.currentOwner?._id.toString()) &&
            <div className={classes.contactBookmarkControls}>
              <button onClick={() => setShowForm(true)} className={classes.contactOwner}>
                Contact owner
              </button>
              <span onClick={handleBookmark}>
                {isBookmarked ? (
                  <BsFillBookmarkFill size={20} />
                ) : (
                  <BsBookmark size={20} />
                )}
              </span>
            </div>
          }
          {user?._id == null && (
            <Link to={`/signin`}>
              <h4 className={classes.noFuncMessage}>
                Sign in to get access to the functionality.
              </h4>
            </Link>
          )
          }
        </div>
      </div>
      {
        showForm &&
        <div className={classes.contactForm} onClick={handleCloseForm}>
          <div className={classes.contactFormWrapper} onClick={(e) => e.stopPropagation()}>
            <h2>Send Email To Owner</h2>
            <form onSubmit={handleContactOwner} ref={formRef}>
              <input value={user?.email} type="text" placeholder='My email' name="from_email" />
              <input value={user?.username} type="text" placeholder='My username' name="from_username" />
              <input value={propertyDetail?.currentOwner?.email} type="email" placeholder='Owner email' name="to_email" />
              <input value={desc} type="text" placeholder='Desc' name="message" onChange={(e) => setDesc(e.target.value)} />
              <button>Send</button>
            </form>
            <AiOutlineClose onClick={handleCloseForm} className={classes.removeIcon} />
          </div>
        </div>
      }
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
      <div className={classes.commentSection}>
        {/* comment input */}
        {user?._id == null && <h3 style={{margin: '0.75rem', fontSize: '24px'}}>Sign in to be able to comment!</h3>}
        {user?._id != null && <div className={classes.commentInput}>
          <img src={`http://localhost:5000/images/${user?.profileImg}`} />
          <input value={commentText} type="text" placeholder='Type message...' onChange={(e) => setCommentText(e.target.value)} />
          <button onClick={handleComment}>Post</button>
        </div>}
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
                  No comments yet.
                </h2>
              )
          }
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail