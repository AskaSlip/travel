import Link from 'next/link';
import AuthComponent from '@/components/Auth/AuthComponent';
import styles from  './Header.module.css';

const HeaderComponent = () => {

  return(
    <div className={styles.wrap}>
      <div>
        <p>left</p>
        <Link href={'/test'}>test</Link>
        <br/>
        <Link href={'/'}>home</Link>

      </div>
      <div>
        <p>right</p>
        <AuthComponent/>
      </div>

    </div>

  )
};

export default HeaderComponent;