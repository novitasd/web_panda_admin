import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../layouts/AuthLayout";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import "./login.css";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    function handleChange(e) {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            await login(form);

            navigate("/");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Correo o contraseña incorrectos."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <AuthLayout>

            <section className="login">

                <div className="login-card">

                    <div className="login-header">

                        <h1>TNIS</h1>

                        <p>Panel de Administración</p>

                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        <Input
                            label="Correo electrónico"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@tnis.pe"
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />

                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Iniciando sesión..."
                                : "Iniciar sesión"}
                        </Button>

                    </form>

                </div>

            </section>

        </AuthLayout>

    );

}

export default Login;