import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import * as styles from "./index.css";
import { FileTree } from "../components/FileTree";
import { Graph } from "../components/Graph/Graph";

type Module = {
  source: string;
  references: string[];
};

type IndexProps = {
  modules: Module[];
};

const Index: NextPage<IndexProps> = ({ modules }) => {
  const [searchTarget, setSearchTarget] = useState("");

  return (
    <main className={styles.main}>
      <FileTree
        files={modules.map((mod) => mod.source)}
        onClickFile={setSearchTarget}
      />
      <Graph modules={modules} target={searchTarget} />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  const res = await fetch("http://localhost:3000/api/modules/scan");
  const { modules } = await res.json();

  return {
    props: {
      modules: modules,
    },
  };
};

export default Index;
