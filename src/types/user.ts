export type User = {
    id: string;
    name: string;
    email: string;
};
export type user = {
  success: boolean;
  message: string;
};
export type AuthResponse = user & {
  user : User
}
