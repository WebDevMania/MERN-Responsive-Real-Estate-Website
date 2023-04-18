import React from 'react'
import classes from './comment.module.css'
import { format } from 'timeago.js'
import { useSelector } from 'react-redux'
import { BsTrash } from 'react-icons/bs'
import { request } from '../../util/fetchAPI'
import person from '../../assets/person.jpg'

const Comment = ({ comment, setComments }) => {
  const { user, token } = useSelector((state) => state.auth)

  const handleDeleteComment = async () => {
    try {
      const options = {
        Authorization: `Bearer ${token}`
      }
      await request(`/comment/${comment?._id}`, 'DELETE', options)
      setComments((prev) => {
        return [...prev].filter((c) => c?._id !== comment?._id)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <img src={comment?.author?.profileImg ? `http://localhost:5000/images/${comment?.author?.profileImg}` : person}/>
          <div className={classes.userData}>
            <h4>{comment?.author?.username}</h4>
            <span className={classes.timeago}>{format(comment?.createdAt)}</span>
          </div>
          <span>{comment?.text}</span>
        </div>
          <div className={classes.right}>
            {user?._id === comment?.author?._id && (
              <BsTrash className={classes.trashIcon} onClick={handleDeleteComment} />
            )}
          </div>
      </div>
    </div>
  )
}

export default Comment