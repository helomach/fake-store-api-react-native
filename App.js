import React, { useState, useEffect } from 'react';
import './styles.css'; // Importa os estilos do arquivo .css

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);

        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const toggleCart = () => {
    setShowCart((prevShowCart) => !prevShowCart);
  };

  const closeCart = () => {
    setShowCart(false);
  };

  const filteredProducts = products
    .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
    .filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container">
      {/* Restante do componente permanece o mesmo */}
    </div>
  );
}

export default App;
