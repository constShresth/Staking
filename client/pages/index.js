import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import StakeDetails from "../components/StakeDetails";
import StakeForm from "../components/StakeForm";
import { useState } from "react";
import { Loading } from "web3uikit";

export default function Home() {
  const [receipt, setReceipt] = useState("");

  return (
    <main className="bg-gradient-to-r from-zinc-300 to-indigo-600">
      <div className={` ${styles.container}`}>
        <Header />
        <StakeDetails receipt={receipt} setReceipt={setReceipt} />
        {receipt === "Loading" ? (
          <div
            style={{
              backgroundColor: "#ECECFE",
              borderRadius: "8px",
              padding: "80px",
            }}
            className="flex justify-center"
          >
            <Loading
              direction="bottom"
              fontSize={25}
              size={48}
              spinnerColor="#131a40"
              spinnerType="wave"
              text="Loading"
            />
          </div>
        ) : (
          <StakeForm receipt={receipt} setReceipt={setReceipt} />
        )}
      </div>
    </main>
  );
}
