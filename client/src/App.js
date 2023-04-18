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
import { useEffect } from 'react';
import EditProperty from './components/editProperty/EditProperty';
import Yachts from './components/yachts/Yachts';
import YachtDetails from './components/yachtDetails/YachtDetails';
import CreateYacht from './components/createYacht/CreateYacht';
import YachtEdit from './components/yachtEdit/YachtEdit';
import MyProfile from './components/myProfile/MyProfile';
import UpdateProfile from './components/updateProfile/UpdateProfile';
import './App.css';
import NotFound from './components/notFound/NotFound';

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
          <>
            <Navbar />
            <Hero />
            <PopularProperties />
            <Newsletter />
            <Footer />
          </>
        } />
        <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
        <Route path='/signin' element={!user ? <Signin /> : <Navigate to='/' />} />
        <Route path='/properties' element={
          <>
            <Navbar />
            <Properties />
            <Footer />
          </>
        } />
        <Route path='/yachts' element={user ?
          <>
            <Navbar />
            <Yachts />
            <Footer />
          </>
          : <Navigate to='/signin' />} />
        <Route path='/yacht/:id' element={user ?
          <>
            <Navbar />
            <YachtDetails />
            <Footer />
          </>
          : <Navigate to='/signin' />} />
        <Route path='/create-yacht' element={user ?
          <>
            <Navbar />
            <CreateYacht />
            <Footer />
          </>
          : <Navigate to='/signin' />} />
        <Route path='/yacht-edit/:id' element={user ?
          <>
            <Navbar />
            <YachtEdit />
            <Footer />
          </>
          : <Navigate to='/signin' />} />
        <Route path='/propertyDetail/:id' element={
          <>
            <Navbar />
            <PropertyDetail />
            <Footer />
          </>
        } />
        <Route path='/editproperty/:id' element={
          user ?
            <>
              <Navbar />
              <EditProperty />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />
        <Route path='/my-profile' element={
          user ?
            <>
              <Navbar />
              <MyProfile />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />
        <Route path='/update-profile' element={
          user ?
            <>
              <Navbar />
              <UpdateProfile />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />
        <Route path='*' element={
          <>
            <Navbar />
            <NotFound />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
