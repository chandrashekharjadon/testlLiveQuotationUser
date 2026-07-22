import React from "react";
import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

const SignInButton = () => {
    const handleLogin = async () => {
        console.log("1 Button Clicked");

        try {
            console.log("2 Before Provider");

            const provider = new OAuthProvider("microsoft.com");

            console.log("3 Before Popup");

            const result = await signInWithPopup(auth, provider);

            console.log("4 Popup Success");

            const token = await result.user.getIdToken();

            console.log("5 Token", token);

        } catch (err) {
            console.log("6 Catch");

            console.error(err);
            console.log(err.code);
            console.log(err.message);
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh", width: "100%", padding: "100px" }}
        >
            <div className="border border-dark" style={{ padding: "80px" }}>
                <div
                    style={{ cursor: "pointer" }}
                    onClick={handleLogin}
                >
                    <img
                        src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_signin_dark.png"
                        alt="Microsoft Login"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignInButton;