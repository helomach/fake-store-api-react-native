// Importações necessárias do React Native e de bibliotecas externas
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles'; // Importação de estilos do arquivo styles.js

// URL da API que fornece os produtos
const API_URL = 'https://fakestoreapi.com/products';

// Componente principal do aplicativo
const App = () => {
  // Estados para armazenar a lista de produtos, itens no carrinho, status do carrinho e termo de pesquisa
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Efeito colateral para buscar dados da API ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Funções para adicionar, remover itens do carrinho e controlar o estado do carrinho
  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Componente para renderizar um item no carrinho
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle}>{item.title}</Text>
        <Text style={styles.cartItemPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Icon name="trash-o" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  // Estrutura principal do aplicativo, incluindo barra de pesquisa, lista de produtos e carrinho
  return (
    <View style={styles.container}>
      {/* Barra de pesquisa e ícone do carrinho */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produtos"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <TouchableOpacity onPress={openCart} style={styles.cartIcon}>
          <Icon name="shopping-cart" size={30} color="#e44fa1" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={products.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Image style={styles.productImage} source={{ uri: item.image }} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <TouchableOpacity onPress={() => addToCart(item)}>
              <Text style={styles.addToCartButton}>Adicionar ao Carrinho</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Carrinho de compras (renderizado apenas se estiver aberto) */}
      {isCartOpen && (
        <View style={styles.cartContainer}>
          <Text style={styles.cartTitle}>Carrinho de Compras</Text>
          {cartItems.length > 0 ? (
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <Text style={styles.emptyCartMessage}>Carrinho vazio</Text>
          )}
          <TouchableOpacity onPress={closeCart}>
            <Text style={styles.backButton}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Exporta o componente principal para uso em outros arquivos
export default App;
