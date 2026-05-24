import { useState, useRef } from "react";
import axios from "axios";

interface ResourceLink {
  label: string;
  url: string;
  type: "youtube" | "docs" | "roadmap" | "practice";
}

interface AtsResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeSkills: string[];
  recommendations: Record<string, ResourceLink[]>;
  learningPlan: Record<string, ResourceLink[]>;
}

const TYPE_CONFIG = {
  youtube:  { icon: "▶", label: "YouTube",  color: "#f87171", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.3)"  },
  docs:     { icon: "📄", label: "Docs",     color: "#60a5fa", bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.3)"  },
  roadmap:  { icon: "🗺", label: "Roadmap",  color: "#34d399", bg: "rgba(5,150,105,0.08)",  border: "rgba(5,150,105,0.3)"  },
  practice: { icon: "⚡", label: "Practice", color: "#fbbf24", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.3)"  },
};

const ResourceButton = ({ resource }: { resource: ResourceLink }) => {
  const cfg = TYPE_CONFIG[resource.type] ?? TYPE_CONFIG.docs;
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "13px 18px", borderRadius: 14,
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        color: cfg.color, textDecoration: "none",
        fontSize: 13.5, fontWeight: 600,
        transition: "all 0.2s", cursor: "pointer",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = "translateX(5px)";
        el.style.boxShadow = `0 4px 16px ${cfg.border}`;
        el.style.borderColor = cfg.color;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = "translateX(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = cfg.border;
      }}
    >
      <span style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: `${cfg.color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15,
      }}>{cfg.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 1 }}>
          {cfg.label}
        </div>
        <div>{resource.label}</div>
      </div>
      <span style={{ fontSize: 16, opacity: 0.5 }}>↗</span>
    </a>
  );
};

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobSkills, setJobSkills] = useState("");
  const [result, setResult] = useState<AtsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openFileExplorer = () => fileInputRef.current?.click();

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setMessage("");
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) { setMessage("Please select a resume file first."); return; }
    if (!jobSkills.trim()) { setMessage("Please enter job skills."); return; }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      jobSkills.split(",").map((s) => s.trim()).filter(Boolean)
        .forEach((skill) => formData.append("jobSkills", skill));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/resume/analyze`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const data: AtsResult = response.data;
      setResult(data);
      const firstSkill = Object.keys(data.learningPlan || {})[0] || "";
      setActiveTab(firstSkill);
    } catch (error) {
      console.log(error);
      setMessage("Analysis failed. Backend may not be running.");
    } finally {
      setLoading(false);
    }
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const scoreColor = (s: number) => s >= 75 ? "#4ade80" : s >= 50 ? "#facc15" : "#f87171";
  const scoreLabel = (s: number) => s >= 75 ? "Excellent Match" : s >= 50 ? "Moderate Match" : "Low Match";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#060b18 0%,#0d1528 50%,#060b18 100%)",
      color: "white", fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scoreIn { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }

        .card {
          background: linear-gradient(145deg,#111827,#0f1929);
          border: 1px solid #1e2d45; border-radius: 20px; padding: 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
          animation: fadeUp 0.45s ease both; transition: border-color 0.3s;
        }
        .card:hover { border-color: #2d3f5e; }

        .upload-zone {
          border: 2px dashed #334155; border-radius: 16px; min-height: 200px;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          cursor: pointer; transition: all 0.3s; background: rgba(15,23,42,0.6);
        }
        .upload-zone:hover, .upload-zone.drag { border-color: #6366f1; background: rgba(99,102,241,0.05); }

        .btn {
          width: 100%; padding: 16px; border: none; border-radius: 14px;
          background: linear-gradient(135deg,#4f46e5,#7c3aed); color: white;
          font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 18px; transition: all 0.25s;
        }
        .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        textarea {
          width: 100%; margin-top: 16px; padding: 14px 16px; border-radius: 12px;
          border: 1px solid #1e2d45; background: rgba(15,23,42,0.8); color: #e2e8f0;
          resize: none; min-height: 100px; font-size: 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit;
        }
        textarea:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        textarea::placeholder { color: #475569; }

        .skill { display: inline-block; padding: 6px 14px; border-radius: 999px; margin: 4px; font-size: 12.5px; font-weight: 600; }
        .matched { background: rgba(5,46,22,0.7); color: #4ade80; border: 1px solid rgba(22,101,52,0.8); }
        .missing  { background: rgba(69,10,10,0.7); color: #f87171; border: 1px solid rgba(153,27,27,0.8); }

        .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 16px; }

        .results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 28px; }
        .full-width { grid-column: 1 / -1; }

        .skill-tab {
          padding: 8px 20px; border-radius: 999px; border: 1px solid #1e2d45;
          background: transparent; color: #94a3b8; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .skill-tab:hover { border-color: #4f46e5; color: #a5b4fc; }
        .skill-tab.active {
          background: linear-gradient(135deg,#4f46e5,#7c3aed); border-color: transparent;
          color: white; box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }

        .progress-bar-bg { width: 100%; height: 6px; background: #1e2d45; border-radius: 999px; margin-top: 14px; overflow: hidden; }
        .progress-bar-fill { height: 100%; border-radius: 999px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }

        .ai-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: linear-gradient(135deg,#1e1b4b,#2e1065);
          border: 1px solid rgba(139,92,246,0.3); color: #a78bfa;
          font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px;
          text-transform: uppercase; letter-spacing: 0.5px; margin-left: 10px;
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        padding: "18px 40px", borderBottom: "1px solid #0f1929",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(6,11,24,0.95)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>⚡</div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#a5b4fc", letterSpacing: "-0.5px" }}>ATSPro</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#0f1929", padding: "8px 16px", borderRadius: 999,
          border: "1px solid #1e2d45", fontSize: 13, color: "#94a3b8",
        }}>
          <span style={{ color: "#4ade80", fontSize: 10 }}>●</span>
          {user?.email || "User"}
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.5px" }}>Resume Analyzer</h1>
          <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
            Upload your resume and get AI-powered ATS insights with real learning resources
          </p>
        </div>

        {/* UPLOAD CARD */}
        <div className="card">
          <div className="section-title">Upload Resume</div>
          <div
            className={`upload-zone ${dragOver ? "drag" : ""}`}
            onClick={openFileExplorer}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragOver(false);
              if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]);
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 10 }}>{file ? "📋" : "📄"}</div>
            {file ? (
              <>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#a5b4fc" }}>{file.name}</div>
                <div style={{ marginTop: 4, color: "#475569", fontSize: 13 }}>{(file.size / 1024).toFixed(1)} KB</div>
                <div style={{
                  marginTop: 10, fontSize: 11, color: "#4ade80",
                  background: "rgba(5,46,22,0.5)", border: "1px solid #166534",
                  padding: "3px 12px", borderRadius: 999, fontWeight: 700,
                }}>✓ File Ready</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 15, color: "#94a3b8", fontWeight: 600 }}>Click or drag & drop your resume</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>PDF, DOCX supported</div>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" hidden
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
          <textarea
            placeholder="Enter required job skills separated by commas (e.g. Java, React, SQL, Docker, AWS...)"
            value={jobSkills}
            onChange={(e) => setJobSkills(e.target.value)}
          />
          <button className="btn" onClick={handleUpload} disabled={loading}>
            {loading ? "⚙️  Analyzing with Spring AI..." : " Analyze Resume"}
          </button>
          {message && (
            <div style={{ marginTop: 14, color: "#f87171", fontWeight: 600, fontSize: 13 }}>⚠️ {message}</div>
          )}
        </div>

        {/* RESULTS */}
        {result && (
          <div className="results-grid">

            {/* SCORE */}
            <div className="card" style={{ animationDelay: "0s" }}>
              <div className="section-title">ATS Score</div>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{
                  width: 130, height: 130, borderRadius: "50%", flexShrink: 0,
                  background: `conic-gradient(${scoreColor(result.score)} ${result.score * 3.6}deg, #1e2d45 0deg)`,
                  boxShadow: `0 0 28px ${scoreColor(result.score)}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 104, height: 104, borderRadius: "50%",
                    background: "linear-gradient(145deg,#111827,#0f1929)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      fontSize: 46, fontWeight: 800, color: scoreColor(result.score), lineHeight: 1,
                      animation: "scoreIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
                    }}>{result.score}</div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>/100</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: scoreColor(result.score), marginBottom: 6 }}>
                    {scoreLabel(result.score)}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                    {result.matchedSkills.length} of {result.matchedSkills.length + result.missingSkills.length} required skills matched.
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{
                      width: `${result.score}%`,
                      background: `linear-gradient(90deg,${scoreColor(result.score)},${scoreColor(result.score)}88)`,
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* MATCHED */}
            <div className="card" style={{ animationDelay: "0.07s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Matched Skills</div>
                <span style={{ background: "rgba(5,46,22,0.7)", color: "#4ade80", border: "1px solid #166534", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                  ✓ {result.matchedSkills.length} found
                </span>
              </div>
              {result.matchedSkills.length > 0
                ? result.matchedSkills.map((s) => <span key={s} className="skill matched">✓ {s}</span>)
                : <div style={{ color: "#475569", fontSize: 14 }}>No matched skills found.</div>}
            </div>

            {/* MISSING */}
            <div className="card" style={{ animationDelay: "0.12s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Missing Skills</div>
                <span style={{ background: "rgba(69,10,10,0.7)", color: "#f87171", border: "1px solid #991b1b", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                  ✗ {result.missingSkills.length} gaps
                </span>
              </div>
              {result.missingSkills.length > 0
                ? result.missingSkills.map((s) => <span key={s} className="skill missing">✗ {s}</span>)
                : <div style={{ color: "#4ade80", fontSize: 14 }}>🎉 No missing skills — perfect match!</div>}
            </div>

            {/* ✅ LEARNING RESOURCES — tabbed per skill, clickable buttons */}
            {result.learningPlan && Object.keys(result.learningPlan).length > 0 && (
              <div className="card full-width" style={{ animationDelay: "0.18s" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                  <div className="section-title" style={{ marginBottom: 0 }}>Learning Resources</div>
                  <span className="ai-badge">✦ Spring AI</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", marginBottom: 22, lineHeight: 1.6 }}>
                  AI-generated resources for each missing skill. Click any button to open YouTube, official docs, roadmaps, or practice platforms.
                </p>

                {/* SKILL TABS */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
                  {Object.keys(result.learningPlan).map((skill) => (
                    <button
                      key={skill}
                      className={`skill-tab ${activeTab === skill ? "active" : ""}`}
                      onClick={() => setActiveTab(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                {/* RESOURCE BUTTONS */}
                {activeTab && result.learningPlan[activeTab] && (
                  <>
                    {/* Legend row */}
                    <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 18 }}>
                      {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                        <div key={type} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
                          <span style={{ color: cfg.color }}>{cfg.icon}</span>
                          <span style={{ textTransform: "capitalize" }}>{cfg.label}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: 10,
                    }}>
                      {result.learningPlan[activeTab].map((resource, i) => (
                        <ResourceButton key={i} resource={resource} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* RECOMMENDATIONS */}
            {result.recommendations && Object.keys(result.recommendations).length > 0 && (
              <div className="card full-width" style={{ animationDelay: "0.24s" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                  <div className="section-title" style={{ marginBottom: 0 }}>Skill Recommendations</div>
                  <span className="ai-badge">✦ Spring AI</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                  {Object.entries(result.recommendations).map(([skill, resources]) => (
                    <div key={skill}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        fontSize: 13, fontWeight: 700, color: "#a78bfa",
                        marginBottom: 10, paddingBottom: 8,
                        borderBottom: "1px solid rgba(167,139,250,0.15)",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                        {skill}
                      </div>
                      {resources.map((resource, i) => (
                        <ResourceButton key={i} resource={resource} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;