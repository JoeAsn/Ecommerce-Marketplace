import { supabase } from "./supabaseClient";
import type { AuthResponse } from "../types/user.ts";
import type { Credentials } from "../types/auth.ts";
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// SIGNUP
export async function signup(data: Credentials): Promise<Partial<AuthResponse>> {
  const email = normalizeEmail(data.email);

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password: data.password,
    options: {
      data: { name: data.name }, // stored as user metadata
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  if (!authData.user || !authData.user.email) {
    return {
      success: false,
      message: "User was not created.",
    };
  }
  return {
    success: true,
    message: "Account created successfully",
    user: {
      id: authData.user.id,
      name: data.name,
      email: authData.user.email,
    },
  };
}

// LOGIN
export async function login(data : Credentials) :  Promise<Partial<AuthResponse>>{
  const email = normalizeEmail(data.email);

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password: data.password,
  });

  if (error) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
  if (!authData.user || !authData.user.email) {
    return {
      success: false,
      message: "User was not created.",
    };
  }
  return {
    success: true,
    user: {
      id: authData.user.id,
      name: authData.user.user_metadata?.name,
      email: authData.user.email,
    },
  };
}
