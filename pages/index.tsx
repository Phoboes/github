import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Graph from "../Components/GithubGraph";
import Heading from "../Components/Heading";
import { server } from "../config";

export default function Home({ languages }) {
  return (
    <div className={styles.container}>
      <Heading />
      <Graph languages={languages} />
    </div>
  );
}

Home.getInitialProps = async () => {
  const res = await fetch(`${server}/api/github`);
  const json = await res.json();
  return { languages: json };
};
