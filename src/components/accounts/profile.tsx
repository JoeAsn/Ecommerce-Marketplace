import { useOutletContext } from "react-router";
import type { User } from "../../types/user";

export default function Profile() {
  const { user } = useOutletContext<{ user: User | null }>();
  const [firstName = "", ...lastName] = (user?.name || "").split(" ");

  return (
    <div>
      <h1>Profile Information</h1>

      <div className="profile-form">
        <label>
          First Name
          <input type="text" value={firstName} readOnly />
        </label>

        <label>
          Last Name
          <input type="text" value={lastName.join(" ")} readOnly />
        </label>

        <label>
          Email
          <input type="email" value={user?.email || ""} readOnly />
        </label>

      </div>
    </div>
  );
}
