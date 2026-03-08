import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({ baseURL: `http://${window.location.hostname}:5000` });

// ─── Floating particles background ───────────────────────────────────────────
const Particles = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    {[...Array(18)].map((_, i) => (
      <div key={i} style={{
        position: "absolute",
        width: `${6 + (i % 5) * 4}px`,
        height: `${6 + (i % 5) * 4}px`,
        borderRadius: "50%",
        background: `hsla(${30 + i * 20}, 80%, 65%, ${0.08 + (i % 3) * 0.04})`,
        left: `${(i * 37 + 11) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        animation: `float${i % 3} ${6 + (i % 4) * 2}s ease-in-out infinite`,
        animationDelay: `${i * 0.4}s`,
      }} />
    ))}
    <style>{`
      @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(180deg)} }
      @keyframes float1 { 0%,100%{transform:translateY(0) translateX(0)} 33%{transform:translateY(-15px) translateX(10px)} 66%{transform:translateY(10px) translateX(-8px)} }
      @keyframes float2 { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.3) rotate(90deg)} }
    `}</style>
  </div>
);

// ─── Input ────────────────────────────────────────────────────────────────────
const Input = ({ label, type = "text", value, onChange, placeholder, icon }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#a0a0b0", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.5 }}>{icon}</span>}
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: `13px ${isPassword ? "44px" : "14px"} 13px ${icon ? "42px" : "14px"}`,
            background: focused ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${focused ? "rgba(251,146,60,0.7)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "12px", color: "#f0f0f0", fontSize: "15px",
            fontFamily: "'DM Sans', sans-serif",
            outline: "none", transition: "all 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(251,146,60,0.12)" : "none",
          }}
        />
        {isPassword && (
          <button onClick={() => setShow(!show)} type="button" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a0a0b0", fontSize: "16px", padding: "4px" }}>
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Alert ────────────────────────────────────────────────────────────────────
const Alert = ({ msg, type }) => msg ? (
  <div style={{
    padding: "11px 14px", borderRadius: "10px", marginBottom: "16px", fontSize: "13.5px",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    background: type === "error" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
    border: `1px solid ${type === "error" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
    color: type === "error" ? "#fca5a5" : "#86efac",
  }}>{type === "error" ? "⚠️" : "✅"} {msg}</div>
) : null;

// ─── Button ───────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, loading, secondary }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={loading}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", padding: "14px",
        background: secondary ? "transparent"
          : hov ? "linear-gradient(135deg, #fb923c, #f97316)"
          : "linear-gradient(135deg, #f97316, #ea580c)",
        border: secondary ? "1.5px solid rgba(255,255,255,0.15)" : "none",
        borderRadius: "12px", color: "#fff", fontSize: "15px",
        fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1, transition: "all 0.2s",
        transform: hov && !loading ? "translateY(-1px)" : "none",
        boxShadow: !secondary && !loading ? (hov ? "0 8px 25px rgba(249,115,22,0.45)" : "0 4px 15px rgba(249,115,22,0.3)") : "none",
        letterSpacing: "0.02em",
      }}
    >
      {loading ? "⏳ Please wait..." : children}
    </button>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = ({ children }) => (
  <div style={{
    width: "420px", maxWidth: "calc(100vw - 32px)",
    background: "rgba(18,18,28,0.85)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px", padding: "40px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
  }}>{children}</div>
);

// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo = ({ size = "md" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: size === "lg" ? "32px" : "24px" }}>
    <div style={{
      width: size === "lg" ? 48 : 38, height: size === "lg" ? 48 : 38,
      background: "linear-gradient(135deg, #f97316, #ea580c)",
      borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size === "lg" ? 24 : 18, boxShadow: "0 4px 15px rgba(249,115,22,0.4)",
    }}>⚡</div>
    <span style={{ fontSize: size === "lg" ? 28 : 22, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>TaskFlow</span>
  </div>
);

// ─── Center wrapper ───────────────────────────────────────────────────────────
const Center = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 1 }}>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — Welcome
// ═══════════════════════════════════════════════════════════════════════════════
const WelcomeScreen = ({ onLogin, onSignup }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", maxWidth: "560px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <Logo size="lg" />
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#fb923c", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>
          Your productivity companion
        </div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", fontFamily: "'Syne', sans-serif", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
          Organize your day,<br />
          <span style={{ background: "linear-gradient(135deg, #fb923c, #f97316, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            own your time.
          </span>
        </h1>
        <p style={{ fontSize: "16px", color: "#9090a8", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginBottom: "40px" }}>
          Track tasks across Work, Study, Health & Personal. Stay on top of deadlines, visualize progress, and build better habits — all in one place.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px" }}>
          <div style={{ width: "220px" }}><Btn onClick={onSignup}>🚀 Get Started — It's Free</Btn></div>
          <div style={{ width: "140px" }}><Btn onClick={onLogin} secondary>Sign In</Btn></div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "28px", flexWrap: "wrap" }}>
          {[["📋", "Smart Tasks"], ["📊", "Analytics"], ["🔔", "Reminders"], ["🔒", "Secure"]].map(([icon, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: "#707088" }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — Sign Up
// ═══════════════════════════════════════════════════════════════════════════════
const SignupScreen = ({ onSuccess, onLogin }) => {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    setAlert(null);
    if (!identifier || !password) return setAlert({ type: "error", msg: "Please fill in all required fields." });
    if (password.length < 6) return setAlert({ type: "error", msg: "Password must be at least 6 characters." });
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, identifier, password });
      if (data.success) {
        localStorage.setItem("tf_token", data.data.token);
        localStorage.setItem("tf_user", JSON.stringify(data.data.user));
        setAlert({ type: "success", msg: "Account created! Redirecting..." });
        setTimeout(() => onSuccess(), 900);
      }
    } catch (e) {
      setAlert({ type: "error", msg: e.response?.data?.message || "Registration failed. Try again." });
    } finally { setLoading(false); }
  };

  return (
    <Center>
      <Card>
        <Logo />
        <h2 style={{ textAlign: "center", color: "#fff", margin: "0 0 6px", fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700 }}>Create your account</h2>
        <p style={{ textAlign: "center", color: "#707088", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", marginBottom: "28px" }}>Join TaskFlow and take control of your time</p>
        <Alert msg={alert?.msg} type={alert?.type} />
        <Input label="Your Name (optional)" value={name} onChange={setName} placeholder="e.g. Alex Johnson" icon="👤" />
        <Input label="Email or Mobile Number *" value={identifier} onChange={setIdentifier} placeholder="you@email.com or 9876543210" icon="📧" />
        <Input label="Password *" type="password" value={password} onChange={setPassword} placeholder="Min. 6 characters" icon="🔑" />
        <div style={{ marginBottom: "20px" }} />
        <Btn onClick={handleSubmit} loading={loading}>Create Account</Btn>
        <p style={{ textAlign: "center", marginTop: "20px", color: "#606070", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
          Already have an account?{" "}
          <span onClick={onLogin} style={{ color: "#fb923c", cursor: "pointer", fontWeight: 600 }}>Sign In</span>
        </p>
      </Card>
    </Center>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — Login
// ═══════════════════════════════════════════════════════════════════════════════
const LoginScreen = ({ onSuccess, onSignup, onForgot }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    setAlert(null);
    if (!identifier || !password) return setAlert({ type: "error", msg: "Please enter your email/phone and password." });
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { identifier, password });
      if (data.success) {
        localStorage.setItem("tf_token", data.data.token);
        localStorage.setItem("tf_user", JSON.stringify(data.data.user));
        setAlert({ type: "success", msg: "Welcome back! Redirecting..." });
        setTimeout(() => onSuccess(), 800);
      }
    } catch (e) {
      setAlert({ type: "error", msg: e.response?.data?.message || "Login failed. Check your credentials." });
    } finally { setLoading(false); }
  };

  return (
    <Center>
      <Card>
        <Logo />
        <h2 style={{ textAlign: "center", color: "#fff", margin: "0 0 6px", fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700 }}>Welcome back</h2>
        <p style={{ textAlign: "center", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", marginBottom: "28px", color: "#707088" }}>Sign in to continue to TaskFlow</p>
        <Alert msg={alert?.msg} type={alert?.type} />
        <Input label="Email or Mobile Number" value={identifier} onChange={setIdentifier} placeholder="you@email.com or 9876543210" icon="📧" />
        <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" icon="🔑" />
        <div style={{ textAlign: "right", marginBottom: "20px", marginTop: "-8px" }}>
          <span onClick={onForgot} style={{ color: "#fb923c", cursor: "pointer", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            Forgot password?
          </span>
        </div>
        <Btn onClick={handleSubmit} loading={loading}>Sign In</Btn>
        <p style={{ textAlign: "center", marginTop: "20px", color: "#606070", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
          Don't have an account?{" "}
          <span onClick={onSignup} style={{ color: "#fb923c", cursor: "pointer", fontWeight: 600 }}>Sign Up</span>
        </p>
      </Card>
    </Center>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — Forgot Password → OTP → Reset
// ═══════════════════════════════════════════════════════════════════════════════
const ForgotScreen = ({ onBack }) => {
  const [step, setStep]             = useState("request");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp]               = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading]       = useState(false);
  const [alert, setAlert]           = useState(null);
  const [devOtp, setDevOtp]         = useState(null);

  const sendOtp = async () => {
    setAlert(null);
    if (!identifier) return setAlert({ type: "error", msg: "Please enter your email or phone number." });
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { identifier });
      setDevOtp(data.otp || null);
      setAlert({ type: "success", msg: "OTP sent! Check your email or phone." });
      setTimeout(() => { setAlert(null); setStep("otp"); }, 1200);
    } catch (e) {
      setAlert({ type: "error", msg: e.response?.data?.message || "Failed to send OTP." });
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setAlert(null);
    if (otp.length !== 6) return setAlert({ type: "error", msg: "OTP must be 6 digits." });
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { identifier, otp });
      setResetToken(data.data.resetToken);
      setAlert({ type: "success", msg: "OTP verified!" });
      setTimeout(() => { setAlert(null); setStep("reset"); }, 800);
    } catch (e) {
      setAlert({ type: "error", msg: e.response?.data?.message || "Invalid or expired OTP." });
    } finally { setLoading(false); }
  };

  const resetPwd = async () => {
    setAlert(null);
    if (newPassword.length < 6) return setAlert({ type: "error", msg: "Password must be at least 6 characters." });
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { resetToken, newPassword });
      setStep("done");
    } catch (e) {
      setAlert({ type: "error", msg: e.response?.data?.message || "Failed to reset password." });
    } finally { setLoading(false); }
  };

  const titles = {
    request: ["Reset Password",  "Enter your email or phone to receive an OTP"],
    otp:     ["Enter OTP",       `We sent a 6-digit code to ${identifier}`],
    reset:   ["New Password",    "Choose a strong new password"],
    done:    ["All Done! 🎉",    "Your password has been reset successfully"],
  };
  const [title, subtitle] = titles[step];

  return (
    <Center>
      <Card>
        <Logo />
        <h2 style={{ textAlign: "center", color: "#fff", margin: "0 0 6px", fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700 }}>{title}</h2>
        <p style={{ textAlign: "center", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px", color: "#707088" }}>{subtitle}</p>

        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
          {["request", "otp", "reset"].map((s, i) => (
            <div key={s} style={{ width: "28px", height: "4px", borderRadius: "2px", background: ["request","otp","reset"].indexOf(step) >= i ? "#f97316" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
          ))}
        </div>

        <Alert msg={alert?.msg} type={alert?.type} />

        {devOtp && (
          <div style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: "#fbbf24" }}>
            🛠️ Dev OTP: <strong>{devOtp}</strong> (remove in production)
          </div>
        )}

        {step === "request" && (<><Input label="Email or Mobile Number" value={identifier} onChange={setIdentifier} placeholder="you@email.com or 9876543210" icon="📧" /><div style={{ marginBottom: "20px" }} /><Btn onClick={sendOtp} loading={loading}>Send OTP</Btn></>)}
        {step === "otp"     && (<><Input label="6-Digit OTP" value={otp} onChange={setOtp} placeholder="Enter the code" icon="🔢" /><div style={{ marginBottom: "20px" }} /><Btn onClick={verifyOtp} loading={loading}>Verify OTP</Btn><p style={{ textAlign: "center", marginTop: "14px", color: "#606070", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Didn't receive it? <span onClick={sendOtp} style={{ color: "#fb923c", cursor: "pointer", fontWeight: 600 }}>Resend OTP</span></p></>)}
        {step === "reset"   && (<><Input label="New Password" type="password" value={newPassword} onChange={setNewPassword} placeholder="Min. 6 characters" icon="🔑" /><div style={{ marginBottom: "20px" }} /><Btn onClick={resetPwd} loading={loading}>Reset Password</Btn></>)}
        {step === "done"    && (<div style={{ textAlign: "center" }}><div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div><p style={{ color: "#9090a8", fontFamily: "'DM Sans', sans-serif", marginBottom: "24px" }}>You can now sign in with your new password.</p><Btn onClick={onBack}>Go to Sign In</Btn></div>)}

        {step !== "done" && (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#606070", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
            <span onClick={onBack} style={{ color: "#fb923c", cursor: "pointer", fontWeight: 600 }}>← Back to Sign In</span>
          </p>
        )}
      </Card>
    </Center>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — accepts onLoginSuccess prop from App.tsx
// ═══════════════════════════════════════════════════════════════════════════════
export default function AuthApp({ onLoginSuccess }) {
  const [screen, setScreen] = useState("welcome");

  const handleSuccess = () => {
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a14 0%, #0f0f1e 40%, #12101a 100%)" }}>
        <Particles />
        {screen === "welcome" && <WelcomeScreen onLogin={() => setScreen("login")}  onSignup={() => setScreen("signup")} />}
        {screen === "signup"  && <SignupScreen  onSuccess={handleSuccess}           onLogin={() => setScreen("login")} />}
        {screen === "login"   && <LoginScreen   onSuccess={handleSuccess}           onSignup={() => setScreen("signup")} onForgot={() => setScreen("forgot")} />}
        {screen === "forgot"  && <ForgotScreen  onBack={() => setScreen("login")} />}
      </div>
    </>
  );
}
