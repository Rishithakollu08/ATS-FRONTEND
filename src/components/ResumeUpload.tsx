import { useState } from "react";
import api from "../services/api";

const ResumeUpload = () => {
    const [file, setFile] = useState<File | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        "/resume/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setScore(response.data);
    } catch (error) {
      alert("Upload failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl">
      <input

  type="file"
        className="mb-6"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
      >
        Upload Resume
      </button>

      {score !== null && (
        <div className="mt-6 text-2xl font-bold text-green-700">
          ATS Score: {score}%
        </div>
        )}
    </div>
  );
};

export default ResumeUpload;