import React, { useState, useEffect } from "react";
import { Alert, Layout } from "antd";
import Profile from "./components/profile";
import Login from "./components/login";

const { Content } = Layout;

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  const decodeToken = (token: string): any => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      throw new Error("Failed to decode Google token");
    }
  };

  const handleLoginSuccess = (response: any): void => {
    try {
      const userData = decodeToken(response.credential);

      const userObject: any = {
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
      };

      sessionStorage.setItem("user", JSON.stringify(userObject));
      setUser(userObject);
      setError(null);
    } catch (err) {
      setError("Failed to process login response");
      console.error("Login Error:", err);
    }
  };

  const handleLoginError = (): void => {
    setError("Failed to login with Google");
  };

  const handleLogout = (): void => {
    const currentUser = user?.email || "";
    sessionStorage.removeItem("user");
    setUser(null);

    if ((window as any)?.google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.cancel();
        (window as any).google.accounts.id.disableAutoSelect();
        (window as any).google.accounts.id.revoke(currentUser, () => {
          console.log("Google OAuth state revoked");
        });
      } catch (err) {
        console.error("Error during logout:", err);
      }
    }
  };

  return (
    <Layout className="min-h-screen">
      <Content className="flex items-center justify-center p-4">
        <div style={{ width: "100%", maxWidth: 400 }}>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {user ? (
            <Profile user={user} onLogout={handleLogout} />
          ) : (
            <Login onSuccess={handleLoginSuccess} onError={handleLoginError} />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default App;
