import FeaturedProperties from './components/featuredProperties/FeaturedProperties';
import Footer from './components/footer/Footer';
import Hero from './components/hero/Hero';
import Navbar from './components/navbar/Navbar';
import Newsletter from './components/newsletter/Newsletter';
import PopularProperties from './components/popularProperties/PopularProperties';
import Signin from './components/signin/Signin';
import Signup from './components/signup/Signup';
import Properties from './components/properties/Properties';
import PropertyDetail from './components/propertyDetail/PropertyDetail';
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css';
import { useEffect } from 'react';

function App() {
  const { user } = useSelector((state) => state.auth)
  const url = useLocation().pathname

  useEffect(() => {
    url && window.scrollTo(0, 0)
  }, [url])

  return (
    <div>
      <Routes>
        <Route path='/' element={
          user
            ?
            <>
              <Navbar />
              <Hero />
              <PopularProperties />
              <FeaturedProperties />
              <Newsletter />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />
        <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
        <Route path='/signin' element={!user ? <Signin /> : <Navigate to='/' />} />
        <Route path='/properties' element={user ?
          <>
            <Navbar />
            <Properties />
            <Footer />
          </>
          : <Navigate to='/signin' />} />
        <Route path='/propertyDetail/:id' element={
          user
            ?
            <>
              <Navbar />
              <PropertyDetail />
              <Footer />
            </>
            : <Navigate to='/signin' />} />
      </Routes>
    </div>
  );
}

export default App;
