import React, { useEffect, useState } from 'react';
import { Stepper, Step } from 'react-form-stepper';
import StepWizard from 'react-step-wizard';
import UserProfile from "../stepper/UserProfile";
import Pdfdownload from '../stepper/Pdfdownload';
import { useMsal } from '@azure/msal-react';
import Installment from '../stepper/Installment';
import ShowServices from '../stepper/ShowServices';

const Allstepdata = () => {
  const [quotationData, setQuotationData] = useState({});
  const [installmentData, setInstallmentData] = useState({});

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1); // Add one month
    return today;
  });

  const { accounts } = useMsal();

  const { test } = quotationData;

  const [userData, setUserData] = useState({
    UserName: '',
    ResearchArea: '',
    ResearchTopic: '',
    Country: 'INDIA',
    Course: '',
    ResearchDomain: '',
    Createdby: accounts[0].name,
    State: '',
    City: '',
    CreaterEmail: accounts[0].username,
  });

  // for only test...
  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      UserName: test ? 'test' : '',
      ResearchArea: test ? 'test' : '',
      ResearchTopic: test ? 'test' : '',
      Course: test ? 'PhD' : '',
      ResearchDomain: test ? 'test' : '',
    }));
  }, [test]);
  // End test...  

  const [currentStep, setCurrentStep] = useState(0);

  // Handle navigation with step wizard
  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  return (
    <div style={{position:'fixed',top:0,left:0,right:0}}>
      {/* Stepper Component */}
      <Stepper activeStep={currentStep}
        styleConfig={{
          activeBgColor: 'green',
          completedBgColor: 'purple',
          inactiveBgColor: 'grey',
          activeTextColor: 'white',
          completedTextColor: 'white',
          inactiveTextColor: 'black',
        }}
        connectorStateColors
      >
        <Step label="Services Details" />
        <Step label="Insatallment Details" />
        {/* <Step label="Services Details" /> */}
        <Step label="Candidate Details" />
        <Step label="Final Preview" />
      </Stepper>

      {/* StepWizard with steps */}
      <StepWizard onStepChange={({ activeStep }) => handleStepChange(activeStep - 1)}>
        <ShowServices setQuotationData={setQuotationData} />
        <Installment quotationData={quotationData} setInstallmentData={setInstallmentData} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <UserProfile setUserData={setUserData} userData={userData} />
        <Pdfdownload userData={userData} quotationData={quotationData} installmentData={installmentData} selectedDate={selectedDate} currentStep={currentStep} pdfStepIndex={4} />
      </StepWizard>
    </div>
  );
}

export default Allstepdata

