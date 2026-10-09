import { dataFromSeed, signatureLetters } from './signature';
import styles from './Signature.module.css';

export default function Signature({ seed, data, shared = false, small = false, className = '', as: Tag = 'span' }) {
  const letters = signatureLetters(data ?? dataFromSeed(seed), { shared, thinWeight: small ? 300 : 140 });
  return (
    <Tag className={`${styles.signature} ${className}`} aria-label="L20N" role="img">
      {letters.map(({ letter, style }, i) => (
        <span key={i} className={styles.letter} style={style} aria-hidden="true">
          {letter}
        </span>
      ))}
    </Tag>
  );
}
