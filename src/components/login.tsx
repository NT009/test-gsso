import React, { useEffect, useState } from "react";
import { Card, Typography, Spin } from "antd";
const { Title, Text } = Typography;
const Login: React.FC<any> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error(
          "Google Client ID is not defined in environment variables"
        );
        onError();
        setIsLoading(false);
        return;
      }

      const checkGoogleLoaded = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(checkGoogleLoaded);

          try {
            const googleLoginDiv = document.getElementById("google-login");
            if (googleLoginDiv) {
              googleLoginDiv.innerHTML = "";
            }

            (window as any).google.accounts.id.initialize({
              client_id: clientId,
              callback: onSuccess,
              auto_select: false,
            });

            if (googleLoginDiv) {
              (window as any).google.accounts.id.renderButton(googleLoginDiv, {
                theme: "outline",
                size: "large",
                width: 250,
              });
            }

            setIsLoading(false);
          } catch (error) {
            console.error("Error initializing Google Sign-In:", error);
            onError();
            setIsLoading(false);
          }
        }
      }, 500);
    };

    initializeGoogleSignIn();
  }, [onSuccess, onError, isLoading]);

  return (
    <Card>
      <div style={{ textAlign: "center" }}>
        <Title level={3}>Welcome</Title>
        <Text type="secondary">Please sign in with your Google account</Text>
        {isLoading ? (
          <div style={{ marginTop: 24 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div
            id="google-login"
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "center",
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default Login;
