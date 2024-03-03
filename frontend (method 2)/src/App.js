import React , { useState, useEffect } from 'react'
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './styles.css';
import { CustomStyle } from './CustomStyle';

function App() {
    
    const column = [
        {
            name : "Sno",
            selector : row => row.sno
        },
        {
            name : "Name",
            selector : row => row.cust_name
        },
        {
            name : "Age",
            selector : row => row.age
        },
        {
            name : "Phone_No",
            selector : row => row.phone
        },
        {
            name : "Location",
            selector : row => row.locations
        },
        {
            name : "Date",
            selector : row => (row.dates).substring(0,10),
            sortable: true
        },
        {
            name : "Time",
            selector : row => row.times,
            sortable: true
        },
    ]
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    useEffect(() => {
        fetchCustomers();
        
    }, []);
    console.log(data);
    const fetchCustomers = async () => {
        try {
            axios.get('http://localhost:4000/api/customer_details')
            .then(response => {
                setData(response.data);
                setFilterData(response.data);
            })
            .catch(err => console.log(err));
            
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };
    
    const changeHandler = (e) =>{
      const query = e.target.value.toLowerCase();
      const newdata = filterData.filter(row => 
          row.cust_name.toLowerCase().includes(query) || 
          row.locations.toLowerCase().includes(query)
      );
      setData(newdata);
    };
  return (
    
    <div style={{padding : "50px 10%",backgroundColor : "gray"}}>
        <div className='heading'> <h2>Customer-Details</h2></div>
        <div className='searchContainer'>
            <input type='text' placeholder='Search...' onChange={changeHandler} className='searchBox'/>
            
        </div>
        <DataTable
            columns = {column}
            data = {data}
            pagination
            paginationPerPage={20}
            customStyles={CustomStyle}
            
        >
        </DataTable>
    </div>
  )
}

export default App
