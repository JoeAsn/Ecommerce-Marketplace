import { signup } from "../api/authAPI";
import type { Credentials } from "../types/auth";

export default async function newAccount(_state: unknown, fromData: FormData) {
  const data: Credentials = Object.fromEntries(fromData) as Credentials;
  return signup(data);
}
