import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

// Definir los temas claro y oscuro
const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  cardBackground: '#f5f5f5',
  tabBackground: "#ffffff", // ✅ Agregado
  primary: "#007bff", // ✅ Agregado (Color principal)
};

const darkTheme = {
  background: '#121212',
  text: '#ffffff',
  cardBackground: '#1e1e1e',
  tabBackground: "#121212", // ✅ Agregado
  primary: "#1e90ff", // ✅ Agregado (Color principal)
};

// Crear el contexto del tema
const ThemeContext = createContext({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
});

// Hook personalizado para usar el contexto en cualquier parte de la app
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = Appearance.getColorScheme(); // Detecta si el sistema usa modo oscuro o claro
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme: isDarkMode ? darkTheme : lightTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
