const Product = require('../db/Product');

const getProducts = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      carat: req.query.carat,
      price: req.query.price,
      search: req.query.search  
    };

    console.log(' Фільтри отримані бекендом:', filters);
    console.log(' Пошуковий запит:', req.query.search);

    const products = await Product.findAll(filters);
    
    console.log(' Результат фільтрації:', products.length, 'товарів');
    
    setTimeout(() => {
      res.json(products);
    }, 500);
    
  } catch (error) {
    console.error('Помилка отримання товарів:', error);
    res.status(500).json({ 
      success: false,
      message: 'Помилка сервера при отриманні товарів' 
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Товар не знайдено' 
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Помилка отримання товару:', error);
    res.status(500).json({ 
      success: false,
      message: 'Помилка сервера при отриманні товару' 
    });
  }
};

module.exports = {
  getProducts,
  getProductById
};