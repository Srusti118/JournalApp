import { useAuth } from "../../hooks/useAuth";
import AuthForm from "./AuthForm";

export default function Register() {
  const { register } = useAuth();

  return <AuthForm type="register" onAuth={register} />;
}