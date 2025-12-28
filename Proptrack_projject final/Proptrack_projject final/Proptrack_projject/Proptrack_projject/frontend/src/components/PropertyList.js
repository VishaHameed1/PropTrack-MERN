// src/components/PropertyList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/properties/list')
      .then(res => setProperties(res.data))
      .catch(err => console.error('Error fetching properties:', err));
  }, []);

  return (
    <div>
      <h2>All Properties</h2>
      <ul>
        {properties.map((prop) => (
          <li key={prop._id}>
            <strong>{prop.title}</strong> – {prop.location} – Rs. {prop.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
