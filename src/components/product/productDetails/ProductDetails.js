import styles from "./ProductDetails.module.scss"
import { async } from '@firebase/util';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { db } from '../../../firebase/config';
import spinnerImg from "../../../assets/spinner.jpg"

const ProductDetails = () => {
  const {id} = useParams();
  const [product, setProduct] = useState(null);

  const getProduct = async () => {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      // console.log("Document data:", docSnap.data());
      const obj = {
        id: id,
        ...docSnap.data()
      }
      setProduct(obj)
    
    } else{
      toast.error("Produto não encontrado")
    }
  };

  useEffect(() => {
    getProduct();
  }, []); 

  const handleContactOwner = () => {
    const ownerEmail = 'vinicius.semola@gmail.com'; // Adicione o endereço de e-mail do proprietário aqui
    const subject = 'Assunto do E-mail';
    const body = 'Corpo do E-mail';
    const userEmail = document.getElementById('email').value;
  
    const mailtoLink = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(userEmail)}`;
    window.open(mailtoLink);
  };
  

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <h2>Detalhes do Produto</h2>
        <div>
          <Link to="/#products">&larr; Voltar para a lista de produtos</Link>
        </div>
        {product === null ? (
          <img src={spinnerImg} alt="Loading" style={{width:"50px"}}/>
        ): (
          <>
            <div className={styles.details}>
              <div className={styles.img}>
                  <img src={product.imageURL} alt={product.name} />
              </div>
              <div className={styles.content}>
                  <h3>{product.name}</h3>
                  <p className={styles.price}>{`R$${product.price}`}</p>
                  <p>{product.desc}</p>
                  <p>
                    <b>SKU</b> {product.id}
                  </p>
                  <p>
                    <b>Marca</b> {product.brand}
                  </p>
                  <div className={styles.count}>

                {/* <div className={styles.count}></div> */}
                <div className={`${styles.count} ${styles.customEmailSection}`}>
                  
                  <div className={styles.emailInput}>
                    <label htmlFor="email">Seu E-mail:</label>
                    <input type="email" id="email" name="email" />
                    <button className="--btn --btn-danger">Falar com proprietário</button>
                  </div>
                </div>

                  </div>
                  {/* <button className="--btn --btn-danger">Falar com propietário</button> */}
                  </div>
              
            </div>
          </>
        )}
      </div>
    </section>
  )
}


export default ProductDetails

