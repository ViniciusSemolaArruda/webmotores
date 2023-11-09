import styles from "./auth.module.scss"
import React, { useState } from 'react'
import { Link } from "react-router-dom"
import resetImg from "../../assets/forgot.png"
import Card from '../../components/card/Card'
import { toast } from "react-toastify"
import { auth } from "../../firebase/config"
import { sendPasswordResetEmail } from "firebase/auth"
import Loader from "../../components/loader/Loader"

const Reset = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const resetPassword = (e) => {
        e.preventDefault();
        setIsLoading(true)
        
        sendPasswordResetEmail(auth, email)
    .then(() => {
        setIsLoading(false)
        toast.success("Cheque seu email para mudar a senha.")
    })
    .catch((error) => {
        setIsLoading(false)
        toast.error(error.message)
    });
    }

  return (
    <>
        {isLoading && <Loader />}
        <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
            <img src={resetImg} alt="Reset Password" width="400" />
        </div>

        <Card>
        <div className={styles.form}>
            <h2>Resetar Senha</h2>

            <form onSubmit={resetPassword}>
                <input type="text" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                <button type="submit" className="--btn --btn-primary --btn-block">Resetar Senha</button>
                <div className={styles.links}>
                    <p>
                    <Link to="/login">- Login</Link>
                    </p>
                    <p>
                    <Link to="/register">- Registrar</Link>
                    </p>
                </div>
            </form>
        </div>
        </Card>
        </section>
    </>
  )
}

export default Reset
