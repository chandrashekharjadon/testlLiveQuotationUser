
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";

import React from 'react'
// import useApi from "./Api";

const SignInButton = () => {
    const { instance } = useMsal();
    // const Api = useApi();


    const handleLogin =  () => {
        // try {
        //     // await instance.loginRedirect(loginRequest);
        //     const response = await instance.loginPopup(loginRequest);

        //     const getUser = response.account.username;
        //     const getToken = response.account.idToken;
        //     const result = await Api.post(`/api/addtoken`, { key: getUser, value: getToken });
        //     console.log('result12345',result.data);
            
        // } catch (error) {
        //     console.log("Login error:", error);
        // }

        instance.loginRedirect(loginRequest).catch(e => {
            console.log(e);
        });
    };
    
    // const handleLogin = () => {
    //     instance.loginRedirect(loginRequest).catch(e => {
    //         console.log(e);
    //     });
    // }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh', width: '100%', padding: '100px' }}>
            <div className="border border-dark" style={{ padding: '80px' }}>
                <div style={{cursor:"pointer"}} onClick={() => handleLogin()}>
                    <img src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_signin_dark.png" alt="microsoft logo" />
                </div>
            </div>
        </div>
    )
}

export default SignInButton


// import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "../../authConfig";


// const SignInButton = () => {
//     const { instance } = useMsal();
    
//     const handleLogin = async () => {
//         try {
//             const response = await instance.loginPopup(loginRequest);
//             const user = response.account.username;
//             const token = response.idToken;

//             console.log('user',user);
//             console.log('token',token);
    
//         } catch (error) {
//             console.error("Login error:", error);
//         }
//     };

//     return (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh', width: '100%', padding: '100px' }}>
//             <div className="border border-dark" style={{ padding: '80px' }}>
//                 <div style={{ cursor: "pointer" }} onClick={handleLogin}>
//                     <img src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_signin_dark.png" alt="microsoft logo" />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignInButton;
