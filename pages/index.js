import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="./todo">Next.js!</a>
        </h1>
      </main>

      <footer className={styles.footer}>
        Created with&nbsp;<b>next.new</b>&nbsp;⚡️
      </footer>
    </div>
  );
}
