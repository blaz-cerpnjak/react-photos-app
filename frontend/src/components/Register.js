import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { Avatar } from '@mui/material';
import { Paper } from '@mui/material';
import { Typography } from '@mui/material';
import { Link } from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import styled from '@emotion/styled';

const Input = styled('input')({
    display: 'none',
});

function Register() {
    const [email, setEmail] = useState([]);
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState([]);
    const [isError, showError] = useState(false);
    const [file, setFile] = useState('');
    const userContext = useContext(UserContext); 
    const navigate = useNavigate()

    async function Register(e){
        e.preventDefault();

        if (!email) {
            showError(true);
            setError("Email cannot be empty.");
            return;
        } else if (!username) {
            showError(true);
            setError("Username cannot be empty.");
            return;
        } else if (!password) {
            showError(true);
            setError("Password cannot be empty.");
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', file);
        const res = await fetch('http://localhost:3001/users', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        const data = await res.json();
        if (data._id !== undefined) {
            navigate('/login');
        }
        else {
            setEmail("");
            setUsername("");
            setPassword("");
            setEmail("");
            showError(true);
            setError("Registration failed!");
        }
    }

    return(
         <>
         {userContext.user ? <Navigate replace to="/" /> : ""}

         <Grid container component="main" sx={{ height: '100vh' }}>
             <CssBaseline />
             <Grid
                 item
                 xs={false}
                 sm={4}
                 md={7}
                 sx={{
                     backgroundImage: 'url(https://source.unsplash.com/random)',
                     backgroundRepeat: 'no-repeat',
                     backgroundColor: (t) =>
                     t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                 }}
             />
             <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                 <Box
                     sx={{
                     my: 8,
                     mx: 4,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     }}
                 >
                 <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <AccountCircleRoundedIcon/>
                 </Avatar>
                 <Typography component="h1" variant="h5">
                     Sign Up
                 </Typography>
                 <Box 
                     component="form" 
                     noValidate sx={{ mt: 1 }}
                     onSubmit={Register}    
                 >
                     <TextField
                         margin="normal"
                         required
                         fullWidth
                         id="email"
                         label="Email"
                         name="email"
                         value={email} 
                         onChange={(e)=>(setEmail(e.target.value))}
                         autoComplete="current-email"
                         autoFocus
                     />
                     <TextField
                         margin="normal"
                         required
                         fullWidth
                         id="username"
                         label="Username"
                         name="username"
                         value={username} 
                         onChange={(e)=>(setUsername(e.target.value))}
                         autoComplete="current-username"
                         autoFocus
                     />
                     <TextField
                         margin="normal"
                         required
                         fullWidth
                         name="password"
                         label="Password"
                         type="password"
                         id="password"
                         value={password} 
                         onChange={(e)=>(setPassword(e.target.value))}
                         autoComplete="current-password"
                     />
                     <hr></hr>
                     <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" name="file" multiple type="file" onChange={(e) => {setFile(e.target.files[0])}} />
                        <Button startIcon={<PhotoCamera/>} variant="contained" component="span">Select Photo</Button>
                    </label>
                    &nbsp;&nbsp;
                    { file ? 
                        "Photo is selected."
                    :
                        "Photo is not selected."
                    }
                    { isError ? 
                        <>
                        <hr></hr>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {error} <strong>Please try again!</strong>
                        </Alert> 
                        </>
                        : ""
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item>
                        <Link href="../login" variant="body2" sx={{mb: 2}}>
                            {"Already have an account? Sign In"}
                        </Link>
                        </Grid>
                    </Grid>
                 </Box>
             </Box>
         </Grid>
     </Grid>
     </>
    );
}

export default Register;