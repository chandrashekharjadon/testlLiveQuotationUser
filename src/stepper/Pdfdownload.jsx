import React, { use, useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';  // Don't forget to import Swal
import { download_pdf } from '../util/pdfHelper';
import { setOtp, setPin, setShouldFocus, setLoader, clearOtp, reset } from '../features/Pdfdownload/pdfDownloadSlice';
import './Pdfdownload.css';
import useApi from '../components/Auth/Api';
import Select from "react-select";


const Pdfdownload = ({ previousStep, currentStep, pdfStepIndex }) => {
  const dispatch = useDispatch();
  const Api = useApi();

  const { otp, Pin, shouldFocus, TandE, Desc, Loader } = useSelector(
    (state) => state.pdfDownload
  );

  const service = useSelector((state) => state.service);
  const installment = useSelector((state) => state.installment);
  const userData = useSelector((state) => state.userData);
  const CompanyDetail = useSelector((state) => state.CompanyDetail);

  const [progress, setProgress] = useState(0);

  // Set Pin when service changes (or on mount) - customize as needed
  useEffect(() => {
    if (service?.Test) {
      dispatch(setPin('1234')); // Example: setPin from service or config
    }
  }, [service, dispatch]);

  console.log('Pin', Pin);
  

  useEffect(() => {
    dispatch(setOtp(service.Test ? Pin : ''));
    const timer = setTimeout(() => {
      dispatch(setShouldFocus(pdfStepIndex === currentStep));
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStep, pdfStepIndex, service.Test, dispatch, Pin]);

  useEffect(() => {
    let progressValue = 0;
    let intervalId;

    if (Loader) {
      intervalId = setInterval(() => {
        progressValue += 1;
        if (progressValue <= 95) {
          setProgress(progressValue);
        } else {
          clearInterval(intervalId);
        }
      }, 30);
    } else {
      setProgress(100);
      const timeoutId = setTimeout(() => setProgress(0), 1000);
      return () => clearTimeout(timeoutId);
    }

    return () => clearInterval(intervalId);
  }, [Loader]);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (otp === Pin) {
  //     try {
  //       dispatch(setLoader(true));

  //       // ✅ Success popup immediately
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Request Sent Successfully',
  //         text: 'Your PDF has been sent for approval and download process completed.',
  //         confirmButtonText: 'OK',
  //       });

  //       const { allCompanyDetails, ...CompanyData } = CompanyDetail;

  //       // ✅ Background process continues
  //       download_pdf(service, installment, userData, CompanyData, TandE, Desc, Api, dispatch)
  //         .then(() => {
  //           console.log("PDF Download Completed");
  //         })
  //         .catch((error) => {
  //           console.error("Download error:", error);

  //           if (error.message === 'Network Error') {
  //             Swal.fire({
  //               icon: 'warning',
  //               title: 'Network Issue',
  //               text: 'Your network is low or disconnected.',
  //             });
  //           } else {
  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Process Failed',
  //               text: 'Unable to send data to head/CRM.',
  //             });
  //           }
  //         })
  //         .finally(() => {
  //           dispatch(setLoader(false));

  //           // Optional reload
  //           setTimeout(() => {
  //             window.location.reload();
  //           }, 1500);
  //         });

  //     } catch (error) {
  //       dispatch(setLoader(false));

  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: 'Unexpected error occurred.',
  //       });
  //     }
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (otp !== Pin) return;

    try {
      console.time("TOTAL_DOWNLOAD_PROCESS");

      dispatch(setLoader(true));

      const { allCompanyDetails, ...CompanyData } = CompanyDetail;

      await download_pdf(
        service,
        installment,
        userData,
        CompanyData,
        TandE,
        Desc,
        Api,
        dispatch
      );

      console.timeEnd("TOTAL_DOWNLOAD_PROCESS");

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Quotation generated successfully.",
        confirmButtonText: 'OK',
      });

    } catch (error) {
      console.error("Download error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "PDF generation failed",
      });
    } finally {
      dispatch(setLoader(false));

      // Optional reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' && otp.length > 0) {
      dispatch(setOtp(otp.slice(0, -1)));
    }
  };

  return (
    <div className="container text-center mt-5">
      <div
        className="row mt-5"
        style={{
          backgroundColor: '#f1f1f1',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          borderRadius: '12px',
        }}
      >
        {Loader ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: '65vh' }}
          >
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div
              className="progress w-75"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ height: '30px' }}
            >
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
              >
                {progress}%
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col d-flex justify-content-center mt-5">
                <div className="border border-dark rounded-3" onKeyDown={handleKeyDown}>
                  <OtpInput
                    value={otp}
                    onChange={(val) => dispatch(setOtp(val))}
                    inputType="password"
                    numInputs={4}
                    shouldAutoFocus={shouldFocus}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: '50px',
                          height: '50px',
                          margin: '20px',
                          textAlign: 'center',
                          fontSize: '60px',
                          color: 'green',
                          border: '3px solid black',
                          borderRadius: '10%',
                          cursor: 'pointer',
                        }}
                        className="otp-input-field"
                      />
                    )}
                  />
                </div>
              </div>

            </div>


            <div className="row mt-4">
              <div className="col d-flex justify-content-around">
                {otp === Pin ? (
                  <span className="text-primary">Verify Password</span>
                ) : (
                  <span className="text-danger">Wrong Password</span>
                )}
              </div>
            </div>

            <div className="row mt-5">
              <div className="col d-flex justify-content-around">
                <button type="button" onClick={previousStep} className="btn btn-secondary">
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={otp !== Pin}
                  className={`btn ${otp === Pin ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Download Quotation
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Pdfdownload;
