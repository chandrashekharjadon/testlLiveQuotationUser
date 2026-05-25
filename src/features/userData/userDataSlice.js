// store/userDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    UserName: '',
    QueryId: '',
    ResearchArea: '',
    ResearchTopic: '',
    Course: '',
    ResearchDomain: '',
    Createdby: '',
    CreaterEmail: '',
    Country: '',
    CountryCode: '',
    State: '',
    StateCode: '',
    City: '',
    countries: [],
    states: [],
    cities: [],
    
    User : {},
    crmData:{},
    Wrirk_Penic_Guide: true,
};

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserName: (state, action) => { state.UserName = action.payload },
        setQueryId: (state, action) => { state.QueryId = action.payload },
        setResearchArea: (state, action) => { state.ResearchArea = action.payload },
        setResearchTopic: (state, action) => { state.ResearchTopic = action.payload },
        setCourse: (state, action) => { state.Course = action.payload },
        setResearchDomain: (state, action) => { state.ResearchDomain = action.payload },
        setCreatedby: (state, action) => { state.Createdby = action.payload },
        setCreaterEmail: (state, action) => { state.CreaterEmail = action.payload },

        setCountries: (state, action) => { state.countries = action.payload },
        setStates: (state, action) => { state.states = action.payload },
        setCities: (state, action) => { state.cities = action.payload },

        setUser: (state, action) => { state.User = action.payload },// get user data...
        setCrmData: (state, action) => { state.crmData = action.payload },
        setCountry: (state, action) => {
            state.Country = action.payload.name;
            state.CountryCode = action.payload.code;
            state.State = '';
            state.StateCode = '';
            state.City = '';
            state.states = [];
            state.cities = [];
        },

        setState: (state, action) => {
            state.State = action.payload.name;
            state.StateCode = action.payload.code;
            state.City = '';
            state.cities = [];
        },
        
        setCity: (state, action) => { state.City = action.payload },
        setWrirk_Penic_Guide: (state, action) => { state.Wrirk_Penic_Guide = action.payload },
    }
});

export const {
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
    setUser,
    setCountry,
    setState,
    setCity,
    setWrirk_Penic_Guide,
    setCrmData,
} = userDataSlice.actions;

export default userDataSlice.reducer;
