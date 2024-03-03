// index.js
const cors = require("cors");
const express = require('express');
const customerRoutes = require('./routes/customerRoutes');


const app = express();
app.use(cors());
const PORT =  3001;

app.use(express.json());
app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
