import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import EnvironmentPlugin from 'vite-plugin-environment';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin(['REACT_APP_BASE_URL','REACT_APP_REDIRECT','REACT_APP_APPLICATION_ID','REACT_APP_TENANT_INFO'])
  ],
})
