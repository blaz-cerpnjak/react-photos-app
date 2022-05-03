import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from "./components/Header";
import Photos from "./components/Photos";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import AddPhoto from "./components/AddPhoto";
import ShowPhoto from "./components/ShowPhoto"
import { Box } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#010001', 
    },
    secondary: {
      main: '#fff',
    },
    background: { // custom color
      main: '#121313',
    },
    btnBlue: { // custom color
      main: '#0094f7', 
    },
  },
});

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#000',
    },
    background: { // custom color
      main: '#f8f9fa', 
    },
    btnBlue: { // custom color
      main: '#0094f7',
    }
  },
});

function App() {
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const [darkMode, setDarkMode] = useState(false);

  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  const onChange = () => {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <UserContext.Provider value={{
          user: user,
          setUserContext: updateUserData
        }}>
          <div style={{  ...( darkMode ? { backgroundColor: '#121313' } : { backgroundColor: '#f8f9fa' } ), height: '100%' }}>
            <Header darkMode={darkMode} onChange={onChange} />
            <Routes>
              <Route path="/" exact element={<Photos />}></Route>
              <Route path="/login" exact element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path='/photos/:id' element={<ShowPhoto />}></Route>
              <Route path="/publish" element={<AddPhoto />}></Route>
              <Route path="/profile/:id" element={<Profile />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
            </Routes>
          </div>
        </UserContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
