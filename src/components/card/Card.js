import styles from "./Card.module.scss";

const Card = ({ children, cardClass }) => {
  return <div className={`${styles.Card} ${cardClass}`}>{children}</div>;
};

export default Card;