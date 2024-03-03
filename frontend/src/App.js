import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styling.css'; 

function App() {
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState({ field: null, order: 'asc' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/customer_details');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };
    const filteredData = data.filter(row => 
        row.cust_name.toLowerCase().includes(filterText.toLowerCase()) ||
        row.locations.toLowerCase().includes(filterText.toLowerCase())
    );
    
    let sortedData = [...filteredData];

    if (sortBy.field === 'date') {
        sortedData = sortedData.sort((a, b) => {
            const dateA = new Date(a.dates);
            const dateB = new Date(b.dates);
            if (sortBy.order === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
    } else if (sortBy.field === 'time') {
        sortedData = sortedData.sort((a, b) => {
            if (sortBy.order === 'asc') {
                return a.times.localeCompare(b.times);
            } else {
                return b.times.localeCompare(a.times);
            }
        });
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

   

    const handleSort = (field) => {
        if (sortBy.field === field) {
            setSortBy({ field, order: sortBy.order === 'asc' ? 'desc' : 'asc' });
        } else {
            setSortBy({ field, order: 'asc' });
        }
    };

    return (
        <div style={{ padding: "50px 10%", backgroundColor: "lightgray" }}>
            <div className='heading'><h2>Customer-Details</h2></div>
            <div className='searchContainer'>
                <input type='text' placeholder='Search by name or location..' onChange={e => setFilterText(e.target.value)} className='searchBox' />
                <button onClick={() => handleSort('date')}>Sort by Date</button>
                <button onClick={() => handleSort('time')}>Sort by Time</button>
            </div>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Sno</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Phone No</th>
                        <th>Location</th>
                        <th colSpan="2">Created At</th> {/* Colspan for Date and Time */}
                    </tr>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((row, index) => (
                        <tr key={index}>
                            <td>{row.sno}</td>
                            <td>{row.cust_name}</td>
                            <td>{row.age}</td>
                            <td>{row.phone}</td>
                            <td>{row.locations}</td>
                            <td>{row.dates.substring(0, 10)}</td>
                            <td>{row.times}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= sortedData.length}>Next</button>
            </div>
        </div>
    );
}

export default App;
