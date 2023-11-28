import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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

        const uniqueCategories = [...new Set(data.map(product => product.category))];
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
    <View>
      <View>
        <Text>Fake Store</Text>
        <View>
          <TextInput
            placeholder="Search products"
            value={searchTerm}
            onChangeText={handleSearch}
          />
        </View>
        <View>
          <Text>Category:</Text>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => handleCategoryChange(itemValue)}
          >
            {categories.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity onPress={toggleCart} style={{ cursor: 'pointer' }}>
          <Text>🛒 {cart.length} Items</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filteredProducts.map((product) => (
          <View key={product.id}>
            <Image source={{ uri: product.image }} style={{ width: 200, height: 200 }} />
            <View>
              <Text>{product.title}</Text>
              <Text>${product.price}</Text>
            </View>
            <TouchableOpacity onPress={() => addToCart(product)}>
              <Text>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {showCart && (
        <TouchableOpacity onPress={closeCart}>
          <View>
            <View>
              <Text>Shopping Cart</Text>
              <ScrollView>
                {cart.map((item) => (
                  <View key={item.id}>
                    <View>
                      <Text>{item.title}</Text>
                      <Text>${item.price} x {item.quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Text>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View>
                <Text>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</Text>
              </View>
              <TouchableOpacity>
                <Text>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default App;
