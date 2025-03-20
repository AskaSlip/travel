"use client"
import Link from 'next/link';
import styles from  './Header.module.css';
import AuthComponent from '@/components/Auth/AuthComponent';

const HeaderComponent = () => {

  //todo пофіксити баг з рендерингом кнопок, якщо зайшов через гугл
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