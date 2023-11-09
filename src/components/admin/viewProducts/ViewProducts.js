import {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import styles from "./ViewProducts.module.scss"
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../../firebase/config";
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Loader from '../../loader/Loader';
//import { async } from '@firebase/util';
import { ref, deleteObject,   } from "firebase/storage";
import Notiflix from 'notiflix';
import { useDispatch } from 'react-redux';
import { STORE_PRODUCTS } from '../../../redux/slice/productSlice';
//import useFetchCollection from '../../../customHooks/useFetchCollection';

const ViewProducts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
      getProducts();
    }, []);

    const getProducts = () => {
      setIsLoading(true);
  
      try{
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
  
        onSnapshot(q, (snapshot) => {
        // console.log(snapshot.docs); 
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // 
        
        setProducts(allProducts);
        setIsLoading(false);
        dispatch(
          STORE_PRODUCTS({
         products: allProducts,
          })
         )
      }, []);
        
    
      } catch(error){
        setIsLoading(false)
        toast.error(error.message)
      }
    };
  


  

  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      'Deletar Produto!',
      'Você tem certeza disso?',
      'Sim',
      'Cancelar',
      function okCb() {
       deleteProduct(id, imageURL)
       console.log("Produto deletado!");
      },
      function cancelCb() {
      console.log("Cancelado!");
      },
      {
        width: '320px',
        borderRadius: '3px',
        titleColor: "orangered",
        okButtonBackground: "orangered",
        CSSAnimationStyle: "zoom",
      },
      );
  }

  const deleteProduct = async(id, imageURL) => {
    try{
      await deleteDoc(doc(db, "products", id));

      const storageRef = ref(storage, imageURL);
      await deleteObject(storageRef)
      toast.success("Produto deletado com sucesso!")

    } catch(error){
      toast.error(error.message)
    }
  }

   
  return (
    <>
     {isLoading && <Loader />} 
      <div className={styles.table}>
        <h2>Todos os produtos</h2>

        {products.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const { id, name, price, imageURL, category } = product;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={imageURL}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>{`$${price}`}</td>
                    <td className={styles.icons}>
                      <Link to={`/admin/add-product/${id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(id, imageURL)}
                      />
                    </td>
                  </tr>  
                                
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default ViewProducts
