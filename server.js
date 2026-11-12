const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const resourceRoutes = require('./routes/resourceRoutes'); // <-- ADD THIS
const clientRoutes = require('./routes/clientRoutes');     // <-- ADD THIS
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/resources', resourceRoutes); // <-- ADD THIS
app.use('/api/clients', clientRoutes);     // <-- ADD THIS

app.get('/', (req, res) => res.send('Eventage EMS API is running...'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});