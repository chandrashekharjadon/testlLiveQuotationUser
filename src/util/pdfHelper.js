import { format } from 'date-fns';
import { setLoader } from '../features/Pdfdownload/pdfDownloadSlice';
import axios from "axios";

// Calculation...
export const calculation = (Price, Currency, Discount, Discount2, Page, Demand, AddonsItems, CustomAddons, AddonDiscount, ToolUp, ToolDiscounts, Gst, PorA) => {

    let addonPrice = 0;
    let NetTotal = 0;
    let GSTPrice = 0;
    let GST = Gst;
    if (AddonsItems.length > 0) {
        addonPrice = addons_calc(AddonsItems, CustomAddons, AddonDiscount, Currency, PorA);
    }

    const perPageWord_data = perPageWord_calc(Price, Currency, Discount, Discount2, Demand, Page, ToolUp, ToolDiscounts, PorA);

    const Total = parseFloat((perPageWord_data?.originalTotalPrice ?? 0) + (addonPrice?.originalTotalPrices ?? 0) + (perPageWord_data?.toolPrice?.toolTotalBeforeDiscount ?? 0)).toFixed(3);

    // for DiscountPrice according Page_word_Condition...
    const d1 = parseFloat(perPageWord_data?.TotalDiscount ?? 0) + parseFloat(addonPrice?.backendTotalPrices ?? 0) + parseFloat(perPageWord_data?.toolPrice?.toolClientTotal ?? 0);

    const d2 = parseFloat(perPageWord_data?.ClientDiscount ?? 0) + parseFloat(addonPrice?.backendTotalPrices ?? 0) + parseFloat(perPageWord_data?.toolPrice?.toolClientTotal ?? 0);

    const DiscountPrice = Price?.Page_word_Condition ? parseFloat(d1).toFixed(3) : parseFloat(d2).toFixed(3);
    // for FinalTotal according Page_word_Condition...
    const f1 = parseFloat(perPageWord_data?.finalPerPagePrice ?? 0) + parseFloat(addonPrice?.finalTotalPrices ?? 0) + (perPageWord_data?.toolPrice?.toolClientTotalPrice ?? 0);

    const f2 = parseFloat(perPageWord_data?.ClientDiscountPrice ?? 0) + parseFloat(addonPrice?.finalTotalPrices ?? 0) + (perPageWord_data?.toolPrice?.toolClientTotalPrice ?? 0);

    const FinalTotal = Price?.Page_word_Condition ? parseFloat(f1).toFixed(3) : parseFloat(f2).toFixed(3);

    GSTPrice = Currency === 'Rupee' ? (FinalTotal * GST) / 100 : 0;
    NetTotal = (parseFloat(FinalTotal) + parseFloat(GSTPrice)).toFixed(3);

    let totalContainer = { Total, DiscountPrice, FinalTotal, GSTPrice, GST, NetTotal }

    // console.log('Total',Total);
    // console.log('DiscountPrice',DiscountPrice);
    // console.log('FinalTotal',FinalTotal);

    return { perPageWord_data, addonPrice, Total, GSTPrice, NetTotal, totalContainer };
};

// Page Word Calculation...
export const perPageWord_calc = (Price, Currency, Discount, Discount2, Demand, Page, ToolUp, ToolDiscounts, PorA) => {

    let perPageWordPrice = 0;
    let ClientDiscountPrice = Discount || 0;
    let ClientDiscount = Discount || 0;
    let toolPrice = 0;
    let total_page = Page || 1;
    let TotalPageWordPrice = 0;
    let TotalOrginalPageWordPrice = 0;
    let TotalDiscount = 0;

    let belowThreshold = 0;
    let aboveThreshold = 0;
    let threshold = 0;
    let overThreshold = 0;
    let overThresholdTotal = 0;
    let downThresholdTotal = 0;

    let ClientDiscount1 = 0;
    let ClientDiscount2 = 0;
    let ClientDiscountPrice1 = 0;
    let ClientDiscountPrice2 = 0;

    let TotalPageWordPrice1 = 0;
    let TotalPageWordPrice2 = 0;

    // let orgPrice1 = 0;
    // let orgPrice2 = 0;

    if (Price?.Page_word_Condition) {
        threshold = (Demand === 'Page') ? Price?.Threshold_Page : Price?.Threshold_word;
        let Inr_above = (Demand === 'Page') ? Price?.Inr_Above_Threshod_Page_Price : Price?.Inr_Above_Threshod_Word_Price;
        let Inr_Below = (Demand === 'Page') ? Price?.Inr_Below_Threshod_Page_Price : Price?.Inr_Below_Threshod_Word_Price;
        let Dollar_Above = (Demand === 'Page') ? Price?.Dollar_Above_Threshod_Page_Price : Price?.Dollar_Above_Threshod_Word_Price;
        let Dollar_below = (Demand === 'Page') ? Price?.Dollar_Below_Threshod_Page_Price : Price?.Dollar_Below_Threshod_Word_Price;
        let max = (Demand === 'Page') ? Price?.Max_Page : Price?.Max_word;

        belowThreshold = Currency === 'Rupee' ? Inr_Below : Dollar_below;
        aboveThreshold = Currency === 'Rupee' ? Inr_above : Dollar_Above;

        if (Page <= threshold) {
            perPageWordPrice = Currency === 'Rupee' ? Inr_Below : Dollar_below;
            ClientDiscount = PorA ? (perPageWordPrice * Discount) / 100 : Discount;
            ClientDiscountPrice = parseFloat((perPageWordPrice - ClientDiscount).toFixed(3));

            toolPrice = Tool_calc(ToolUp, Page, threshold, Currency, ToolDiscounts, PorA);
        }

        TotalPageWordPrice = parseFloat((ClientDiscountPrice * Page).toFixed(3));
        TotalDiscount = parseFloat((ClientDiscount * Page).toFixed(3));
        TotalOrginalPageWordPrice = parseFloat((perPageWordPrice * Page).toFixed(3));

        if (Page > threshold && Page <= max) {
            perPageWordPrice = Currency === 'Rupee' ? Inr_above : Dollar_Above;

            overThreshold = Page - threshold;

            //for down threshold....
            ClientDiscount1 = PorA ? (belowThreshold * Discount) / 100 : Discount;
            ClientDiscountPrice1 = parseFloat((belowThreshold - ClientDiscount1).toFixed(3));

            //for above threshold....
            ClientDiscount2 = PorA ? (aboveThreshold * Discount2) / 100 : Discount2;
            ClientDiscountPrice2 = parseFloat((aboveThreshold - ClientDiscount2).toFixed(3));

            // ClientDiscount = ClientDiscount1+ClientDiscount2;
            // ClientDiscountPrice = ClientDiscountPrice1+ClientDiscountPrice2;

            overThresholdTotal = parseFloat((aboveThreshold * overThreshold).toFixed(3));
            downThresholdTotal = parseFloat((belowThreshold * threshold).toFixed(3));

            const TotalDiscount1 = parseFloat((ClientDiscount1 * threshold).toFixed(3));
            const TotalDiscount2 = parseFloat((ClientDiscount2 * overThreshold).toFixed(3));

            TotalPageWordPrice1 = parseFloat((ClientDiscountPrice1 * threshold).toFixed(3));
            TotalPageWordPrice2 = parseFloat((ClientDiscountPrice2 * overThreshold).toFixed(3));

            TotalOrginalPageWordPrice = parseFloat((overThresholdTotal + downThresholdTotal).toFixed(3));
            TotalDiscount = parseFloat((TotalDiscount1 + TotalDiscount2).toFixed(3));
            TotalPageWordPrice = parseFloat((TotalPageWordPrice1 + TotalPageWordPrice2).toFixed(3));

            toolPrice = Tool_calc(ToolUp, Page, threshold, Currency, ToolDiscounts, PorA);
        }
    }

    else {
        perPageWordPrice = (Currency === 'Rupee') ? Price?.Inr_Price : Price?.Dollar_Price;
        ClientDiscount = PorA ? (perPageWordPrice * Discount) / 100 : Discount
        ClientDiscountPrice = parseFloat((perPageWordPrice - ClientDiscount).toFixed(3));

        TotalOrginalPageWordPrice = perPageWordPrice;

        let threshold = 0;
        toolPrice = Tool_calc(ToolUp, Page, threshold, Currency, ToolDiscounts, PorA);
    }

    // console.log('originalPrice', perPageWordPrice);
    // console.log('finalPerPagePrice', TotalPageWordPrice);
    // console.log('originalTotalPrice', TotalOrginalPageWordPrice);
    // console.log('TotalDiscount', TotalDiscount);
    // console.log('total_page', total_page);
    // console.log('ClientDiscount', ClientDiscount);
    // console.log('ClientDiscountPrice', ClientDiscountPrice);
    // console.log('belowThreshold', belowThreshold);
    // console.log('aboveThreshold', aboveThreshold);

    // console.log('threshold', threshold);

    // console.log('overThreshold', overThreshold);
    // console.log('overThresholdTotal', overThresholdTotal);
    // console.log('downThresholdTotal', downThresholdTotal);

    // console.log('discount2', Discount2);
    // console.log('discount', Discount);

    // console.log('ClientDiscount1', ClientDiscount1);
    // console.log('ClientDiscountPrice1', ClientDiscountPrice1);
    // console.log('ClientDiscount2', ClientDiscount2);
    // console.log('ClientDiscountPrice2', ClientDiscountPrice2);
    // console.log('TotalDiscount', TotalDiscount);
    // console.log('TotalPageWordPrice', TotalPageWordPrice);

    // console.log('TotalPageWordPrice1', TotalPageWordPrice1);
    // console.log('TotalPageWordPrice2', TotalPageWordPrice2);

    // perPageWord_data
    return {
        originalPrice: perPageWordPrice,
        ClientDiscount: ClientDiscount,
        ClientDiscountPrice: ClientDiscountPrice,
        finalPerPagePrice: TotalPageWordPrice,
        TotalDiscount: TotalDiscount,
        originalTotalPrice: TotalOrginalPageWordPrice,
        total_page: total_page,
        toolPrice: toolPrice,

        overThreshold: overThreshold,
        overThresholdTotal: overThresholdTotal,
        downThresholdTotal: downThresholdTotal,

        belowThreshold: belowThreshold,
        aboveThreshold: aboveThreshold,
        threshold: threshold,

        ClientDiscountPrice1: ClientDiscountPrice1,
        ClientDiscountPrice2: ClientDiscountPrice2,

        TotalPageWordPrice1: TotalPageWordPrice1,
        TotalPageWordPrice2: TotalPageWordPrice2
    }
};

// addons Calculation...
export const addons_calc = (AddonsItems, CustomAddons, AddonDiscount, Currency, PorA) => {
    let addonTotalClientPrice = 0;
    let addonTotalClientDiscount = 0;
    let addonTotaloriginalPrice = 0;
    let addonClientDiscount = [];
    let addonClientDiscountPrice = [];
    let addonOrginalPrice = [];
    let addonNames = [];

    AddonsItems.forEach((item, index) => {
        // const addonsItemPrice = Currency === 'Rupee' ? item.Inr_Price : item.Dollar_Price;
        const addonsItemPrice = CustomAddons[index];
        // Calculate price after backend discount
        const clientDiscount = PorA ? (addonsItemPrice * AddonDiscount[index]) / 100 : AddonDiscount[index];
        const clientDiscountedPrice = addonsItemPrice - clientDiscount;

        // Calculate final price after additional discount
        // const finalPrice = backendDiscountedPrice - (backendDiscountedPrice * addonsDiscounts[index]) / 100;

        addonOrginalPrice.push(addonsItemPrice);

        addonClientDiscount.push(clientDiscount);
        addonClientDiscountPrice.push(clientDiscountedPrice);
        addonNames.push(item.Name);

        addonTotaloriginalPrice += addonsItemPrice;
        addonTotalClientDiscount += clientDiscount;
        addonTotalClientPrice += clientDiscountedPrice;
    });

    // console.log('addonOrginalPrice',addonOrginalPrice);
    // console.log('addonClientDiscount',addonClientDiscount);
    // console.log('addonClientDiscountPrice',addonClientDiscountPrice);
    // console.log('addonNames', addonNames);

    // console.log('addonTotaloriginalPrice',addonTotaloriginalPrice);
    // console.log('addonTotalClientDiscount',addonTotalClientDiscount);
    // console.log('addonTotalClientPrice',addonTotalClientPrice);


    return {
        Name: addonNames,
        originalPrice: addonOrginalPrice,
        // backendDiscount: addonDiscount,
        // backendDiscountedPrice: addonDiscountPrice,
        additionalDiscount: addonClientDiscount,
        finalPrices: addonClientDiscountPrice,
        originalTotalPrices: addonTotaloriginalPrice,
        backendTotalPrices: addonTotalClientDiscount,
        finalTotalPrices: addonTotalClientPrice,
    }
};

// tool Calculation...
export const Tool_calc = (ToolUp, Page, threshold, Currency, ToolDiscounts, PorA) => {
    let toolTotalPrice = 0; // ✅ Final price after discount
    let toolTotalBeforeDiscount = 0; // ✅ Original price before discount
    let toolOriginalPrice = []; // ✅ Holds the price of a single tool (without multiplying by quantity)
    let toolTimes = [];
    let toolBackendDiscounts = [];
    let clientDiscount = [];
    let toolClientTotalPrice = 0;
    let toolClientTotal = 0;
    let itemtoolDiscountPrices = [];
    let itemClientDiscountPrices = [];
    let itemClientDiscountPricesTotal = [];
    let toolFinalPricesBeforeDiscount = [];

    ToolUp.forEach((item, index) => {
        let tool_price = (Currency === 'Rupee' ? item.Inr_Price : item.Dollar_Price);

        // ✅ Store the price of a single tool before any discount

        let totalOriginalItemPrice = tool_price * item.Times; // ✅ Multiplying before applying discount
        toolTotalBeforeDiscount += totalOriginalItemPrice; // ✅ Adding original price before discount

        // ✅ Apply client discount
        const clientDiscount1 = ToolDiscounts[index] || 0;
        const itemClientDiscount = PorA ? (totalOriginalItemPrice * clientDiscount1) / 100 : clientDiscount1;
        const itemClientDiscountPrices1 = totalOriginalItemPrice - itemClientDiscount;

        toolClientTotal = parseFloat((toolClientTotal + itemClientDiscount).toFixed(3));
        toolClientTotalPrice = parseFloat((toolClientTotalPrice + itemClientDiscountPrices1).toFixed(3));

        itemClientDiscountPrices.push(itemClientDiscount);
        itemClientDiscountPricesTotal.push(itemClientDiscountPrices1);

        toolOriginalPrice.push(tool_price);
        toolFinalPricesBeforeDiscount.push(totalOriginalItemPrice);

        toolTimes.push(item.Times);
    });

    // console.log(`✅ Tool Original Price: ${toolOriginalPrice}`);
    // console.log(`✅ Tool Price Before Discount: ${toolTotalBeforeDiscount}`);
    // console.log(`✅ Tool Price After Discount: ${toolTotalPrice}`);
    // console.log(`✅ ToolDiscounts: ${toolClientDiscounts}`);
    // console.log(`✅ toolClientDiscountsprice: ${itemClientDiscountPrices}`);
    // console.log(`✅ toolClientDiscountspriceTotal: ${itemClientDiscountPricesTotal}`);
    // console.log(`✅ toolClientTotalPrice: ${toolClientTotalPrice}`);
    // console.log(`✅ toolClientTotal: ${toolClientTotal}`);
    // console.log(`✅ toolFinalPricesBeforeDiscount: ${toolFinalPricesBeforeDiscount}`);

    return {
        toolOriginalPrice,
        toolTimes,
        toolTotalPrice,
        toolTotalBeforeDiscount,
        discount_price: toolTotalBeforeDiscount - toolTotalPrice, // ✅ Calculate Discount Price
        toolClientTotalPrice,
        toolClientTotal,
        itemtoolDiscountPrices,
        itemClientDiscountPrices,
        itemClientDiscountPricesTotal,
        toolBackendDiscounts,
        clientDiscount,
        toolFinalPricesBeforeDiscount
    };
};

// pdf download...
// export const download_pdf = async (service, installment, userData, TandE, Desc, Api, dispatch) => {
//     const { selectedService, selectedMethod, Addons, AddonsItems, Price, ResCatOne, Demand, Symbol, ToolUp, calculationResult } = service;

//     const { UserName, QueryId, ResearchArea, ResearchTopic, Course, ResearchDomain, Createdby, State, City, Country, CreaterEmail, crmQidData, Wrirk_Penic_Guide } = userData;

//     //for description....

//     let cleanText = '';

//     if (Desc?.Content) {

//         function stripHtmlTags(html) {
//             return html.replace(/<(?!\/?strong\b)[^>]+>/g, "");
//         }

//         const template = Desc.Content;
//         const values = {
//             ResearchTopic: `<strong>${ResearchTopic}</strong>`,
//             ServiceType: `<strong>${selectedService?.label}</strong>`,
//         };
//         const formattedString = template.replace(/\${(.*?)}/g, (match, key) => values[key] || match);
//         cleanText = stripHtmlTags(formattedString);
//     }

//     //End description....    

//     const Today_date = new Date();
//     const Ending_date = installment?.SelectedDate;

//     const Current_Date = format(Today_date, 'dd/MM/yyyy');
//     const Expiry_Date = format(Ending_date, 'dd/MM/yyyy');

//     const Addons1 = Addons?.map(item => item.Name)
//     const Addons_child_first = Addons?.map(item => item.Addons_Item[0].Name);
//     const Addons_child = AddonsItems?.map(item => item.Name);

//     //for Addons name with child...
//     const Addons_pairs = Addons1?.map((addon, index) => ({
//         addon: addon,
//         child: Addons_child[index] || 'N/A',
//         child_first: Addons_child_first[index] || 'N/A',
//     }));

//     const data = {
//         Page_word_Condition: Price?.Page_word_Condition,
//         Require_Tool: ResCatOne?.Require_Tool,

//         service_type: selectedService?.label,
//         page_name: Demand === 'Page' ? 'Page' : 'Word',
//         Method: selectedMethod?.label,
//         Res_Cat: ResCatOne?.Name,
//         Addons_pairs: Addons_pairs,
//         addonPrice: calculationResult?.addonPrice,
//         totalContainer: calculationResult?.totalContainer,
//         currency: Symbol,
//         Remark:installment?.Remark,


//         demand: Demand,
//         perPageWord_data: calculationResult?.perPageWord_data,

//         tools_up: ToolUp,
//         toolData: calculationResult?.perPageWord_data?.toolPrice || [],
//         tande: TandE,
//         desc_data: cleanText,
//         desc_Name: Desc?.Name
//     };

//     const jsondata = {
//         "UserName": UserName,
//         "QueryId": QueryId,
//         "Domain": ResearchDomain,
//         "Area": ResearchArea,
//         "Topic": ResearchTopic,
//         "Course": Course,
//         "Createdby": Createdby,
//         "Country": Country,
//         "State": State,
//         "City": City,
//         "Current_Date": Current_Date,
//         "Expiry_Date": Expiry_Date,
//         "Services": data,
//         "Installment": installment?.InstallmentData,
//         "Wrirk_Penic_Guide": Wrirk_Penic_Guide
//     };

//     try {
//       dispatch(setLoader(true));
//         //pdf download...
//         const res = await Api.post(`${process.env.REACT_APP_BASE_URL}/pdfapi/pdf`, jsondata, { responseType: 'arraybuffer',
//            timeout: 60000, // 60 seconds timeout (increase if needed)
//          });

//          // Directly trigger download without uploading first to reduce steps
//         const blob = new Blob([res.data], { type: 'application/pdf' });
//         const url = window.URL.createObjectURL(blob);

//         if (res.data) {
//             console.log('pdf data save...');
//         }

//         //Save pdf on host...
//         const uploadPdfData = await Api.post(`/api/upload`, {
//             file: new Blob([res.data], { type: 'application/pdf' })
//         }, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });

//         //Save userData on host......
//         const userSendingData = {
//             UserName: UserName,
//             QueryId: QueryId,
//             ResearchArea: ResearchArea,
//             ResearchTopic: ResearchTopic,
//             Country: Country,
//             Course: Course,
//             ResearchDomain: ResearchDomain,
//             Createdby: Createdby,
//             State: State,
//             City: City,
//             PdfName: `${jsondata.UserName}_${data.service_type}.pdf`,
//             filePath: uploadPdfData.data.filePath,
//             CreaterEmail: CreaterEmail,
//             DateNow: Current_Date
//         }

//         await Api.post(`/api/profile`, userSendingData);

//         if (url) {
//             // dispatch(setLoader(false));
//             console.log('user data saved....');
//         }
//         // download -------
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${jsondata.UserName}_${data.service_type}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);

//         // ✅ Only now hide the loader
//         // dispatch(setLoader(false));

//         // preview------
//         // window.open(url, '_blank');
//         // setTimeout(() => {
//         //     window.URL.revokeObjectURL(url);
//         // }, 10000);

//         // final submit relode page 
//         // setTimeout(() => {
//         //     window.location.reload();
//         // }, 2000);
//     } catch (error) {
//        console.error("PDF Download error", error);
//        throw error; // ✅ This is the key fix
//       //  dispatch(setLoader(false)); 
//     }
// };

// pdf download...
export const download_pdf = async (service, installment, userData, CompanyData, TandE, Desc, Api, dispatch) => {
    const { selectedService, selectedMethod, Addons, AddonsItems, Price, ResCatOne, Demand, Symbol, ToolUp, calculationResult } = service;
    const { UserName, QueryId, ScholarId, ResearchArea, ResearchTopic, Course, ResearchDomain, Createdby, State, City, Country, CreaterEmail, crmQidData, Wrirk_Penic_Guide } = userData;

    // ================= DESCRIPTION =================
    let cleanText = "";

    if (Desc?.Content) {
        function stripHtmlTags(html) {
            return html.replace(/<(?!\/?strong\b)[^>]+>/g, "");
        }

        const template = Desc.Content;

        const values = {
            ResearchTopic: `<strong>${ResearchTopic}</strong>`,
            ServiceType: `<strong>${selectedService?.label}</strong>`,
        };

        const formattedString = template.replace(
            /\${(.*?)}/g,
            (match, key) => values[key] || match
        );

        cleanText = stripHtmlTags(formattedString);
    }

    // ================= DATE =================
    const Today_date = new Date();
    const Ending_date = installment?.SelectedDate;

    const Current_Date = format(Today_date, "dd/MM/yyyy");
    const Expiry_Date = format(Ending_date, "dd/MM/yyyy");

    // ================= ADDONS =================
    const Addons1 = Addons?.map((item) => item.Name);

    const Addons_child_first = Addons?.map(
        (item) => item.Addons_Item[0].Name
    );

    const Addons_child = AddonsItems?.map((item) => item.Name);

    const Addons_pairs = Addons1?.map((addon, index) => ({
        addon: addon,
        child: Addons_child[index] || "N/A",
        child_first: Addons_child_first[index] || "N/A",
    }));

    // ================= SERVICES DATA =================
    const data = {
        Page_word_Condition: Price?.Page_word_Condition,
        Require_Tool: ResCatOne?.Require_Tool,

        service_type: selectedService?.label,
        page_name: Demand === "Page" ? "Page" : "Word",
        Method: selectedMethod?.label,
        Res_Cat: ResCatOne?.Name,
        Addons_pairs: Addons_pairs,
        addonPrice: calculationResult?.addonPrice,
        totalContainer: calculationResult?.totalContainer,
        currency: Symbol,
        Remark: installment?.Remark,

        demand: Demand,
        perPageWord_data: calculationResult?.perPageWord_data,

        tools_up: ToolUp,
        toolData: calculationResult?.perPageWord_data?.toolPrice || [],
        tande: TandE,
        // desc_data: cleanText,
        // desc_Name: Desc?.Name,
    };

    // ================= FINAL JSON =================
    const jsondata = {
        UserName: UserName,
        QueryId: QueryId,
        Domain: ResearchDomain,
        Area: ResearchArea,
        Topic: ResearchTopic,
        Course: Course,
        Createdby: Createdby,
        Country: Country,
        State: State,
        City: City,
        Current_Date: Current_Date,
        Expiry_Date: Expiry_Date,
        Services: data,
        Installment: installment?.InstallmentData,
        Wrirk_Penic_Guide: Wrirk_Penic_Guide,
        CompanyDetail: CompanyData,
    };

    try {
        dispatch(setLoader(true));

        // ================= PDF GENERATE =================
        const res = await Api.post(
            `${process.env.REACT_APP_BASE_URL}/pdfapi/pdf`,
            jsondata,
            {
                responseType: "arraybuffer",
                timeout: 60000,
            }
        );

        // ================= PDF BLOB =================
        const blob = new Blob([res.data], {
            type: "application/pdf",
        });

        const fileName = `${jsondata.UserName}_${data.service_type}.pdf`;
        const pdfFile = new File([blob], fileName, {
            type: "application/pdf",
        });

        // const url = window.URL.createObjectURL(blob);

        const url = URL.createObjectURL(blob);

        // ================= CREATE DOWNLOAD LINK =================
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // force download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // ================= OPEN PDF IMMEDIATELY =================
        // window.open(url, "_blank");

        // ================= PROFILE DATA =================
        const ProfileData = new FormData();

        ProfileData.append("file", pdfFile);
        ProfileData.append("UserName", UserName);
        ProfileData.append("QueryId", QueryId);
        ProfileData.append("ResearchArea", ResearchArea);
        ProfileData.append("ResearchTopic", ResearchTopic);
        ProfileData.append("Country", Country);
        ProfileData.append("Course", Course);
        ProfileData.append("ResearchDomain", ResearchDomain);
        ProfileData.append("Createdby", Createdby);
        ProfileData.append("State", State);
        ProfileData.append("City", City);
        ProfileData.append("CreaterEmail", CreaterEmail);
        ProfileData.append("DateNow", Current_Date);

        // ================= CRM DATA =================
        const CrmData = new FormData();

        CrmData.append("quotation_pdf", pdfFile);
        CrmData.append("scholar_id", ScholarId);

        // ================= RUN BOTH UPLOADS IN PARALLEL =================
        const [profileResponse, crmResponse] = await Promise.all([
            Api.post("/api/profile", ProfileData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    username: UserName,
                },
            }),

            // axios.post(
            //     `${import.meta.env.VITE_CRM_BASE_URL}scholar/quotation-upload`,
            //     CrmData,
            //     {
            //         headers: {
            //             "Content-Type": "multipart/form-data",
            //         },
            //     }
            // ),
        ]);

        console.log("Profile Response:", profileResponse.data);
        console.log("CRM Response:", crmResponse.data);

        // ================= CLEANUP =================
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 10000);

        dispatch(setLoader(false));

        return true;

    } catch (error) {
        console.error("PDF Download error:", error);
        dispatch(setLoader(false));
        throw error;
    }
};

