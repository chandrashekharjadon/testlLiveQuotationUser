import React, { useState, useEffect } from 'react';
import useApi from '../components/Auth/Api';

const PaginatedTable = () => {
  const [paginatedData, setPaginatedData] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(3); // Items per page

  const Api = useApi(); 

  // Fetch data whenever currentPage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await Api.get(`/api/tool`);
        const response = await Api.post('/api/pagination', {
          page: currentPage,
          itemsPerPage, 
          items:result.data
        });

        if (response && response.data) {
          setPaginatedData(response.data.data); 
          setTotalPages(response.data.totalPages); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, Api, itemsPerPage]);

  // Handlers for page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="container mt-5">
        <nav
          style={{
            background: 'rgb(44, 62, 80)',
            padding: '15px 30px',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: '1200px', textAlign: 'center' }}>
            <span
              style={{
                color: '#f8f9fa',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              Pagination Table
            </span>
          </div>
        </nav>

        <div className="row">
          <div className="col">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Rupees</th>
                  <th scope="col">Dollar</th>
                  <th scope="col">Times</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={item._id}>
                    <th scope="row">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                    <td>{item.Name}</td>
                    <td>&#8377;{item.Inr_Price}</td>
                    <td>&#36;{item.Dollar_Price}</td>
                    <td>{item.Times}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col d-flex justify-content-center">
            <button
              className="btn btn-secondary me-2"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                className="btn btn-secondary ms-1"
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="btn btn-secondary ms-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginatedTable;
