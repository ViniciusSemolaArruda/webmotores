import React, {useState } from "react";
import styles from "./ProductList.module.scss";
import { BsFillGridFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
//import Search from "../../search/Search";
import ProductItem from "../productItem/ProductItem";



const ProductList = ({products}) => {
  const [grid, setGrid] = useState(true)
  const [search, setSearch] = useState("")

  return (
    <div className={styles["product-list"]} id="product">
      <div className={styles.top}>
        <div className={styles.icons}>
          <BsFillGridFill
            size={22}
            color="orangered"
            onClick={() => setGrid(true)}
          />

          <FaListAlt size={24} color="#0066d4" onClick={() => setGrid(false)} />

          <p>
            <b>10</b> Produtos encontrados.
          </p>
        </div>
        {/* Search Icon */}
        <div>
        {/*  <Search value={search} onChange={(e) => setSearch(e.target.value)}/>*/}
        </div>
        {/* Sort Products */}
        {/* <div className={styles.sort}>
          <label>Ordenar por:</label>
          <select className={styles.sort}>
            <option value="latest">Último</option>
            <option value="lowest-price">Maior Preço</option>
            <option value="highest-price">Maior Preço</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div> */}
      </div>

      <div className={grid ? `${styles.grid}` : `${styles.list}`}>
        {products.lenght === 0 ? (
          <p>No product found.</p>
        ) : (
          <>
            {products.map((product) => {
              return (
                <div key={product.id}>
                  <ProductItem {...product} grid={grid} product={product} />
                </div>
              );
            })}
          </>
        )}
        {/* <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
        /> */}
      </div>
    </div>
    
  )
}


export default ProductList
