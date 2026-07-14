import React, { useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserDataQuery } from '../services/servicedata';
import { setCompanyId, setName, setLogo, setAddress, setEmail, setCompGst, setAllCompanyDetails } from '../features/companydetail/companyDetailSlice';
import Swal from 'sweetalert2';

import {
  setServiceTypes,
  setSelectedService,
  setMethods,
  setSelectedMethod,
  setMethodsType,
  setSelectedMethodType,
  setResCat,
  setResCatOne,
  setSelectedResCat,
  setPrice,
  updatePriceData,
  setShowPriceBtn,
  setAddons,
  setSelectedAddons,
  setTools,
  setSelectedTools,
  setToolUp,
  setToolDiscounts,
  setPage,
  settempPage,
  setDemand,
  setCurrency,
  setSymbol,
  setShowDiscount,
  setTest,
  setPorA,
  setDiscount,
  setDiscount2,
  setGst,
  setAddonsItems,
  setCustomAddons,
  setCustomAddonsShow,
  setAddonDiscount,
  calculateAll

} from '../features/service/serviceSlice';

import { setPin, setTandE, setDesc } from '../features/Pdfdownload/pdfDownloadSlice';
import { setUser, setCrmData } from '../features/userData/userDataSlice';
import { useGetAllQueriesQuery } from '../services/crmapidata';

const ShowServices = ({ nextStep }) => {
  const dispatch = useDispatch();
  const { serviceTypes, selectedService, methods, selectedMethod, methodsType, selectedMethodType, ResCat, ResCatOne, selectedResCat, Price, ShowPriceBtn, Addons, selectedAddons, Tools, selectedTools, ToolUp, ToolDiscounts, Page, tempPage, Demand, Currency, Symbol, ShowDiscount, Test, PorA, Discount, Discount2, Gst, AddonsItems, CustomAddons, CustomAddonsShow, AddonDiscount, calculationResult } = useSelector((state) => state.service);

  const { User } = useSelector((state) => state.userData);
  const allowedUser = ["saurabhdev@mpsquare.in", "chandrashekharjadon@mpsquare.in"];
  const testMode = allowedUser.includes(User?.Name);
  const { CompanyId, allCompanyDetails } = useSelector((state) => state.CompanyDetail);

  const companyOptions =
    allCompanyDetails?.map((company) => ({
      value: company._id,
      label: company.Name,
      company,
    })) || [];

  const selectedCompany = companyOptions.find((item) => item.value === CompanyId) || null;

  const handleCompanyChange = (selected) => {
    if (!selected) return;

    const company = selected.company;

    dispatch(setCompanyId(company._id));
    dispatch(setName(company.Name));
    dispatch(setLogo(company.logo));
    dispatch(setAddress(company.address));
    dispatch(setEmail(company.email));
    dispatch(setCompGst(company.gst));
  };

  const { data, error, isLoading } = useGetUserDataQuery(CompanyId, { skip: User?.role === "Super_Admin" && !CompanyId, });
  const { data: crmData, error: crmError, isLoading: crmIsLoading } = useGetAllQueriesQuery();

  // for crm data get...
  useEffect(() => {
    if (crmData?.data?.data) {
      dispatch(setCrmData(crmData));
    }
  }, [crmData, dispatch]);

  // console.log('selectedService', selectedService);
  // console.log('methods', methods);
  // console.log('selectedMethod', selectedMethod);
  // console.log('methodsType', methodsType);
  // console.log('selectedMethodType', selectedMethodType);
  // console.log('rescat', ResCat);
  // console.log('ResCatOne', ResCatOne);
  // console.log('selectedResCat', selectedResCat);
  // console.log('Price', Price);
  // console.log('Addons', Addons);
  // console.log('SelectedAddons', selectedAddons);
  // console.log('tool', Tools);
  // console.log('ToolUp', ToolUp);
  // console.log('selectedTools', selectedTools);
  // console.log('page', Page);
  // console.log('temppage', tempPage);
  // console.log('Demand', Demand);
  // console.log('currency', Currency);
  // console.log('Symbol', Symbol);
  // console.log('calculationResult', calculationResult);
  // console.log('AddonsItems', AddonsItems);
  // console.log('CustomAddons', CustomAddons);
  // console.log('AddonDiscount', AddonDiscount);

  // console.log('TandE', TandE);
  // console.log('Desc', Desc);
  // console.log('test', Test);
  // console.log('PorA', PorA);

  useEffect(() => {
    if (data) {
      //for service type...
      // ===============================
      // Service Type
      // ===============================
      const serviceTypeData = data.User.Service_type || [];

      // Company ke according services
      if (CompanyId) {
        const companyServices = serviceTypeData.filter(
          item => item.CompanyId === CompanyId
        );

        dispatch(setServiceTypes(companyServices));
      } else {
        dispatch(setServiceTypes([]));
      }

      //method...
      if (selectedService) {
        const foundServieone = serviceTypeData.find(item => item._id === selectedService.value);
        dispatch(setMethods(foundServieone?.Method || []));

        //method type...
        if (selectedMethod) {
          const foundmethodOne = foundServieone?.Method.find(item => item._id === selectedMethod.value);
          dispatch(setMethodsType(foundmethodOne || null));

          //research category...
          if (selectedMethodType) {
            dispatch(setResCat(foundmethodOne?.Res_Cat_ids || []));
            // price only 
            dispatch(setPrice(foundmethodOne?.Price_id || []));

            //discount...
            const baseDiscount = foundmethodOne?.Price_id?.Discount || 0;
            dispatch(setDiscount(PorA ? baseDiscount : 0));
            dispatch(setDiscount2(PorA ? baseDiscount : 0));

            // for addons...
            if (selectedResCat) {
              const foundOneResCat = foundmethodOne?.Res_Cat_ids.find(item => item._id === selectedResCat.value)
              dispatch(setAddons(foundOneResCat?.Addons_ids || []))

              const selectedAddonsFormatted = (foundOneResCat?.Addons_ids || []).map((addon, index) => {
                const firstItem = addon?.Addons_Item?.[0];
                return firstItem ? {
                  value: firstItem._id,
                  label: firstItem.Name,
                  groupId: addon._id,
                  parent_index: index
                } : null;
              }).filter(Boolean);

              dispatch(setSelectedAddons(selectedAddonsFormatted))
              dispatch(setResCatOne(foundOneResCat || null))


              if (Price?.Page_word_Condition) {
                dispatch(settempPage(Demand === 'Page' ? ResCatOne?.Min_Page : ResCatOne?.Min_Word));
              }

              if (Price?.Page_word_Condition) {
                dispatch(setPage(Demand === 'Page' ? ResCatOne?.Min_Page : ResCatOne?.Min_Word));
              }

              //Tools...
              if (ResCatOne?.Require_Tool) {
                dispatch(setTools(data.Tool));
              }

            }
          }
        }

        // To get T & E & Desc data....
        const tandeData = data?.TandE;
        dispatch(setTandE(tandeData || []));

        //Desc...
        const desc1 = data?.Desc?.[0] || null;
        dispatch(setDesc(desc1 || null));
      }

      //currency symbol
      const symboldata = Currency === 'Rupee' ? "₹" : "$"
      dispatch(setSymbol(symboldata));

      //currency symbol
      const userData = data.User;
      dispatch(setUser(userData));

      //Pin data...
      // const userData = data.User;
      dispatch(setPin(data?.PIN?.New_password));
    }
  }, [data, CompanyId, allCompanyDetails, selectedService, selectedMethod, selectedMethodType, Price?.Page_word_Condition, selectedResCat, ResCatOne, Currency, Demand, dispatch]);

  //for page word price dicounts...
  useEffect(() => {
    if (Price) {

      //discount...  Dollar_Price  Inr_Price Page_word_Condition
      const baseDiscount = Price?.Discount || 0;
      dispatch(setDiscount(PorA ? baseDiscount : 0));
      dispatch(setDiscount2(PorA ? baseDiscount : 0));

      if (!Price.Page_word_Condition) {
        if (Price.Inr_Price === 0 && Price.Dollar_Price === 0) {
          dispatch(setShowPriceBtn(true));
        }
      }
    }
  }, [Price, PorA])

  //for selected addons...
  useEffect(() => {
    if (!data || !selectedAddons?.length) {
      dispatch(setAddonsItems([]));
      dispatch(setCustomAddons([]));
      dispatch(setAddonDiscount([]));
      return;
    }

    const addonsItems = selectedAddons
      .map(selected =>
        data.Addons_Item.find(item => item._id === selected.value)
      )
      .filter(Boolean);

    dispatch(setAddonsItems(addonsItems));

    dispatch(
      setCustomAddons(
        addonsItems.map(item =>
          Currency === "Rupee"
            ? item.Inr_Price
            : item.Dollar_Price
        )
      )
    );

    dispatch(
      setAddonDiscount(
        addonsItems.map(item =>
          PorA ? item.Discount : 0
        )
      )
    );

  }, [selectedAddons, data, Currency, PorA, dispatch]);

  //for seletecd tools...
  useEffect(() => {
    if (!data || !selectedTools?.length) {
      dispatch(setToolDiscounts([]));
      return;
    }

    const selectedIds = selectedTools.map(item => item.value);

    const selectedToolData = data.Tool.filter(tool =>
      selectedIds.includes(tool._id)
    );

    dispatch(
      setToolDiscounts(
        selectedToolData.map(tool =>
          PorA ? tool.Discount : 0
        )
      )
    );

  }, [selectedTools, data, PorA, dispatch]);

  //for seletecd tools for tools up...
  useEffect(() => {
    if (!data || !selectedTools?.length) {
      dispatch(setToolUp([]));
      return;
    }

    const selectedIds = selectedTools.map(item => item.value);

    dispatch(
      setToolUp(
        data.Tool.filter(tool =>
          selectedIds.includes(tool._id)
        )
      )
    );

  }, [selectedTools, data, dispatch]);

  useEffect(() => {
    dispatch(calculateAll());
  }, [
    Price,
    Currency,
    Discount,
    Discount2,
    Page,
    Demand,
    AddonsItems,
    CustomAddons,
    AddonDiscount,
    ToolUp,
    ToolDiscounts,
    Gst,
    PorA,
    dispatch,
  ]);

  //for selected addons...
  useEffect(() => {
    if (selectedAddons && selectedAddons.length > 0) {
      if (data) {
        const addonsItems = selectedAddons.map(selected => {
          return data.Addons_Item.find(item => item._id === selected.value);
        });
        const customPrice = addonsItems.map(item => Currency === 'Rupee' ? item.Inr_Price : item.Dollar_Price || 0);
        const addonsdiscounts = addonsItems.map(item => PorA ? item.Discount : 0 || 0);

        dispatch(setAddonsItems(addonsItems));
        dispatch(setCustomAddons(customPrice));
        dispatch(setAddonDiscount(addonsdiscounts))
      }
    }
  }, [selectedAddons, data, PorA, Currency, dispatch]);

  //for seletecd tools...
  useEffect(() => {
    //for discount tools..
    if (selectedTools && selectedTools.length > 0) {
      const selectedIds = selectedTools.map(item => item.value);
      const getToolsupdata = data?.Tool.filter(item => selectedIds.includes(item._id));

      //for tool discount...
      const toolDiscounts = getToolsupdata.map(tool => PorA ? tool.Discount : 0 || 0);
      dispatch(setToolDiscounts(toolDiscounts));
    }

  }, [selectedTools, PorA, data?.Tool, dispatch]);

  //for seletecd tools for tools up...
  useEffect(() => {
    //for tools up..
    if (selectedTools && selectedTools.length > 0) {
      const selectedIds = selectedTools.map(item => item.value);
      const getToolsupdata = data?.Tool.filter(item => selectedIds.includes(item._id));
      dispatch(setToolUp(getToolsupdata));
    }
  }, [selectedTools, data?.Tool, dispatch]);

  useEffect(() => {
    dispatch(calculateAll());
  }, [Price, Currency, Discount, Discount2, Page, Demand, AddonsItems, CustomAddons, AddonDiscount, ToolUp, ToolDiscounts, Gst, PorA, dispatch])

  //for selected addons...
  useEffect(() => {
    if (selectedAddons && selectedAddons.length > 0) {
      if (data) {
        const addonsItems = selectedAddons.map(selected => {
          return data.Addons_Item.find(item => item._id === selected.value);
        });
        const customPrice = addonsItems.map(item => Currency === 'Rupee' ? item.Inr_Price : item.Dollar_Price || 0);
        const addonsdiscounts = addonsItems.map(item => PorA ? item.Discount : 0 || 0);

        dispatch(setAddonsItems(addonsItems));
        dispatch(setCustomAddons(customPrice));
        dispatch(setAddonDiscount(addonsdiscounts))
      }
    }
  }, [selectedAddons, data, PorA, Currency, dispatch]);

  //for seletecd tools...
  useEffect(() => {
    //for discount tools..
    if (selectedTools && selectedTools.length > 0) {
      const selectedIds = selectedTools.map(item => item.value);
      const getToolsupdata = data?.Tool.filter(item => selectedIds.includes(item._id));

      //for tool discount...
      const toolDiscounts = getToolsupdata.map(tool => PorA ? tool.Discount : 0 || 0);
      dispatch(setToolDiscounts(toolDiscounts));
    }

  }, [selectedTools, PorA, data?.Tool, dispatch]);

  //for seletecd tools for tools up...
  useEffect(() => {
    //for tools up..
    if (selectedTools && selectedTools.length > 0) {
      const selectedIds = selectedTools.map(item => item.value);
      const getToolsupdata = data?.Tool.filter(item => selectedIds.includes(item._id));
      dispatch(setToolUp(getToolsupdata));
    }
  }, [selectedTools, data?.Tool, dispatch]);

  useEffect(() => {
    dispatch(calculateAll());
  }, [Price, Currency, Discount, Discount2, Page, Demand, AddonsItems, CustomAddons, AddonDiscount, ToolUp, ToolDiscounts, Gst, PorA, dispatch])

  //for handle service... 
  const handleServiceChange = (selectedOption) => {
    dispatch(setSelectedService(selectedOption));
    //method...
    dispatch(setSelectedMethod(null));
    dispatch(setMethodsType(null));
    dispatch(setSelectedMethodType(null));
    //ResCat
    dispatch(setResCatOne(null));
    dispatch(setSelectedResCat(null));
    //price for page..
    dispatch(setPrice(null));
    dispatch(setDiscount(0));
    dispatch(setDiscount2(0));
    //Addons...
    dispatch(setAddons([]));
    dispatch(setSelectedAddons(null));
    dispatch(setAddonsItems([]));
    dispatch(setAddonDiscount([]));
    //Tools...
    dispatch(setTools([]));
    dispatch(setSelectedTools([]));
    dispatch(setToolUp([]));
    dispatch(setToolDiscounts([]));

  };

  //for handle method...
  const handleMethodChange = (selectedOption) => {
    dispatch(setSelectedMethod(selectedOption));

    dispatch(setMethodsType(null));
    dispatch(setSelectedMethodType(null));
    //ResCat
    dispatch(setResCatOne(null));
    dispatch(setSelectedResCat(null));
    //price for page..
    dispatch(setPrice(null));
    dispatch(setDiscount(0));
    dispatch(setDiscount2(0));
    //Addons...
    dispatch(setAddons([]));
    dispatch(setSelectedAddons(null));
    dispatch(setAddonsItems([]));
    dispatch(setAddonDiscount([]));
    //Tools...
    dispatch(setTools([]));
    dispatch(setSelectedTools([]));
    dispatch(setToolUp([]));
    dispatch(setToolDiscounts([]));
  };

  //for handle method Type...
  const handleMethodChangeType = (selectedOption) => {
    dispatch(setSelectedMethodType(selectedOption));
  };

  //for Research category...
  const handleResCatChange = (selectedOption) => {
    dispatch(setSelectedResCat(selectedOption));

    //price for page..
    dispatch(setPrice(null));
    dispatch(setDiscount(0));
    dispatch(setDiscount2(0));
    //Addons...
    dispatch(setAddons([]));
    dispatch(setSelectedAddons(null));
    dispatch(setAddonsItems([]));
    dispatch(setAddonDiscount([]));
    //Tools...
    dispatch(setTools([]));
    dispatch(setSelectedTools([]));
    dispatch(setToolUp([]));
    dispatch(setToolDiscounts([]));
  };

  //for addons ...
  const handleAddonsChange = (selectedOption, index) => {
    const updatedAddons = [...(selectedAddons || [])];
    updatedAddons[index] = selectedOption;
    dispatch(setSelectedAddons(updatedAddons));
  }

  //for customAddonsPrice..
  const handleCustomChange = (index, value) => {
    const newDiscounts = [...CustomAddons];

    if (value === '') {
      newDiscounts[index] = '';
      dispatch(setCustomAddons(newDiscounts));
    } else {
      if (value >= 0) {
        newDiscounts[index] = Number(value);
        dispatch(setCustomAddons(newDiscounts));
      }
    }

  }

  //for Tool...
  const handleToolsChange = (selectedOption) => {
    dispatch(setSelectedTools(selectedOption));
  };

  //for tool up...
  const handleToolChange = (index, type) => {
    const updatedTools = ToolUp.map((item, idx) => {
      if (idx === index) {
        if (type === 'decrease' && item.Times > 1) {
          return { ...item, Times: item.Times - 1 };
        }
        if (type === 'increase') {
          return { ...item, Times: item.Times + 1 };
        }
      }
      return item;
    });

    dispatch(setToolUp(updatedTools));
  };

  //handlePageChange...
  const handlePageChange = (e) => {
    const value = Number(e.target.value);
    dispatch(settempPage(value)); // Update temporary input value
  };

  const validatePage = () => {
    const value = tempPage;
    if (Demand === "Page") {
      if (ResCatOne?.Min_Page <= value && value <= Price?.Max_Page) {
        dispatch(setPage(value));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: `No. of Pages must be between ${ResCatOne?.Min_Page} and ${Price?.Max_Page}`,
          confirmButtonText: 'OK',
        });
        dispatch(settempPage(Page));
      }
    } else {
      if (ResCatOne?.Min_Word <= value && value <= Price?.Max_word) {
        dispatch(setPage(value));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: `No. of Words must be between ${ResCatOne?.Min_Word} and ${Price?.Max_word}`,
          confirmButtonText: 'OK',
        });
        dispatch(settempPage(Page));
      }
    }
  }

  //client Discount1 discount handler...
  const handleDiscount1 = (e) => {
    const inputValue = e.target.value;

    const maxPrice = Price?.Page_word_Condition === true ? calculationResult?.perPageWord_data?.belowThreshold : calculationResult?.perPageWord_data?.originalPrice

    if (inputValue === '') {
      dispatch(setDiscount(null));
    } else {
      const parsedValue = Number(inputValue);
      if (parsedValue >= 0 && parsedValue <= (PorA ? 100 : maxPrice)) {
        dispatch(setDiscount(parsedValue));
      }
    }
  };

  //client Discount2 discount handler...
  const handleDiscount2 = (e) => {
    const inputValue = e.target.value;
    const maxPrice = calculationResult?.perPageWord_data?.aboveThreshold;
    if (inputValue === '') {
      dispatch(setDiscount2(null));
    } else {
      const parsedValue = Number(inputValue);
      if (parsedValue >= 0 && parsedValue <= (PorA ? 100 : maxPrice)) {
        dispatch(setDiscount2(parsedValue));
      }
    }
  };

  //client addons discount handler...
  const handleAddonsDiscountChange = (index, value, maxPrice) => {
    const newDiscounts = [...AddonDiscount];

    if (value === '') {
      newDiscounts[index] = '';
      dispatch(setAddonDiscount(newDiscounts));
    } else {
      if (value >= 0 && value <= (PorA ? 100 : maxPrice)) {
        newDiscounts[index] = Number(value);
        dispatch(setAddonDiscount(newDiscounts));
      }
    }
  };

  // for tools discount handler...
  const handleToolDiscountChange = (index, discount, maxPrice) => {
    const updatedDiscounts = [...ToolDiscounts];

    if (discount === '') {
      updatedDiscounts[index] = '';
      dispatch(setToolDiscounts(updatedDiscounts));
    } else {
      if (discount >= 0 && discount <= (PorA ? 100 : maxPrice)) {
        updatedDiscounts[index] = Number(discount);
        dispatch(setToolDiscounts(updatedDiscounts));
      }
    }
  };


  // if (isLoading)
  //   return (
  //     <main id='main' className='main'>
  //       <div className='d-flex justify-content-center align-items-center' style={{ height: '65vh' }}>
  //         <div class="spinner-border" role="status">
  //           <span class="visually-hidden">Loading...</span>
  //         </div>
  //       </div>
  //     </main>
  //   )


  if (error) return <p>Error fetching user data</p>;

  return (
    <main id='main' className='main' >
      <div style={{ maxWidth: '90vw', margin: '0 auto', padding: '0px' }}>
        <div className='row' style={{ backgroundColor: '#f8f9fa', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', paddingTop: '1rem', borderRadius: '0.8rem', minHeight: '81vh' }}>

          {
            !CompanyId && allCompanyDetails.length > 0 ? (
              <div className="col-12">
                <div
                  className="d-flex flex-column align-items-center justify-content-start"
                  style={{ minHeight: "70vh" }}
                >
                  <label className="mb-2 fw-bold">Select Company</label>

                  <div style={{ width: "450px", maxWidth: "100%" }}>
                    <Select
                      options={companyOptions}
                      value={selectedCompany}
                      onChange={handleCompanyChange}
                      placeholder="Select Company"
                      isSearchable
                    />
                  </div>
                </div>
              </div>
            ) :

              <>
                <div className='col-6'>

                  <div style={{ overflowY: 'auto', maxHeight: '74vh', height: '100%', scrollbarWidth: 'none' }}>

                    {/* for service type */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label>Select Service Type</label>
                        <Select
                          value={selectedService}
                          onChange={handleServiceChange}
                          options={serviceTypes.map(item => ({ value: item._id, label: item.Name }))}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              width: '100%',
                            }),
                          }}
                        />
                      </div>
                    </div>

                    {/* for Method */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label>Select Method</label>
                        <Select
                          value={selectedMethod}
                          onChange={handleMethodChange}
                          options={methods?.map(item => ({ value: item._id, label: item.Name }))}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              width: '100%',
                            }),
                          }}
                        />
                      </div>
                    </div>

                    {/* Method type... */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label>Select Method Type</label>
                        {
                          methodsType?.Values && Array.isArray(methodsType.Values) &&
                          <Select
                            defaultValue={selectedMethodType}
                            onChange={handleMethodChangeType}
                            options={methodsType?.Values.map(item => ({ value: item, label: item }))}
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                width: '100%',
                              }),
                            }}
                          />
                        }
                      </div>
                    </div>

                    {/* Research  Category... */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label>Select Research Category</label>
                        <Select
                          value={selectedResCat}
                          onChange={handleResCatChange}
                          options={ResCat?.map(item => ({ value: item._id, label: item.Name }))}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              width: '100%',
                            }),
                          }}
                        />
                      </div>
                    </div>

                    {/* addons  */}
                    <div className="row mb-3">
                      <div className="col-12">
                        {
                          Addons?.map((item, index) => (
                            <div key={item._id || index}>
                              <label>Select {item.Name}</label>
                              <Select
                                value={selectedAddons?.[index] || null}
                                onChange={(selectedOptions) => handleAddonsChange(selectedOptions, index)}
                                options={item.Addons_Item.map((item3) => ({ value: item3._id, label: item3.Name }))}
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    width: '100%',
                                  }),
                                }}
                              />
                              <br />
                            </div>
                          ))
                        }
                      </div>

                    </div>

                    {/* tool data */}
                    {
                      ResCatOne?.Require_Tool && (
                        <>
                          <div className="row mb-3">
                            <div className="col-12">
                              <div>
                                <label>Select Tool</label>
                                <Select
                                  isMulti
                                  closeMenuOnSelect={false}
                                  value={selectedTools}
                                  onChange={handleToolsChange}
                                  options={Tools?.map(item => ({ value: item._id, label: item.Name }))}
                                  styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      width: '100%',
                                    }),
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* tool items count  */}
                          {ToolUp?.map((item, index) => (
                            <div key={index}>
                              <div>
                                {item.Name}:
                                <button
                                  type='button'
                                  onClick={() => handleToolChange(index, 'decrease')}
                                  disabled={item.Times <= 1}
                                >
                                  -
                                </button>
                                {item.Times}
                                <button
                                  type='button'
                                  onClick={() => handleToolChange(index, 'increase')}
                                >
                                  +
                                </button>
                              </div>
                              <br />
                            </div>
                          ))}
                        </>
                      )
                    }

                    {/* no of page condition  */}
                    {
                      Price?.Page_word_Condition === true && (
                        <div className="row mb-3">
                          <div className="col-12">
                            <label for="pagequantity">No of {Demand === 'Page' ? 'Pages' : 'Words'}...</label>
                            <input type="Number" id="pagequantity" name="quantity" min="1" value={tempPage} onChange={handlePageChange} onBlur={validatePage} />
                          </div>
                        </div>
                      )
                    }
                  </div>

                </div>

                <div className='col-6'>
                  <div style={{ overflowY: 'auto', maxHeight: '65vh', scrollbarWidth: 'none' }}>
                    <div className="card">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="card-title col-3 p-0 m-3 ">Price Data</div>

                          {/* Test */}
                          {
                            testMode && (
                              <div className="card-title col-2 p-0 m-0 ">
                                <input class="form-check-input" type="checkbox" value={Test} id="Test" onClick={e => dispatch(setTest(!Test))} />
                                <label class="form-check-label" for="Test">
                                  Test
                                </label>
                              </div>
                            )
                          }
                          {/* End Test */}

                          <div className="form-check col-5 p-0  ml-1 form-switch d-flex align-items-center justify-content-end">
                            <input className="form-check-input me-2" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={(e) => dispatch(setShowDiscount(!ShowDiscount))} />
                            <label className="form-check-label fst-italic" htmlFor="flexSwitchCheckDefault">Special Discount</label>
                          </div>
                        </div>


                        {/* discount button amount vs percentage */}
                        {
                          ShowDiscount && (
                            <div className='row'>
                              <div className='col'>
                                <label className="form-check-label">Discount Method</label>
                                <div className='d-flex justify-content-between'>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="discountMethod"
                                      id="discountPercent"
                                      value="percent"
                                      checked={PorA}
                                      onChange={() => dispatch(setPorA(true))}
                                    />
                                    <label className="form-check-label" htmlFor="discountPercent">
                                      Discount (%)
                                    </label>
                                  </div>

                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="discountMethod"
                                      id="discountAmount"
                                      value="amount"
                                      checked={!PorA}
                                      onChange={() => dispatch(setPorA(false))}
                                    />
                                    <label className="form-check-label" htmlFor="discountAmount">
                                      Amount (A)
                                    </label>
                                  </div>
                                </div>

                              </div>
                            </div>
                          )
                        }
                        {/* End discount button amount vs percentage */}

                        <hr />
                        <div className='row'>
                          <>
                            <div className='col-6'>
                              <label>Page </label>
                              <input type="radio" value='Page' name='page1' checked={Demand === 'Page' ? true : false} onClick={e => dispatch(setDemand(e.target.value))} />
                            </div>
                            <div className='col-6'>
                              <label>Word </label>
                              <input type="radio" value='Word' name='page1' checked={Demand === 'Word' ? true : false} onClick={e => dispatch(setDemand(e.target.value))} />
                            </div>
                          </>
                        </div>

                        <div className='row'>
                          <>
                            <div className='col-6'>
                              <label>Rupee </label>
                              <input type="radio" value='Rupee' name='currency1' checked={Currency === 'Rupee' ? true : false} onClick={e => dispatch(setCurrency(e.target.value))} />
                            </div>
                            <div className='col-6'>
                              <label>Dollar </label>
                              <input type="radio" value='Dollar' name='currency2' checked={Currency === 'Dollar' ? true : false} onClick={e => dispatch(setCurrency(e.target.value))} />
                            </div>
                          </>
                        </div>

                        <hr />

                        {/* for title page/word/basePrice */}
                        <div className='d-flex justify-content-between'>
                          <h5><u>{Price?.Page_word_Condition === true ? Demand === 'Page' ? 'Page' : ' Word' : 'Base Price'}</u></h5>
                        </div>

                        {/* for page/word/basePrice */}
                        <div class="card mt-2">
                          <div class="card-body">
                            <div className='row'>
                              <div className='col'>
                                <div className=" fst-italic">{Price?.Page_word_Condition === true ? Demand === 'Page' ? 'Page' : ' Word' : 'Base Price'}</div>
                              </div>

                              <div className='col'>
                                <div className='fs-6'>Price</div>
                                <div>
                                  {
                                    (Currency === 'Rupee' || Currency === 'Dollar') && ShowPriceBtn ? (
                                      <input type='number' className='form-control' value={Currency === 'Rupee' ? Price?.Inr_Price : Price.Dollar_Price ?? 0} onChange={(e) => { dispatch(updatePriceData({ key: Currency === 'Rupee' ? 'Inr_Price' : 'Dollar_Price', value: Number(e.target.value) })) }} />
                                    )
                                      :
                                      (<>
                                        {Symbol}  {Price?.Page_word_Condition === true ? calculationResult?.perPageWord_data?.belowThreshold : calculationResult?.perPageWord_data?.originalPrice}
                                      </>)

                                  }
                                </div>
                              </div>

                              {
                                ShowDiscount && (

                                  <div className='col'>
                                    <div className='fs-6'>Discount {(PorA ? '(%)' : '(A)')}</div>
                                    <div><input type="number" className="form-control" value={Discount} onChange={(e) => handleDiscount1(e)} /></div>
                                  </div>
                                )
                              }

                            </div>


                            <div className='row'>
                              <div className='col-12'><div className='fs-6'>Final {(PorA ? '(%)' : '(A)')}: {Symbol} {Price?.Page_word_Condition ?

                                (Page > (Demand === 'Page' ? Price?.Threshold_Page : Price?.Threshold_word) ? calculationResult.perPageWord_data.ClientDiscountPrice1 : calculationResult.perPageWord_data.ClientDiscountPrice)

                                :
                                calculationResult?.perPageWord_data?.ClientDiscountPrice
                              }</div></div>

                              <div className='col-12'><div className='fs-6'>{Price?.Page_word_Condition && (
                                Page <= (Demand === 'Page' ? Price.Threshold_Page : Price.Threshold_word) ? (
                                  <h6 className="card-title ms-2 mt-2" style={{ fontSize: '14px' }}>
                                    {Symbol} {calculationResult?.perPageWord_data.belowThreshold} Up to {calculationResult?.perPageWord_data.threshold} : (
                                    {calculationResult?.perPageWord_data.belowThreshold} * {calculationResult?.perPageWord_data.total_page}) = {Symbol} {calculationResult?.perPageWord_data.originalTotalPrice}
                                  </h6>
                                ) :

                                  (<>
                                    <h6 className="card-title ms-2 mt-2" style={{ fontSize: '14px' }}>
                                      {/* ₹ 6 Up to 70 */}
                                      {Symbol} {calculationResult?.perPageWord_data.belowThreshold} Up to {calculationResult?.perPageWord_data.threshold} : ({calculationResult?.perPageWord_data.belowThreshold}*{calculationResult?.perPageWord_data.threshold})={calculationResult?.perPageWord_data.downThresholdTotal}
                                    </h6>
                                  </>)
                              )}
                              </div></div>
                            </ div>
                          </div>
                        </div>

                        {/* for page2/word2 */}
                        {Price?.Page_word_Condition && Page > (Demand === 'Page' ? Price?.Threshold_Page : Price?.Threshold_word) ?
                          <div class="card mt-2">
                            <div class="card-body">
                              <div className='row'>
                                <div className='col'>
                                  <div className=" fst-italic">{Demand === 'Page' ? 'Page' : ' Word'}</div>
                                </div>
                                <div className='col'>
                                  <div className='fs-6'>Price</div>
                                  <div>{Symbol} {calculationResult?.perPageWord_data?.aboveThreshold}</div>
                                </div>

                                {
                                  ShowDiscount && (
                                    <div className='col'>
                                      <div className='fs-6'>Discount {(PorA ? '(%)' : '(A)')}</div>
                                      <div><input type="number" className="form-control" value={Discount2} onChange={(e) => handleDiscount2(e)} /></div>
                                    </div>

                                  )
                                }

                              </div>
                              <div className='row mt-2'>
                                <div className='col-12'><div className='fs-6'>Final {(PorA ? '(%)' : '(A)')}: {Symbol} {calculationResult.perPageWord_data.ClientDiscountPrice2}</div></div>

                                <div className='col-12'><h6 className="card-title ms-2 mt-2" style={{ fontSize: '14px' }}>{Symbol} {calculationResult?.perPageWord_data.aboveThreshold} Above to {calculationResult?.perPageWord_data.threshold} : ({calculationResult?.perPageWord_data.aboveThreshold} * {calculationResult?.perPageWord_data.overThreshold})={calculationResult?.perPageWord_data.overThresholdTotal}
                                </h6></div>
                              </ div>
                            </div>
                          </div>
                          : null}

                        {/* page/word total */}
                        {Price?.Page_word_Condition && (
                          <div>
                            <hr />
                            <h6 className="card-title">
                              {Demand === 'Page' ? 'No. of Pages Price' : 'No. of Words Price'}
                              :
                              {Symbol} {calculationResult?.perPageWord_data.originalTotalPrice}
                            </h6>

                            {calculationResult?.perPageWord_data.TotalDiscount > 0 && (
                              <h6 className="card-title">
                                Discount: -{Symbol} {calculationResult?.perPageWord_data?.TotalDiscount}
                              </h6>
                            )}

                            <h6 className="card-title">
                              Final Price:{Symbol} {calculationResult?.perPageWord_data.finalPerPagePrice}
                            </h6>
                            <hr />
                          </div>
                        )}


                        {/* <div className='row'>
                    <div className='col'>
                      <h6 className="card-title">
                        {Price?.Page_word_Condition === true ? Demand === 'Page' ? 'Per Page Price' : 'Per Word Price' : 'Base Price'}
                        : {Symbol}  {Price?.Page_word_Condition === true ? calculationResult?.perPageWord_data?.belowThreshold : calculationResult?.perPageWord_data?.originalPrice}

                      </h6> <br />


                      {
                        Currency === 'Rupee' && ShowPriceBtn && (
                          <div className='d-flex'>
                            <h6>Custom Price:</h6>
                            <input type='number' className='form-control' value={Price?.Inr_Price ?? 0} onChange={(e) => { dispatch(updatePriceData({ key: 'Inr_Price', value: Number(e.target.value) })) }} />
                          </div>
                        )
                      }
                      {
                        Currency === 'Dollar' && ShowPriceBtn && (

                          <div className='d-flex mt-2'>
                            <h6>Custom Price:</h6>
                            <input type='number' className='form-control' value={Price?.Dollar_Price ?? 0} onChange={(e) => { dispatch(updatePriceData({ key: 'Dollar_Price', value: Number(e.target.value) })) }} />
                          </div>
                        )
                      }

                      {Price?.Page_word_Condition &&
                        Page > (Demand === 'Page' ? Price?.Threshold_Page : Price?.Threshold_word) ? (
                        <div>
                          Per Page Price: ({Symbol} {calculationResult?.perPageWord_data?.aboveThreshold})
                        </div>
                      ) : null}

                    </div>
                  </div>

                  {
                    ShowDiscount && (
                      <div className="row">
                        <div className='col-12'>
                          <div className='row'>

                            <div className="col-6">
                              <label>Discount1 {(PorA ? '(%)' : '(A)')}</label>
                              <input type="number" className="form-control" value={Discount} onChange={(e) => handleDiscount1(e)} />
                            </div>
                            <div className="col-6 mt-4">
                              <span>After{(PorA ? '(%)' : '(A)')}: {Symbol}

                                {Price?.Page_word_Condition ?

                                  (Page > (Demand === 'Page' ? Price?.Threshold_Page : Price?.Threshold_word) ? calculationResult.perPageWord_data.ClientDiscountPrice1 : calculationResult.perPageWord_data.ClientDiscountPrice)

                                  :
                                  calculationResult?.perPageWord_data?.ClientDiscountPrice
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {
                          Price?.Page_word_Condition &&
                            Page > (Demand === 'Page' ? Price?.Threshold_Page : Price?.Threshold_word) ?

                            (<div className='col-12 mt-2'>
                              <div className='row'>

                                <div className="col-6">
                                  <label>Discount2 {(PorA ? '(%)' : '(A)')}</label>
                                  <input type="number" className="form-control" value={Discount2} onChange={(e) => handleDiscount2(e)} />
                                </div>
                                <div className="col-6 mt-4">
                                  <span>After2{(PorA ? '(%)' : '(A)')}: {Symbol} {calculationResult.perPageWord_data.ClientDiscountPrice2}</span>
                                </div>
                              </div>
                            </div>) : null
                        }
                      </div>
                    )
                  }

                  {
                    Price?.Page_word_Condition ?
                      Page > (Demand === 'Page' ? Price.Threshold_Page : Price.Threshold_word) ?
                        (<>
                          <h6 className="card-title ms-2 mt-2" style={{ fontSize: '14px' }}>
                            {Symbol} {calculationResult?.perPageWord_data.belowThreshold} Up to {calculationResult?.perPageWord_data.threshold} : ({calculationResult?.perPageWord_data.belowThreshold}*{calculationResult?.perPageWord_data.threshold})={calculationResult?.perPageWord_data.downThresholdTotal}
                          </h6>


                          <h6 className="card-title ms-2 mt-2" style={{ fontSize: '14px' }}>
                            {Symbol} {calculationResult?.perPageWord_data.aboveThreshold} Above to {calculationResult?.perPageWord_data.threshold} : ({calculationResult?.perPageWord_data.aboveThreshold} * {calculationResult?.perPageWord_data.overThreshold})={calculationResult?.perPageWord_data.overThresholdTotal}
                          </h6>

                          <hr />

                          <h6 className="card-title">
                            {Demand === 'Page' ? 'No. of Pages Price' : 'No. of Words Price'}
                            :
                            {Symbol} {calculationResult?.perPageWord_data.originalTotalPrice}
                          </h6>

                          {calculationResult?.perPageWord_data.TotalDiscount > 0 && (
                            <h6 className="card-title">
                              Discount: -{Symbol} {calculationResult?.perPageWord_data?.TotalDiscount}
                            </h6>
                          )}

                          <h6 className="card-title">
                            Final Price:{Symbol} {calculationResult?.perPageWord_data.finalPerPagePrice}
                          </h6>
                          <hr />

                          <br />
                        </>)
                        :
                        (<>
                          <h6 className="card-title ms-2 mt-2" style={{ fontSize: '14px' }}>
                            {Symbol} {calculationResult?.perPageWord_data.belowThreshold} Up to {calculationResult?.perPageWord_data.threshold} : ({calculationResult?.perPageWord_data.belowThreshold}*{calculationResult?.perPageWord_data.total_page})={calculationResult?.perPageWord_data.originalTotalPrice}
                          </h6>

                          <hr />

                          <h6 className="card-title">
                            {Demand === 'Page' ? 'No. of Pages Price' : 'No. of Words Price'}
                            :
                            {Symbol} {calculationResult?.perPageWord_data.originalTotalPrice}
                          </h6>

                          {calculationResult?.perPageWord_data?.TotalDiscount > 0 && (

                            <h6 className="card-title">
                              Discount : -{Symbol} {calculationResult?.perPageWord_data?.TotalDiscount}
                            </h6>
                          )}

                          <h6 className="card-title">
                            Final Price: {Symbol} {calculationResult?.perPageWord_data.finalPerPagePrice}
                          </h6>
                          <hr />
                          <br />

                        </>)
                      : null
                  } */}

                        <hr />

                        {/* addons */}



                        <h6 className="card-title" style={{ fontSize: '14px' }}>
                          {
                            calculationResult?.addonPrice?.finalTotalPrices !== undefined && (
                              <div className='d-flex justify-content-between'>
                                <h5><u>Addons</u></h5>
                                {/* <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="CustomAddons" onChange={e => dispatch(setCustomAddonsShow(!CustomAddonsShow))} checked={CustomAddonsShow} />
                            <label class="form-check-label" for="CustomAddons">CustomAddons</label>
                          </div> */}
                              </div>
                            )
                          }



                          {
                            calculationResult?.addonPrice?.originalPrice?.map((item, index) => (

                              <div>
                                <div class="card mt-2">
                                  <div class="card-body">
                                    <div className='row'>
                                      <div className='col'>
                                        <div className=" fst-italic" key={index}>{calculationResult?.addonPrice.Name[index]}</div>
                                      </div>
                                      <div className='col'>
                                        <div className='fs-6'>Price</div>
                                        <div><input type='number' className='form-control' value={item} onChange={e => handleCustomChange(index, e.target.value)} /></div>
                                      </div>

                                      {
                                        ShowDiscount && (

                                          <div className='col'>
                                            <div className='fs-6'>Discount {(PorA ? '(%)' : '(A)')}</div>
                                            <div><input
                                              type='number' className="form-control" value={AddonDiscount[index]} onChange={(e) => handleAddonsDiscountChange(index, e.target.value, item)} /></div>
                                          </div>
                                        )
                                      }

                                    </div>
                                    <div className='row mt-2'>
                                      <div className='col'><div className='fs-6'>Final {(PorA ? '(%)' : '(A)')}: {Symbol} {calculationResult?.addonPrice.finalPrices[index]}</div></div>
                                    </ div>
                                  </div>
                                </div>



                                {/* <div className='row'>
                            <div className={`${CustomAddonsShow ? 'col-4' : 'col-12'} mt-2`}>
                              <p key={index}>{calculationResult?.addonPrice.Name[index]}: {Symbol} {item}</p>
                            </div>
                            {
                              CustomAddonsShow && (
                                <div className='col-8 mt-2'>
                                  <input type='number' className='form-control' value={item} onChange={e => handleCustomChange(index, e.target.value)} />
                                </div>
                              )
                            }
                          </div> */}

                                {/* {
                            ShowDiscount && (
                              <div className="row">
                                <div className="col-6">
                                  <label>Discount {(PorA ? '(%)' : '(A)')}</label>
                                  <input
                                    type='number' className="form-control" value={AddonDiscount[index]} onChange={(e) => handleAddonsDiscountChange(index, e.target.value, item)} />
                                </div>
                                <div className="col-6 mt-4">
                                  <span>After{(PorA ? '(%)' : '(A)')}: {Symbol}{calculationResult?.addonPrice.finalPrices[index]}</span>
                                </div>
                              </div>
                            )
                          } */}
                              </div>
                            ))
                          }

                        </h6>


                        {
                          calculationResult?.addonPrice?.finalTotalPrices !== undefined && (
                            <>
                              <hr />
                              <h6 className="card-title">
                                Total Addons : {Symbol} {calculationResult?.addonPrice.originalTotalPrices}
                              </h6>

                              {
                                calculationResult?.addonPrice.backendTotalPrices > 0 && (

                                  <h6 className="card-title">
                                    Discount : -{Symbol} {calculationResult?.addonPrice.backendTotalPrices}
                                  </h6>
                                )
                              }

                              <h6 className="card-title">
                                Final Price : {Symbol} {calculationResult?.addonPrice.finalTotalPrices}
                              </h6>
                              <hr />
                            </>
                          )
                        }

                        {/* tools */}

                        {selectedTools?.length > 0 && (

                          <div className="row mb-3 mt-3">
                            <div className="col-12">
                              <h5><u>Tools</u></h5>

                              <div>
                                <h6 className="card-title ms-2" style={{ fontSize: '14px' }}>

                                  {selectedTools?.map((toolItem, index) => (
                                    <div key={index}>

                                      <div class="card mt-2">
                                        <div class="card-body">
                                          <div className='row'>
                                            <div className='col'>
                                              <div className=" fst-italic" key={index}>{toolItem.label}</div>
                                            </div>
                                            <div className='col'>
                                              <div className='fs-6'>Price</div>
                                              <div>{calculationResult?.perPageWord_data?.toolPrice?.toolOriginalPrice[index]}</div>
                                            </div>

                                            {
                                              ShowDiscount && (

                                                <div className='col'>
                                                  <div className='fs-6'>Discount {(PorA ? '(%)' : '(A)')}</div>
                                                  <div><input type="number" className="form-control" placeholder={`Discount for ${toolItem.label} (%)`}
                                                    value={ToolDiscounts[index]} onChange={(e) => handleToolDiscountChange(index, e.target.value, calculationResult?.perPageWord_data?.toolPrice?.toolFinalPricesBeforeDiscount[index])} /></div>
                                                </div>
                                              )
                                            }

                                          </div>
                                          <div className='row mt-2'>
                                            <div className='col'><div className='fs-6'>Final {(PorA ? '(%)' : '(A)')}: {Symbol} {calculationResult?.perPageWord_data?.toolPrice?.itemClientDiscountPricesTotal[index]}</div></div>
                                          </ div>
                                        </div>
                                      </div>



                                      {/* <div className="d-flex justify-content-between mb-2">
                                  <span>{toolItem.label} : {calculationResult?.perPageWord_data?.toolPrice?.toolOriginalPrice[index]}</span>
                                </div>

                                {
                                  ShowDiscount && (
                                    <div className="row">
                                      <div className="col-6">
                                        <input type="number" className="form-control" placeholder={`Discount for ${toolItem.label} (%)`}
                                          value={ToolDiscounts[index]} onChange={(e) => handleToolDiscountChange(index, e.target.value, calculationResult?.perPageWord_data?.toolPrice?.toolFinalPricesBeforeDiscount[index]) } />
                                      </div>

                                      <div className="col-6 mt-2">
                                        <span className="ms-2">
                                          After{(PorA ? '(%)' : '(A)')}: {Symbol}{calculationResult?.perPageWord_data?.toolPrice?.itemClientDiscountPricesTotal[index]}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                } */}
                                    </div>
                                  ))}
                                </h6>
                              </div>

                              <hr />
                              <h6 className="card-title">
                                Tools : {Symbol} {calculationResult?.perPageWord_data?.toolPrice?.toolTotalBeforeDiscount}
                              </h6>

                              {
                                calculationResult?.perPageWord_data?.toolPrice?.toolClientTotal > 0 && (

                                  <h6 className="card-title">
                                    Discount : -{Symbol} {calculationResult?.perPageWord_data?.toolPrice?.toolClientTotal}
                                  </h6>
                                )
                              }

                              <h6 className="card-title">
                                FinalPrice : {Symbol} {calculationResult?.perPageWord_data?.toolPrice?.toolClientTotalPrice}
                              </h6>

                            </div>
                          </div>
                        )}

                        {/* totalContainer */}

                        <hr />
                        <h6>
                          Total Price:{Symbol}
                          {calculationResult?.totalContainer?.Total}
                        </h6>
                        {
                          calculationResult?.totalContainer?.DiscountPrice > 0 && (
                            <h6>
                              Total Discount: -{Symbol}
                              {calculationResult?.totalContainer?.DiscountPrice}
                            </h6>
                          )
                        }
                        <h6>
                          Final Price:{Symbol}
                          {calculationResult?.totalContainer?.FinalTotal}
                        </h6>

                        {
                          Currency === 'Rupee' && ShowDiscount && (
                            <div>
                              GST Price: <input type='number' value={Gst} onChange={e => dispatch(setGst(Number(e.target.value)))} />
                            </div>
                          )
                        }

                        {
                          Currency === 'Rupee' && (

                            <h6 className='ms-3'>
                              GST Price({calculationResult?.totalContainer?.GST}%):+{Symbol}
                              {calculationResult?.totalContainer?.GSTPrice}
                            </h6>
                          )
                        }



                        <hr />
                        <h6>
                          Net Total :{Symbol}
                          {calculationResult?.totalContainer?.NetTotal}
                        </h6>

                      </div>
                      <br />
                    </div>

                  </div>
                  <br />
                  <div className='d-flex justify-content-end'>
                    <button
                      onClick={() => { nextStep(); }}
                      className={`btn ${!selectedResCat ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={!selectedResCat}
                    >
                      Save & Next
                    </button>
                  </div>
                  <br />
                </div>
              </>
          }
        </div>
      </div >
    </main >
  );
}

export default ShowServices

