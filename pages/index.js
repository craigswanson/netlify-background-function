import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

async function onSubmit(event) {
  event.preventDefault();
  try {
    const response = await fetch("/.netlify/functions/generator-background", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ animal: animalInput }),
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Log the response text for debugging purposes
    const responseText = await response.text();
    console.log("Response text:", responseText);

    // Parse the response text as JSON
    const data = JSON.parse(responseText);

    setResult(data.result);
    setAnimalInput("");
  } catch (error) {
    // Consider implementing your own error handling logic here
    console.error(error);
    alert(error.message);
  }
}

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
