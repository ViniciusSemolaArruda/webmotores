import { addDoc, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db, storage } from '../../../firebase/config';
import Card from '../../card/Card';
import styles from "./AddProduct.module.scss"
import Loader from "../../loader/Loader";
import { useSelector } from 'react-redux';
import { selectProducts } from '../../../redux/slice/productSlice';


const categories = [
  {id: 1, name: "Saco de Lixo"},
  {id: 2, name: "Detergente"},
  {id: 3, name: "Limpeza geral"},
  {id: 4, name: "Limpeza geral"},
]

const initialState = {
  name: "",
  imageURL: "",
  price: 0,
  category: "",
  brand: "",
  desc: "",
}

const AddProduct = () => {
  const {id} = useParams()
  const products = useSelector(selectProducts)
  const productEdit = products.find((item) => item.id === id)
  console.log(productEdit)  

  const [product, setProduct] = useState(() => {
    const newState = detectForm(id, 
      { ...initialState},
      productEdit
      )
      return newState
  });

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  

  function detectForm(id, f1, f2) {
    if (id === "ADD"){
      return f1;
    }
    return f2;
  }


  const handleInputChange = (e) => {
    const {name, value} = e.target
    setProduct({...product, [name]: value})
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    // console.log(file);

    const storageRef = ref(storage, `images/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

  

  uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setUploadProgress(progress)    
  },
  (error) => {
    toast.error(error.message)
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setProduct({...product, imageURL: downloadURL})
      toast.success("Imagem enviada com sucesso!")
    });
  }
);
  };

  const AddProduct = (e) => {
    e.preventDefault()
    // console.log(product);
    setIsLoading(true)
  
    try {
      const docRef = addDoc(collection(db, "products"), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: Timestamp.now().toDate()        
      });
      setIsLoading(false);
      setUploadProgress(0)
      setProduct({...initialState})

      toast.success("Produto salvo com sucesso!")
      navigate("/admin/all-products")
    } catch(error){
      setIsLoading(false)
      toast.error(error.message)
    }
  }

  const editProduct = (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (product.imageURL !== productEdit.imageURL) {
      const storageRef = ref(storage, productEdit.imageURL);
      deleteObject(storageRef);
    }

    try{
      
      setDoc(doc(db, "products", id), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: productEdit.createdAt,
        editedAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      toast.success("Product Edited Successfully");
      navigate("/admin/all-products");
    } catch(error){
      setIsLoading(false)
      toast.error(error.message)
    }
  }

  return (
    <>
    {isLoading && <Loader/>}
    <div className={styles.product}>
    <h2>{detectForm(id, "Adicionar novo Produto", "Editar Produto")}</h2>
      <Card cardClass={styles.Card}>

        <form onSubmit= {detectForm(id, AddProduct, editProduct)}>
        <label>Nome do Produto:</label>
        <input type="text" placeholder="Product name" required name="name" value={product.name} onChange={(e) => handleInputChange(e)}/>

        <label>Imagem do Produto:</label>
        <Card cardClass={styles.group}>
          {uploadProgress === 0 ? null : (
            <div className={styles.progress}>

            <div className={styles["progress-bar"]}
            style={{width: `${uploadProgress}%`}}>
              {uploadProgress < 100 ? `Uploading ${uploadProgress}` : `Upload Complet ${uploadProgress}%`}
            </div>
          </div>
          )}
          

          <input type="file" accept="image/*" placeholder="Product Image" name="image" onChange={(e) => handleImageChange(e)}/>

          {product.imageURL === "" ? null : (
            <input type="text" //required 
            placeholder="Image URL"
            name="imageURL" 
            value={product.imageURL} 
            disabled
            />
          )}
        </Card>
        <label>Preço do Produto:</label>
        <input type="number" 
        placeholder="Product price" 
        required name="price" 
        value={product.price} 
        onChange={(e) => handleInputChange(e)}
        />

        <label>Product Categoria:</label>
            <select
              required
              name="category"
              value={product.category}
              onChange={(e) => handleInputChange(e)}
            >
              <option value="" disabled>
                -- Escolha a categoria do produto --
              </option>
              {categories.map((cat) => {
                return (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                );
              })}
            </select>

        <label>Empresa/Marca do produto:</label>
        <input type="text" placeholder="Product brand" required name="brand" value={product.brand} onChange={(e) => handleInputChange(e)}/>

        <label>Descrição do Produto</label>
        <textarea name="desc" required value={product.desc} onChange={(e) => handleInputChange(e)} cols="30" rows="10"></textarea>

        <button className="--btn --btn-primary">{detectForm(id, "Adicionar novo Produto", "Editar Produto")}</button>
                 
        </form>
      </Card>
    </div>
    </>
  )
}

export default AddProduct