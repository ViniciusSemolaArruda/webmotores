import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { selectEmail } from '../../redux/slice/authSlice'


const AdminOnlyRoute = ({ children }) => {
    const userEmail = useSelector(selectEmail);
  
    if (userEmail === "vinicius.semola@gmail.com") {
      return children;
    }
    return(
      <section style={{height: "80vh"}}>
        <div className="container">
          <h2>Permissão negada!</h2>
          <p>Essa pagina apenas pode ser vista pelo Admin.</p>
          <br />
          <Link to="/">
            <button className="--btn">&larr; Voltar para Home </button>
          </Link>
        </div>
      </section>
    );
}

export const AdminOnlyLink = ({ children }) => {
  const userEmail = useSelector(selectEmail);

  if (userEmail === "vinicius.semola@gmail.com") {
    return children;
  }
  return null
}

export default AdminOnlyRoute
