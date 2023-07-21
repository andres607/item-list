import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const App = () => {
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemDistributorPrice, setItemDistributorPrice] = useState('');
  const [itemFinalPrice, setItemFinalPrice] = useState('');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [existingCodes, setExistingCodes] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items'));
    if (storedItems) {
      setItems(storedItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
    setExistingCodes(items.map((item) => item.code));
  }, [items]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!existingCodes.includes(itemCode)) {
      const newItem = {
        code: itemCode,
        name: itemName,
        distributorPrice: parseFloat(itemDistributorPrice),
        finalPrice: parseFloat(itemFinalPrice),
      };

      setItems([...items, newItem]);

      setItemCode('');
      setItemName('');
      setItemDistributorPrice('');
      setItemFinalPrice('');
    } else {
      alert('El código ya existe para otro item. Por favor, ingresa un código único.');
    }
  };

  const handleEditItem = (index) => {
    const itemToEdit = items[index];
    setItemCode(itemToEdit.code);
    setItemName(itemToEdit.name);
    setItemDistributorPrice(itemToEdit.distributorPrice.toString());
    setItemFinalPrice(itemToEdit.finalPrice.toString());

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const handleDeleteItem = (index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const handleSearchInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm.length >= 2) {
      const filteredOptions = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAutocompleteOptions(filteredOptions);
    } else {
      setAutocompleteOptions([]);
    }
  };

  const handleAutocompleteOptionClick = (option) => {
    setSearchTerm(option.name);
    setAutocompleteOptions([]);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Aplicativo de Items</h1>

      <form onSubmit={handleFormSubmit}>
        <label htmlFor="item-code">Código del producto:</label>
        <input
          type="text"
          id="item-code"
          value={itemCode}
          onChange={(e) => setItemCode(e.target.value)}
          required
        />

        <label htmlFor="item-name">Nombre del producto/servicio:</label>
        <input
          type="text"
          id="item-name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <label htmlFor="item-distributor-price">Precio distribuidor:</label>
        <input
          type="number"
          id="item-distributor-price"
          value={itemDistributorPrice}
          onChange={(e) => setItemDistributorPrice(e.target.value)}
          required
        />

        <label htmlFor="item-final-price">Precio cliente final:</label>
        <input
          type="number"
          id="item-final-price"
          value={itemFinalPrice}
          onChange={(e) => setItemFinalPrice(e.target.value)}
          required
        />

        <div className="button-container">
          <button type="submit">Agregar</button>
        </div>
      </form>

      <div id="selected-items">
        <h2>Lista de items</h2>
        <div className="search-container">
          <div className="search-input-container">
            <input
              type="text"
              id="search-input"
              placeholder="Buscar item..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
        </div>
        <table id="item-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio Distribuidor</th>
              <th>Precio Cliente Final</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5">No se encontraron items.</td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.distributorPrice}</td>
                  <td>{item.finalPrice}</td>
                  <td>
                    <span className="edit-item" onClick={() => handleEditItem(index)}>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                    <span className="delete-item" onClick={() => handleDeleteItem(index)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ul id="autocomplete-list">
          {autocompleteOptions.map((option, index) => (
            <li key={index} onClick={() => handleAutocompleteOptionClick(option)}>
              {option.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
