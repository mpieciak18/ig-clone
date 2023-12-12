import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext.js';
import { PopUpProvider } from './contexts/PopUpContext.js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AuthProvider>
			<PopUpProvider>
				<App />
			</PopUpProvider>
		</AuthProvider>
	</React.StrictMode>
);
