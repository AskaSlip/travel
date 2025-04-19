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
        <br/>
        <Link href={'/change-password'}>change password</Link>
        <br/>
        <Link href={'/create-trip'}>create trip</Link>
        <br/>
        <Link href={'/trips'}>my trips</Link>

      </div>
      <div>
        <p>right</p>
        <AuthComponent/>
      </div>

    </div>

  )
};

export default HeaderComponent;