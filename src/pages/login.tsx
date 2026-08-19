import { useActionState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import "../styles/auth.css";
import login from "../actions/login";
import { DataContext } from "../dataContext";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function Login() {
  const context = useContext(DataContext);
  const setUser = context?.setUser ?? (() => undefined);
  const navigate = useNavigate();
  const [state, fun, pending] = useActionState(login, initialState);
  useEffect(() => {
    if (state.success && state.user) {
      setUser(state.user);
      navigate("/", { replace: true });
    }
  }, [navigate, state.success, state.user, setUser]);
  return (
    <>
      <title>Login</title>
      <main className="auth-page">
        <div className="auth-shell">
          <section className="auth-card auth-card--login">
            <p className="eyebrow">RETURNING MEMBER</p>
            <h1>Sign In</h1>
            <p className="auth-intro">
              Log in to manage your orders, saved items, and curated shopping
              experience.
            </p>

            <form className="auth-form" action={fun}>
              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </label>
              <div className="auth-meta-row">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    // checked={remember}
                    // onChange={(event) => setRemember(event.target.checked)}
                  />
                  Remember Me
                </label>
                <button type="button" className="auth-link-button">
                  Forgot password?
                </button>
              </div>
              {state.message && (
                <p className="auth-message" role="status">
                  {state.message}
                </p>
              )}
              <button type="submit" className="primary-button auth-submit">
                {pending ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                New to the store? <Link to="/sign-up">Create account</Link>
              </p>
            </div>
          </section>

          <section className="auth-info-card">
            <h2>Welcome back</h2>
            <p>
              Experience the curated collection and continue where you left off.
              Sign in to unlock exclusive updates and order tracking.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
