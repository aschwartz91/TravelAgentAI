/*
A. Schwartz
4/18/23

Much of this project setup comes from OpenAI's API documentation and template guidelines.
View this link to find the source for the API: https://openai.com/blog/openai-api
*/

import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [tripInput, setTripInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trip: tripInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setTripInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <header>
        <title>Virtual Travel Agent</title>
        <link rel="icon" href="/plane.png" />
      </header>

      <main className={styles.main}>
        <img src="/plane.png" className={styles.icon} />
        <h3>Virtual Travel Agent</h3>
        
        <form onSubmit={onSubmit}>
        Enter your destination, the number of days and any special activities you'd like to do separated with semicolons:
        
          <input type="text" name="trip" placeholder="i.e. Tokyo; 3 days; biking" value={tripInput} onChange={(e) => setTripInput(e.target.value)}/>
          <input type="submit" value="Generate Itinerary"/>
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
