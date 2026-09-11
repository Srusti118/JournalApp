import { useAuth } from "../../hooks/useAuth";
import AuthForm from "./AuthForm";

export default function Login() {
  const { login } = useAuth();

  return <AuthForm type="login" onAuth={login} />;
}