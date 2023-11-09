import React, { useEffect, useState } from 'react';
import styles from "./Header.module.scss"
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes , FaUserCircle} from "react-icons/fa";
import ShowOnLogin, { ShowOnLogout } from '../../customHooks/hiddenLink/hiddenLink';
import { auth } from '../../firebase/config';
import { onAuthStateChanged , signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from '../../redux/slice/authSlice';
import { useDispatch } from 'react-redux';
import AdminOnlyRoute, { AdminOnlyLink } from '../adminOnlyRoute/AdminOnlyRoute';

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <img src="/Imagem1.png" alt="" /> {/* Caminho absoluto para a nova logo */}
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");


const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [displayName, setdisplayName] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch()

  //Monitor currently sign in user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        if (user.displayName == null){
          const u1 = user.email.substring(0, user.email.indexOf("@"));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setdisplayName(uName)
        }else {
          setdisplayName(user.displayName);
        }
                
        dispatch(SET_ACTIVE_USER({
          email: user.email,
          userName: user.displayName ? user.displayName :  displayName, 
          userID: user.uid,
          
        })
        );
      } else {
        setdisplayName("");
        dispatch(REMOVE_ACTIVE_USER());        
      }
    });
  }, [dispatch, displayName]);

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  };

  const hideMenu = () => {
    setShowMenu(false)
  };

  const logoutUser = () => {
    signOut(auth).then(() => {
      toast.success("Desconectado com sucesso!")
      navigate("/")
    }).catch((error) => {
      toast.error(error.message)
    });
  };
  

  return (
    <header>
      <div className={styles.header}>{logo}     
      <nav
            className={
              showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
            }
          >
            <div
              className={
                showMenu
                  ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                  : `${styles["nav-wrapper"]}`
              }
              onClick={hideMenu}
            ></div>
        
        <ul onClick={hideMenu}>
          <li className={styles["logo-mobile"]}>
            {logo}
            <FaTimes size={22} color="#fff" onClick={hideMenu} />
          </li>
          <li>
            <AdminOnlyLink>
              <Link to="/admin/home">
              {" "}
            <button className="--btn --btn-primary">Admin</button>
              </Link>
            </AdminOnlyLink>            
          </li>
          <li>
          <NavLink to="/" className={activeLink}>
            Home
          </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={activeLink}>
              Contate-nos
            </NavLink>
          </li>
        </ul>
        <div className={styles["header-right"]} onClick={hideMenu} >
          <span className={styles.links}>
            <ShowOnLogout>
            <NavLink to="/login" className={activeLink}>
              Login
            </NavLink>
            </ShowOnLogout>
            <ShowOnLogin>
            <a href="#Home" style={{color: "#ff7722"}}>
              <FaUserCircle size={16} />
                Olá, {displayName}
            </a>
            </ShowOnLogin>
            <ShowOnLogin>
            <NavLink to="/order-history" className={activeLink}>
              
            </NavLink>            
           </ShowOnLogin>
            <ShowOnLogin>
            <NavLink to="/" onClick={logoutUser}>
              Sair
            </NavLink>
            </ShowOnLogin>
          </span>
        
        </div>
        
      </nav>
      <div className={styles["menu-icon"]}>
        
        <GiHamburgerMenu size={28} onClick={toggleMenu}/>
      </div>   
      

      </div> 
    </header>
  )
}

export default Header

