import 'dotenv/config';
import { createServer } from './infrastructure/config/server';

const PORT = process.env.PORT || 3001;

const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});