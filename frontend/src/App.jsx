import { useState } from "react";

function App() {
const [file, setFile] = useState(null);
const [text, setText] = useState({});
const [loading, setLoading] = useState(false);
  const handleUpload = async () => {

  if (!file) {
    alert("Please select a file");
    return;
  }

  try {

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/extract-text", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      setText(data);

  } catch (error) {

    alert(error.message);

  } finally {

    setLoading(false);
  }
};

  return (
    <div style={styles.container}>

      <div style={styles.uploadBox}>

        <h1 style={styles.heading}>
          Manufacturing Workflow Automation
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          style={styles.button}
          onClick={handleUpload}
        >

          {loading ? "Extracting..." : "Extract Text"}

        </button>


        <div style={styles.resultBox}>

  {text.raw_text ? (
    <>
      <h2>Date: {text.date}</h2>

      <h2>Quantity: {text.quantity}</h2>

      <h3>Raw Text:</h3>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          textAlign: "left",
          fontSize: "18px",
          lineHeight: "30px",
        }}
      >
        {text.raw_text}
      </pre>
    </>
  ) : (
    <p style={{ textAlign: "center" }}>
      Upload a document to extract text
    </p>
  )}

</div>

      </div>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    fontFamily: "Arial",
  },

  uploadBox: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  heading: {
    textAlign: "center",
    color: "#1f2937",
    fontSize: "42px",
    lineHeight: "50px",
  },

  button: {
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  resultBox: {
    minHeight: "120px",
    border: "1px solid #d1d5db",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },
};

export default App;