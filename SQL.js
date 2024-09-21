const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Database setup
const sequelize = new Sequelize('SQL-DB', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Address = sequelize.define('Address', {
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Address);
Address.belongsTo(User);

const app = express();
app.use(express.json());

// Form submission route
app.post('/register', async (req, res) => {
  const { name, addresses } = req.body;

  try {
    const user = await User.create({ name });
    const addressEntries = addresses.map(address => ({
      address,
      UserId: user.id,
    }));
    
    await Address.bulkCreate(addressEntries);
    res.status(201).json({ message: 'User and addresses saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user and addresses' });
  }
});

// Start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
