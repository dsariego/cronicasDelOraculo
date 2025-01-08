export const environment = {
  production: false,
  OPENAI_URL: process.env['OPENAI_URL'] || 'https://api.openai.com/v1/chat/completions',
  OPENAI_API_KEY: process.env['OPENAI_API_KEY'] || '',
};
