import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../../components/admin/navbar/Navbar'
import Home from '../home/Home'
import OrderDetails from "../../components/admin/orderDetails/OrderDetails";
import Orders from "../../components/admin/orders/Orders";
import ViewProducts from "../../components/admin/viewProducts/ViewProducts";
import AddProduct from "../../components/admin/addProduct/AddProduct";
import styles from "./Admin.module.scss"

const Admin = () => {
  return ( <div className={styles.Admin}>
    <div className={styles.Navbar}>
      <Navbar />
    </div>
    <div className={styles.content}>
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="all-products" element={<ViewProducts />} />
        <Route path="add-product/:id" element={<AddProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order-details/:id" element={<OrderDetails />} />
      </Routes>

    </div>
  </div>
    
  )
}

export default Admin


