import { useState } from "react";
import styles from "./auth.module.scss";
import registerImg from "../../assets/register.png"
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import Loader from "../../components/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate()

    const registerUser = (e) => {
        e.preventDefault();
        if (password !== cPassword) {
            toast.error("Senhas diferentes.");
            return; // Adicionamos um return aqui para evitar a execução posterior do código
        }
        setIsLoading(true)

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {            
            const user = userCredential.user;
            console.log(user)
            setIsLoading(false)
            toast.success("Registrado com sucesso!")
            navigate("/login")
        })

        .catch((error) => {
            toast.error(error.message);
            setIsLoading(false)
        })
    };
    
    return (
        <>
            <ToastContainer/>
            {isLoading && <Loader />}
            <section className={`container ${styles.auth}`}>
                <Card>
                    <div className={styles.form}>
                        <h2>Registrar</h2>

                        <form onSubmit={registerUser}>
                            <input type="text" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <input type="password" placeholder="Confirm Password" required value={cPassword} onChange={(e) => setCPassword(e.target.value)}/>
                            <button type="submit" className="--btn --btn-primary --btn-block">Registrar</button>
                        </form>
                        <span className={styles.register}>
                            <p>Já tem uma conta?</p>
                            <Link to="/login"> Login</Link>
                        </span>
                    </div>
                </Card>
                <div className={styles.img}>
                    <img src={registerImg} alt="Register" width="400" />
                </div>
            </section>
        </>
    );
};

export default Register
