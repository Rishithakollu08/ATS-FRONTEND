import { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobSkills, setJobSkills] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMessage(`Selected File: ${selectedFile.name}`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const skillsArray = jobSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      skillsArray.forEach((skill) => {
        formData.append("jobSkills", skill);
      });

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/resume/analyze", // ✅ fixed endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ JWT token attached
          },
        }
      );

      setScore(response.data);
      setMessage("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>ATS Resume Upload</h2>

      {/* ✅ Label trick — most reliable way to open file explorer */}
      <label htmlFor="resume-file" style={{ cursor: "pointer" }}>
        <div
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#4f46e5",
            color: "white",
            borderRadius: "6px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          📄 Choose Resume
        </div>
      </label>

      <input
        id="resume-file"
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <br />

      {/* Skills Input */}
      <input
        type="text"
        placeholder="Enter job skills (Java, React, SQL)"
        value={jobSkills}
        onChange={(e) => setJobSkills(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          marginTop: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <br />
      <br />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        style={{
          padding: "10px 24px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Upload &amp; Analyze
      </button>

      <br />
      <br />

      {/* Message */}
      {message && <p style={{ color: file ? "green" : "red" }}>{message}</p>}

      {/* ATS Score */}
      {score !== null && (
        <h3 style={{ color: "#4f46e5" }}>ATS Score: {score}%</h3>
      )}
    </div>
  );
};

export default ResumeUpload;