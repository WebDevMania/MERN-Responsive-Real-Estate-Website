import React from 'react'
import classes from './footer.module.css'

const Footer = () => {
  return (
    <footer>
      <div className={classes.wrapper}>
        <div className={classes.col}>
          <h2>About the App</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam illum quam optio autem suscipit incidunt dicta dolorum eum dolores recusandae laboriosam expedita quo facilis, numquam et.
            Delectus atque dolorum sapiente.
          </p>
        </div>
        <div className={classes.col}>
          <h2>Contacts</h2>
          <span>Phone: +123 456 789</span>
          <span>YouTube: WebDevMania</span>
          <span>GitHub: WebDevMania</span>
        </div>
        <div className={classes.col}>
          <h2>Location</h2>
          <span>Continent: Europe</span>
          <span>Country: Bulgaria</span>
          <span>Current Location: Bulgaria</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer