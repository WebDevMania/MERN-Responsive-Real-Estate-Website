import React, { useState } from 'react'
import classes from './navbar.module.css'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineClose, AiOutlineFileImage } from 'react-icons/ai'
import { BsHouseDoor } from 'react-icons/bs'
import { logout } from '../../redux/authSlice'
import { request } from '../../util/fetchAPI'

const Navbar = () => {
  const [state, setState] = useState({})
  const [photo, setPhoto] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { user, token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // mobile
  const [showMobileNav, setShowMobileNav] = useState(false)

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true)
    return () => (window.onscroll = null)
  }

  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/signin")
  }


  const handleState = (e) => {
    setState(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setPhoto(null)
    setState({})
  }

  const handleListProperty = async (e) => {
    e.preventDefault()
    let filename = null
    if (photo) {
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

      const data = await request("/property", 'POST', options, { ...state, img: filename })
      console.log(data)

      setShowForm(false)
      // dispatch(updateUser(data))
      // window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className={`${classes.container} ${isScrolled && classes.scrolled}`}>
      <div className={classes.wrapper}>
        <Link to='/' onClick={scrollToTop} className={classes.left}>
          Real Estate <BsHouseDoor />
        </Link>
        <ul className={classes.center}>
          <li onClick={scrollToTop} className={classes.listItem}>
            Home
          </li>
          <li className={classes.listItem}>
            About
          </li>
          <li className={classes.listItem}>
            Featured
          </li>
          <li className={classes.listItem}>
            Contacts
          </li>
        </ul>
        <div className={classes.right}>
          {!user ?
            <>
              <Link to='/signup'>Sign up</Link>
              <Link to='/signin'>Sign in</Link>
            </>
            :
            <>
              <span>Hello {user.username}!</span>
              <span className={classes.logoutBtn} onClick={handleLogout}>Logout</span>
              <Link onClick={() => setShowForm(true)} className={classes.list}>List your property</Link>
            </>
          }
        </div>
      </div>
      {
        !showMobileNav && showForm &&
        <div className={classes.listPropertyForm} onClick={handleCloseForm}>
          <div className={classes.listPropertyWrapper} onClick={(e) => e.stopPropagation()}>
            <h2>List Property</h2>
            <form onSubmit={handleListProperty}>
              <input type="text" placeholder='Title' name="title" onChange={handleState} />
              <input type="text" placeholder='Type' name="type" onChange={handleState} />
              <input type="text" placeholder='Desc' name="desc" onChange={handleState} />
              <input type="text" placeholder='Continent' name="continent" onChange={handleState} />
              <input type="number" placeholder='Price' name="price" onChange={handleState} />
              <input type="number" placeholder='Sq. meters' name="sqmeters" onChange={handleState} />
              <input type="number" placeholder='Beds' name="beds" step={1} min={1} onChange={handleState} />
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
              <button>List property</button>
            </form>
            <AiOutlineClose onClick={handleCloseForm} className={classes.removeIcon} />
          </div>
        </div>
      }
      {
        <div className={classes.mobileNav}>
          {showMobileNav &&
            <div className={classes.navigation}>
              <Link to='/' onClick={scrollToTop} className={classes.left}>
                Real Estate <BsHouseDoor />
              </Link>
              <AiOutlineClose className={classes.mobileCloseIcon} onClick={() => setShowMobileNav(false)} />
              <ul className={classes.center}>
                <li onClick={scrollToTop} className={classes.listItem}>
                  Home
                </li>
                <li className={classes.listItem}>
                  About
                </li>
                <li className={classes.listItem}>
                  Featured
                </li>
                <li className={classes.listItem}>
                  Contacts
                </li>
              </ul>
              <div className={classes.right}>
                {!user ?
                  <>
                    <Link to='/signup'>Sign up</Link>
                    <Link to='/signin'>Sign in</Link>
                  </>
                  :
                  <>
                    <span>Hello {user.username}!</span>
                    <span className={classes.logoutBtn} onClick={handleLogout}>Logout</span>
                    <Link onClick={() => setShowForm(true)} className={classes.list}>List your property</Link>
                  </>
                }
              </div>
              {showForm &&
                <div className={classes.listPropertyForm} onClick={handleCloseForm}>
                  <div className={classes.listPropertyWrapper} onClick={(e) => e.stopPropagation()}>
                    <h2>List Property</h2>
                    <form onSubmit={handleListProperty}>
                      <input type="text" placeholder='Title' name="title" onChange={handleState} />
                      <input type="text" placeholder='Type' name="type" onChange={handleState} />
                      <input type="text" placeholder='Desc' name="desc" onChange={handleState} />
                      <input type="text" placeholder='Continent' name="continent" onChange={handleState} />
                      <input type="number" placeholder='Price' name="price" onChange={handleState} />
                      <input type="number" placeholder='Sq. meters' name="sqmeters" onChange={handleState} />
                      <input type="number" placeholder='Beds' name="beds" step={1} min={1} onChange={handleState} />
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
                      <button>List property</button>
                    </form>
                    <AiOutlineClose onClick={handleCloseForm} className={classes.removeIcon} />
                  </div>
                </div>}
            </div>}
          {!showMobileNav && <GiHamburgerMenu onClick={() => setShowMobileNav(prev => !prev)} className={classes.hamburgerIcon} />}
        </div>
      }
    </div>
  )
}

export default Navbar