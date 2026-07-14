import { Routes, Route, Navigate } from "react-router-dom";
import PaginatedTable from "./components/PaginatedTable";
import Readme from "./components/Readme";
import Allstepdata from "./components/Allstepdata";

import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from "@azure/msal-browser";
import { setUser } from "./features/userData/userDataSlice";
import { setCompanyId, setName, setLogo, setAddress, setEmail, setCompGst, setAllCompanyDetails } from "./features/companydetail/companyDetailSlice";

import SignInButton from "./components/Auth/SignInButton";
import Navbar from "./components/Auth/Navbar";
import useApi from "./components/Auth/Api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ProtectedLayout from "./ProtectedLayout";
import { useDispatch } from "react-redux";

function App() {
  const [userData, setUserData] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const [isDelayed, setIsDelayed] = useState(false);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();

  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const Api = useApi();

  const isUserValid = isAuthenticated && userData && Object.keys(userData).length > 0;

  useEffect(() => {
    const delayTimer = setTimeout(() => setIsDelayed(true), 100);
    let progressValue = 0;
    let isFetchDone = false;
    let hasError = false;
    let intervalId;

    const startProgress = () => {
      intervalId = setInterval(() => {
        // Stop at 95% if there's an error
        if (hasError && progressValue >= 95) {
          clearInterval(intervalId);
          setProgress(95);
          setTimeout(() => setIsLoader(false), 1000); // Optional hide after failure
          return;
        }

        // Normal progress
        if (progressValue < (isFetchDone ? 100 : 95)) {
          progressValue += 1;
          setProgress(Math.min(progressValue, 100));
        }

        // Completion case
        if (isFetchDone && progressValue >= 100) {
          clearInterval(intervalId);
          setTimeout(() => setIsLoader(false), 500); // smooth hide
        }
      }, 30);
    };

    const fetchUserData = async () => {
      try {

        const result = await Api.get(`/api/userId`);
        const response = result.data;

        const loggedUser = {
          id: response?._id,
          name: response.Name,
          email: response.Name, // if Name stores email
          role: response.RoleId?.Type,
          permissions_slug: response.RoleId?.Permissions?.map(permission => permission.Slug) || [],
          permissions_module: [...new Set(response.RoleId?.Permissions?.map(permission => permission.Module) || []),],
          company_id: response?.CompanyId?._id || null,
          company_name: response.CompanyId?.Name || "",
        };

        setUserData(loggedUser);

        // Redux User
        dispatch(setUser(loggedUser));

        if (loggedUser?.role === 'Super_Admin') {
          dispatch(setAllCompanyDetails(response.Company || []));
        } else if (response?.CompanyId) {
          const company = response.CompanyId;

          dispatch(setCompanyId(company._id));
          dispatch(setName(company.Name));
          dispatch(setLogo(company.logo));
          dispatch(setAddress(company.address));
          dispatch(setEmail(company.email));
          dispatch(setCompGst(company.gst));
        }

        isFetchDone = true;

      } catch (error) {

        hasError = true;

        if (hasError) {
          Swal.fire(
            "Network Error...",
            "Please! Check your Internet Connection",
            "error"
          );
        }

        if (error?.response?.status === 403) {
          Swal.fire("Auth Issue...", error.response.data.error, "error");
        } else {
          console.error(error);
        }
      }
    };

    if (isAuthenticated && inProgress === InteractionStatus.None) {
      startProgress();
      fetchUserData();
    } else if (!isAuthenticated && inProgress === InteractionStatus.None) {
      setIsLoader(false);
    }

    return () => {
      clearTimeout(delayTimer);
      clearInterval(intervalId);
    };
  }, [isAuthenticated, inProgress, dispatch]);

  if (isLoader || !isDelayed) {
    return (
      <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '100vh' }}>
        <div className="spinner-border mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="progress" role="progressbar" aria-label="Loading progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{ width: '50%' }}>
          <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%`, transition: 'width 0.3s ease' }}>{progress}%</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && inProgress === InteractionStatus.None) {
    return <SignInButton />;
  }

  return (
    <div className="App">
      {isUserValid && <Navbar />}
      <Routes>
        <Route element={isUserValid ? <ProtectedLayout /> : <SignInButton />} >
          <Route path="/" element={<Allstepdata />} />
          <Route path="/Readme" element={<Readme />} />
          <Route path="/pagi" element={<PaginatedTable />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

