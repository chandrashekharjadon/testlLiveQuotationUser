import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { setUserName, setQueryId, setScholarId, setResearchArea, setResearchTopic, setCourse, setResearchDomain, } from '../features/userData/userDataSlice';
import {
  setTimes,
  setInstallments,
  setText,
  setGst2,
  setNet,
  setInstallmentTotal,
  setMainTotal,
  setSelectedDate,
  setRemark,
  setInstallmentData,
} from '../features/installment/installmentSlice';
import { useGetAllQueriesByIdQuery } from '../services/crmapidata';

// const options = [
//   { value: "QID001", label: "QID001" },
//   { value: "QID002", label: "QID002" },
//   { value: "QID003", label: "QID003" },
//   { value: "QID004", label: "QID004" },
//   { value: "QID005", label: "QID005" },
//   { value: "QID006", label: "QID006" }
// ];

const Installment = ({ nextStep, previousStep }) => {
  const dispatch = useDispatch();

  //Get Data 
  const { UserName, QueryId, ScholarId, ResearchArea, ResearchTopic, Course, ResearchDomain, crmData } = useSelector(state => state.userData);
  const options = crmData?.data?.data?.map((q) => ({
    value: q.qid,
    label: q.qid,
  })) || [];

  const { data: CrmQueryData, error, isLoading } = useGetAllQueriesByIdQuery(QueryId, { skip: !QueryId });
  // Get Data from CRM API and set in store in userDataSlice
  useEffect(() => {
    if (!CrmQueryData?.data) return;    
    dispatch(setUserName(CrmQueryData.data?.scholar?.name || 'NA'));
    dispatch(setScholarId(CrmQueryData.data?.scholar?.sid || 'NA'));
    dispatch(setResearchArea(CrmQueryData.data?.area?.name || 'NA'));
    dispatch(setResearchTopic(CrmQueryData.data?.title || 'NA'));
    dispatch(setCourse(CrmQueryData.data?.scholar?.course || 'NA'));
    dispatch(setResearchDomain(CrmQueryData.data?.domain || 'NA'));
  }, [CrmQueryData, dispatch]);

  console.log('QueryId', QueryId);


  const { calculationResult, Currency, Test } = useSelector((state) => state.service);

  const {
    Times,
    Installments,
    Text,
    Gst2,
    Net,
    InstallmentTotal,
    MainTotal,
    Remark,
    SelectedDate,
  } = useSelector((state) => state.installment);


  const { totalContainer } = calculationResult;

  const totalPrice = parseFloat(totalContainer?.FinalTotal || 0);
  const gstPrice = parseFloat(totalContainer?.GSTPrice || 0);
  const netTotal = parseFloat(totalContainer?.NetTotal || 0);

  const handleChangeTime = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      dispatch(setTimes(''));
      return;
    }

    if (value >= 0 && value <= 10) {
      dispatch(setTimes(value));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Times should be between 0 and 10 only!',
      });
    }
  };

  useEffect(() => {
    if (Times === 0 || Times === '') return;

    const perInstallmentAmount = (totalPrice / Times).toFixed(3);
    const perGst = (gstPrice / Times).toFixed(3);
    const perNet = (netTotal / Times).toFixed(3);

    const newInstallments = Array(Times).fill(parseFloat(perInstallmentAmount));
    const newGst = Array(Times).fill(parseFloat(perGst));
    const newNet = Array(Times).fill(parseFloat(perNet));
    const newTexts = Array.from({ length: Times }, (_, i) => (Test ? `Module ${i + 1}` : ''));

    dispatch(setInstallments(newInstallments));
    dispatch(setGst2(newGst));
    dispatch(setNet(newNet));
    dispatch(setText(newTexts));

    const totalInstallmentsPrice = parseFloat(
      newInstallments.reduce((acc, val) => acc + val, 0).toFixed(2)
    );
    const mainPrice = parseFloat(totalPrice.toFixed(2));

    dispatch(setInstallmentTotal(totalInstallmentsPrice));
    dispatch(setMainTotal(mainPrice));
  }, [Times, totalPrice, gstPrice, netTotal, Test, dispatch]);

  const handlePriceChange = (index, value) => {
    const newInstallments = [...Installments];
    newInstallments[index] = parseFloat(value);
    dispatch(setInstallments(newInstallments));

    const totalInstallmentsPrice = parseFloat(
      newInstallments.reduce((acc, val) => acc + parseFloat(val), 0).toFixed(2)
    );
    dispatch(setInstallmentTotal(totalInstallmentsPrice));
  };

  const handleTextChange = (index, value) => {
    const newTexts = [...Text];
    newTexts[index] = value;
    dispatch(setText(newTexts));
  };

  const isButtonDisabled = Times > 0 && (
    Installments.some((amt) => Number(amt) <= 0) ||
    Text.some((text) => !text?.trim()) ||
    !QueryId
  );


  const isMismatch = parseFloat(InstallmentTotal) !== parseFloat(MainTotal);

  const handleSubmitandNext = () => {
    if (isMismatch && Times > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Mismatch',
        text: 'Installment total does not match actual total',
      });
      return;
    }

    const tableData = Times > 0
      ? Installments.map((amount, index) => ({
        Serial: index + 1,
        Amount: amount,
        ...(Currency === 'Rupee' && { Gst2: Gst2[index] }),
        Net: Net[index],
        Module_Name: Text[index],
      }))
      : [];

    dispatch(setInstallmentData(tableData));
    nextStep();
  };

  return (
    <main className="main">
      <div className="container-fluid px-3" style={{ maxWidth: '90vw', paddingTop: '1rem', }}>
        <div className="rounded shadow px-4" style={{ minHeight: '79vh' }}>
          <div className="mb-3">
            <label className="form-label">Number of Installments</label>
            <input
              type="number"
              className="form-control"
              min={0}
              value={Times}
              onChange={handleChangeTime}
            />
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '28vh', marginBottom: '1rem' }}>
            {Times > 0 && (
              <div className="table-responsive">
                <table className="table table-bordered text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Serial</th>
                      <th>Module Name</th>
                      <th>Cost</th>
                      {Currency === 'Rupee' && (<th>GST</th>)}
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Installments.map((amt, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            value={Text[index]}
                            onChange={(e) => handleTextChange(index, e.target.value)}
                            className="form-control"
                            placeholder="Required"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={amt}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                            className="form-control"
                          />
                        </td>
                        {Currency === 'Rupee' && <td>
                          <input
                            type="number"
                            value={Gst2[index]}
                            className="form-control"
                            disabled
                          />
                        </td>}
                        <td>
                          <input
                            type="number"
                            value={Net[index]}
                            className="form-control"
                            disabled
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <div className="row border border-dark text-center py-2 rounded mb-3">
              <div className="col-12 col-md">Installment Total: {InstallmentTotal}</div>
              <div className="col-12 col-md">Main Total: {MainTotal}</div>
            </div>

            <div className="row mb-3 d-flex justify-content-between">
              {/* Valid Till */}
              <div className="col-md-6 mb-3 d-flex flex-column">
                <label className="form-label fw-medium">
                  VALID Till
                </label>
                <DatePicker
                  selected={SelectedDate}
                  onChange={(date) => dispatch(setSelectedDate(date))}
                  showIcon
                  toggleCalendarOnIconClick
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              {/* Query Id */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">
                  Query Id <span className="text-danger">*</span>
                </label>

                <Select
                  options={options}
                  maxMenuHeight={120}
                  onChange={(selectedOption) => dispatch(setQueryId(selectedOption?.value))}
                  placeholder="Select Query Id"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Remark</label>
              <input
                type="text"
                className="form-control"
                value={Remark}
                onChange={(e) => dispatch(setRemark(e.target.value))}
                placeholder="Enter remark to show in PDF"
              />
            </div>

            <div className="d-flex justify-content-between flex-column flex-md-row gap-2">
              <button className="btn btn-secondary" onClick={previousStep}>Back</button>
              <button
                className={`btn ${isButtonDisabled ? 'btn-secondary' : isMismatch ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleSubmitandNext}
                disabled={isButtonDisabled}
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

  );
};

export default Installment;


