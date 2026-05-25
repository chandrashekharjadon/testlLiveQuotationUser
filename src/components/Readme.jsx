import React from 'react';
import { Link } from 'react-router-dom';

function Readme() {
    return (
        <main
            id="main"
            className="main"
            style={{
                padding: '30px',
                background: 'linear-gradient(135deg, #e3f2fd, #90caf9)',
                fontFamily: "'Roboto', sans-serif",
                color: '#333',
                minHeight: '100vh',
            }}
        >
            <div className='position-fixed fs-5'>
                <Link to='/'> <strong>Go To Home</strong></Link>
            </div>
        
            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    backgroundColor: '#ffffff',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h1
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#1a73e8',
                        marginBottom: '10px',
                    }}
                >
                    Project's Title
                </h1>
                <h2
                    style={{
                        fontSize: '1.8rem',
                        textAlign: 'center',
                        color: '#333',
                        marginBottom: '30px',
                    }}
                >
                    Wrirk Quotation Project PDF Generate
                </h2>

                <section
                    style={{
                        marginBottom: '30px',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            borderBottom: '3px solid #1a73e8',
                            paddingBottom: '8px',
                            marginBottom: '20px',
                            color: '#1a73e8',
                        }}
                    >
                        Project Description
                    </h3>
                    <p style={{ lineHeight: '1.8', fontSize: '1rem', marginBottom: '15px' }}>
                        This application allows users to fill out a series of forms and generates a customized PDF based on the entered data.
                    </p>
                    <div>
                        <p style={{ fontWeight: '600', marginBottom: '10px' }}>The application includes three forms:</p>
                        <ol style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '1rem' }}>
                            <li style={{ marginBottom: '10px' }}>
                                <strong>Create PDF</strong>:
                                <ul style={{ listStyleType: 'circle', paddingLeft: '20px', marginTop: '5px' }}>
                                    <li>Start by selecting the <strong>Service Type</strong> from the available options.</li>
                                    <li>Choose a <strong>Method</strong> that suits your requirements.</li>
                                    <li>Specify a <strong>Category</strong> to refine the details further.</li>
                                    <li>Enter the number of pages and provide any additional details as needed.</li>
                                    <li>Select the amount in <strong>Indian Rupees</strong> or <strong>Dollars</strong>.</li>
                                    <li>Define the number of pages and words for the document.</li>
                                    <li>Proceed to the next step by clicking the <strong>Save & Next</strong> button.</li>
                                </ul>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <strong>User Personal Information</strong>: Collect the user's personal details.
                            </li>
                            <li><strong>Enter PIN</strong>: Validate and secure the form submission with a PIN.</li>
                        </ol>
                    </div>
                </section>

                <section
                    style={{
                        marginBottom: '30px',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            borderBottom: '3px solid #1a73e8',
                            paddingBottom: '8px',
                            marginBottom: '20px',
                            color: '#1a73e8',
                        }}
                    >
                        How to Use the Project
                    </h3>
                    <ol style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '1rem' }}>
                        <li>Select a <strong>Service Type</strong> (e.g., Primary Book, Primary Paper, Research Navigator).</li>
                        <li>Select a <strong>Method</strong> (e.g., Writing & Editing, Request & Review).</li>
                        <li>Select a <strong>Research Category</strong> (e.g., Paper, Book Admission).</li>
                        <li>Provide additional inputs like extra details.</li>
                        <li>Enter the number of pages required.</li>
                        <li>Choose a price type: <strong>Indian Rupee</strong> or <strong>Dollars</strong>.</li>
                        <li>Select the document format: Pages or Words.</li>
                        <li>Fill in <strong>User Personal Details</strong>.</li>
                        <li>Enter a secure PIN and download the generated PDF.</li>
                    </ol>
                    <p style={{ fontStyle: 'italic', marginTop: '15px' }}>
                        Note: This workflow is optimized for all services.
                    </p>

                    <ul>
                        <li>
                            plz check how to create <strong>primary book servics</strong>  <a href="https://quotationvideo.netlify.app/images/React-App%20(1).webm">Click</a>
                        </li>

                        <li>
                            plz check how to create <strong>Research Navigator</strong>  <a href="https://quotationvideo.netlify.app/images/React-App%20(2).webm">Click</a>
                        </li>
                    </ul>

                </section>

                <section
                    style={{
                        marginBottom: '30px',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            borderBottom: '3px solid #1a73e8',
                            paddingBottom: '8px',
                            marginBottom: '20px',
                            color: '#1a73e8',
                        }}
                    >
                        System Requirements
                    </h3>
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '1rem' }}>
                        <li><strong>Operating System:</strong></li>
                        <ul style={{ listStyleType: 'circle', paddingLeft: '20px', marginBottom: '10px' }}>
                            <li>Windows: 32-bit or 64-bit, Version 7 or later</li>
                            <li>macOS: Version 10.15 (Catalina) or later</li>
                            <li>Linux: Any distribution with Node.js support (e.g., Ubuntu 20.04+)</li>
                        </ul>
                        <li><strong>Storage Requirements:</strong> At least 1 GB of free space</li>
                        <li><strong>Browser:</strong> Google Chrome, Firefox, or Microsoft Edge for testing</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}

export default Readme;
