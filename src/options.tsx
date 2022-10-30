import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Options = () => {
  const [promocode, setPromocode] = useState<string>("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        promocode: "",
      },
      (items) => {
        setPromocode(items.promocode)
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        promocode: promocode,
      },
      () => {
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <>
      <p>
        <div>
          Промокод
        </div>
        <div>
          <input value={promocode} onChange={(ev) => setPromocode(ev.target.value)} size={30} />
        </div>
      </p>
      <p>
        <div>{status}</div>
        <button onClick={saveOptions}>Save</button>
      </p>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);