import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import {
    setUserName,
    setQueryId,
    setResearchArea,
    setResearchTopic,
    setCourse,
    setResearchDomain,
    setCreatedby,
    setCreaterEmail,
    setCountries,
    setStates,
    setCities,
    setCountry,
    setState,
    setCity,
    setWrirk_Penic_Guide
} from '../features/userData/userDataSlice';
import { useMsal } from '@azure/msal-react';

// const options = [
//     { value: "QID001", label: "QID001" },
//     { value: "QID002", label: "QID002"},
//     { value: "QID003", label: "QID003"},
//     { value: "QID004", label: "QID004"},
//     { value: "QID005", label: "QID005" },
//     { value: "QID006", label: "QID006"}
// ];


const UserProfile = ({ nextStep, previousStep }) => {
    const dispatch = useDispatch();
    const {
        UserName, QueryId, ResearchArea, ResearchTopic, Course,
        ResearchDomain, Createdby, CountryCode, StateCode,
        City, countries, states, cities, Wrirk_Penic_Guide, crmData
    } = useSelector(state => state.userData);

    const options = crmData?.data?.data?.map((q) => ({
        value: q.scholar.sid,
        label: q.scholar.sid,
    })) || [];
    

    const { Test } = useSelector((state) => state.service);
    const { accounts } = useMsal();

    useEffect(() => {
        if (accounts.length > 0) {
            dispatch(setCreatedby(accounts[0].name));
            dispatch(setCreaterEmail(accounts[0].username));

            dispatch(setUserName(Test ? 'test' : ''));
            dispatch(setResearchArea(Test ? 'test' : ''));
            dispatch(setResearchTopic(Test ? 'test' : ''));
            dispatch(setCourse(Test ? 'PhD' : ''));
            dispatch(setResearchDomain(Test ? 'test' : ''));
        }
    }, [accounts, Test, dispatch]);

    //set default values for QueryId...
    useEffect(() => {
        if (crmData?.data?.data?.length > 0) {
            const firstQid = crmData.data.data[0].scholar.sid;
            dispatch(setQueryId(firstQid));
        }
        // const firstQid = options[0].value;
        // dispatch(setQueryId(firstQid));
    }, [crmData, dispatch]);

    // const API_KEY = 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==';
    const API_KEY = '4f349a31bef048eae97f0d7f3eec8b2aba3ca7312e24fc62ef3ba885f22dac2f';
    const BASE_URL = 'https://api.countrystatecity.in/v1';

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/countries`, {
                    headers: { 'X-CSCAPI-KEY': API_KEY }
                });
                dispatch(setCountries(res.data));
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, [dispatch]);

    useEffect(() => {
        const fetchStates = async () => {
            if (CountryCode) {
                try {
                    const res = await axios.get(`${BASE_URL}/countries/${CountryCode}/states`, {
                        headers: { 'X-CSCAPI-KEY': API_KEY }
                    });
                    dispatch(setStates(res.data));
                } catch (error) {
                    console.error('Error fetching states:', error);
                }
            }
        };
        fetchStates();
    }, [CountryCode, dispatch]);

    useEffect(() => {
        const fetchCities = async () => {
            if (CountryCode && StateCode) {
                try {
                    const res = await axios.get(`${BASE_URL}/countries/${CountryCode}/states/${StateCode}/cities`, {
                        headers: { 'X-CSCAPI-KEY': API_KEY }
                    });
                    dispatch(setCities(res.data));
                } catch (error) {
                    console.error('Error fetching cities:', error);
                }
            }
        };
        fetchCities();
    }, [CountryCode, StateCode, dispatch]);

    // const isFormComplete = () => {
    //     return [UserName, QueryId, ResearchArea, ResearchTopic, Course, ResearchDomain, Createdby].every(val => val.trim() !== '');
    // };

    const isFormComplete = () => {
        return [UserName, QueryId, ResearchArea, ResearchTopic, Course, ResearchDomain, Createdby].every(val => String(val).trim() !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormComplete()) {
            alert('Please fill all required fields.');
            return;
        } else {
            nextStep();
        }

        // try {
        //     await axios.post(`${process.env.REACT_APP_BASE_URL}/api/profile`, {
        //         UserName, ResearchArea, ResearchTopic, Course,
        //         ResearchDomain, Createdby, CountryCode, StateCode, City
        //     });
        //     nextStep();
        // } catch (err) {
        //     console.error("Submit error:", err);
        // }
    };

    const handleCountryChange = (e) => {
        const code = e.target.value;
        const selected = countries.find(c => c.iso2 === code);
        if (selected) dispatch(setCountry({ name: selected.name, code: selected.iso2 }));
    };

    const handleStateChange = (e) => {
        const code = e.target.value;
        const selected = states.find(s => s.iso2 === code);
        if (selected) dispatch(setState({ name: selected.name, code: selected.iso2 }));
    };

    return (
        <main className="main">
            <div className="container" style={{ maxWidth: '90vw', margin: '0 auto', padding: '1rem', backgroundColor: '#f8f9fa', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <InputField label="Full Name" value={UserName} onChange={e => dispatch(setUserName(e.target.value))} required />

                            {/* <InputField label="Query Id" value={QueryId} onChange={e => dispatch(setQueryId(e.target.value))} required /> */}

                            <div className="mb-4">
                                <label className="block mb-2 font-medium">
                                    Query Id <span className="text-danger">*</span>
                                </label>

                                <Select
                                    options={options}
                                    maxMenuHeight={120}
                                    value={options.find((option) => option.value === QueryId) || options[0]}
                                    onChange={(selectedOption) => dispatch(setQueryId(selectedOption.value))}
                                    required
                                />
                            </div>

                            <InputField label="Research Area" value={ResearchArea} onChange={e => dispatch(setResearchArea(e.target.value))} required />
                            <InputField label="Research Topic" value={ResearchTopic} onChange={e => dispatch(setResearchTopic(e.target.value))} required />

                            <SelectField label="State" value={StateCode} onChange={handleStateChange} options={states} getValue={s => s.iso2} getLabel={s => s.name} />

                        </div>

                        <div className="col-md-6">
                            <SelectField
                                label="Course"
                                value={Course}
                                onChange={e => dispatch(setCourse(e.target.value))}
                                options={[
                                    { value: 'PhD', label: 'PhD' },
                                    { value: 'Masters', label: 'Masters' },
                                    { value: 'Bachelors', label: 'Bachelors' }
                                ]}
                            />
                            <InputField label="Research Domain" value={ResearchDomain} onChange={e => dispatch(setResearchDomain(e.target.value))} required />
                            <InputField label="Created By" value={Createdby} onChange={e => dispatch(setCreatedby(e.target.value))} />

                            <SelectField label="Country" value={CountryCode} onChange={handleCountryChange} options={countries} getValue={c => c.iso2} getLabel={c => c.name} />

                            <SelectField label="City" value={City} onChange={e => dispatch(setCity(e.target.value))} options={cities} getValue={c => c.name} getLabel={c => c.name} />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">

                        {/* Back Button */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={previousStep}
                        >
                            Back
                        </button>

                        {/* CSS for pop animation */}
                        <style>
                            {`
                                @keyframes pop {
                                0%, 100% { transform: scale(1); }
                                50% { transform: scale(1.2); }
                                }
                                .pop-animation {
                                animation: pop 1s infinite;
                                }
                                /* Highlight effect for label */
                                .highlight-label {
                                color: #ff5722; /* Bootstrap primary */
                                font-weight: 600;
                                }
                            `}
                        </style>

                        {/* Checkbox */}
                        <div className="form-check m-0">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkChecked"
                                checked={Wrirk_Penic_Guide}
                                onChange={(e) =>
                                    dispatch(setWrirk_Penic_Guide(e.target.checked))
                                }
                            />
                            <label
                                className={`form-check-label ms-2 fs-5 ${!Wrirk_Penic_Guide ? "pop-animation highlight-label" : "highlight-label"}`}
                                htmlFor="checkChecked"
                            >
                                Wrirk Panic Guide
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`btn ${isFormComplete() ? "btn-primary" : "btn-secondary"}`}
                            onClick={nextStep}
                            disabled={!isFormComplete()}
                        >
                            Save & Next
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const InputField = ({ label, value, onChange, required = false, readOnly = false }) => (
    <div className="mb-3">
        <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>
        <input
            type="text"
            className="form-control"
            value={value}
            onChange={onChange}
            placeholder={`Enter ${label.toLowerCase()}`}
            readOnly={readOnly}
        />
    </div>
);

const SelectField = ({ label, value, onChange, options, getValue = o => o.value, getLabel = o => o.label }) => (
    <div className="mb-3">
        <label className="form-label">{label}</label>
        <select className="form-select" value={value} onChange={onChange}>
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((opt, idx) => (
                <option key={idx} value={getValue(opt)}>{getLabel(opt)}</option>
            ))}
        </select>
    </div>
);

export default UserProfile;