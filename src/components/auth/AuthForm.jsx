import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

export default function AuthForm({ type, onAuth }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields based on type
  const isLogin = type === "login";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onAuth(formData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = `${styles.input} ${error ? styles.inputError : ""}`;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={inputClassName}
              value={formData.username}
              onChange={handleChange}
              required={!isLogin}
              minLength={3}
              autoComplete="username"
            />
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={inputClassName}
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={inputClassName}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p className={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className={styles.link}
            onClick={() => navigate(isLogin ? "/register" : "/login")}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}