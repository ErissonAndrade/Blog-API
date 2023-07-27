module.exports =  {
    // ... other Jest config options
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Transform JS and JSX files with Babel
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(module-to-ignore)/)', // Ignore specific modules from transformation
    ],
    testEnvironment: 'node', // Set the test environment to Node.js
  };