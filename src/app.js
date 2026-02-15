const express = require('express');
const monitorRoutes = require('./routes/monitorRoutes');

const app = express();

app.use(express.json());
app.use('/monitors', monitorRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
