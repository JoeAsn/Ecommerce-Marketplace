export type User = {
    id: string;
    name: string;
    email: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  user?: User;
};
