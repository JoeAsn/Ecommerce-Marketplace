import { useActionState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import "../styles/auth.css";
import signup from "../actions/signup";
import { DataContext } from "../dataContext";

const initialState = {
  success: false,
  message: "",
  errors: {}
};
export default function SignUp() {
  const navigate = useNavigate();
  const context = useContext(DataContext);
  const setUser = context?.setUser ?? (() => undefined);
  const [state , fun ,pending] = useActionState(signup ,initialState)
  useEffect(() => {
    if (state.success && state.user) {
      setUser(state.user);
      navigate("/account", { replace: true });
    }
  }, [navigate, setUser, state.success, state.user]);
  return (
    <>
      <title>Sign Up</title>
      <main className="auth-page">
        <div className="auth-shell">
          <section className="auth-info-card auth-info-card--signup">
            <p className="eyebrow">NEW TO AESTHETE</p>
            <h1>Join Us</h1>
            <p className="auth-intro">
              Become a member of the Aesthete Curated ecosystem. Enjoy early
              access to limited collections, personalized recommendations, and a
              seamless checkout experience.
            </p>
            <ul className="auth-benefits">
              <li>Exclusive curated pieces reserved for members.</li>
              <li>Complimentary standard shipping on all orders.</li>
              <li>Personalized styling services from our curators.</li>
            </ul>
          </section>

          <section className="auth-card auth-card--signup">
            <form className="auth-form" action={fun}>
              <label>
                Full Name
                <input
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  required
                  autoComplete="name"
                />
              </label>
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
                Desired Password
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                />
              </label>
              {state.message && <p className="auth-message" role="status">{state.message}</p>}
              <button type="submit" className="primary-button auth-submit">
               {pending ? "...creating account" : "Create account"}
              </button>
            </form>
            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
