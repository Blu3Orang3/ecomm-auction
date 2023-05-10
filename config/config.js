const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' +
      (process.env.IP || '127.0.0.1') +
      ':' +
      (process.env.MONGO_PORT || '27017') +
      '/mernproject',
  stripe_connect_test_client_id: 'ca_NrGPOzDspIhvJUVFcoD1wdDJwoXfQ7Pi',
  stripe_test_secret_key:
    'sk_test_51MvSYPDpiMf22onWN0By2WPvhwRRo65RhdNTx9QgK4m5vKZFhLebYnrgjaIw2uGitx0g4lLAbGpQzPCrJfJJ82h000Vg5IUVBb',
  stripe_test_api_key:
    'pk_test_51MvSYPDpiMf22onWxOuMLuLNAvJcSUIyGUKwxMRNIXKESBBDEaXw3v4iE8Ykp4hFolB8D7SRwPBjH49fZjwl4n7T00K5a46NMC',
};
export default config;
