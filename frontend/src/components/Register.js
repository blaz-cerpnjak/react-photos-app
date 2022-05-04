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

const CustomTextField = styled(TextField)({
    '& label': {
        color: 'gray',
    },
    '&:hover label': {
        color: 'secondary.main',
    },
    '& label.Mui-focused': {
        color: 'gray',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'gray',
        },
        '&:hover fieldset': {
            borderColor: 'gray',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'gray',
        },
    },
});

function Register() {
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isError, showError] = useState(false);
    const [file, setFile] = useState('');
    const userContext = useContext(UserContext); 
    const navigate = useNavigate()

    async function Register(e){
        e.preventDefault();

        if (!firstname) {
            showError(true);
            setError("Firstname cannot be empty.");
            return;
        } else if (!lastname) {
            showError(true);
            setError("Lastname cannot be empty.");
            return;
        } else if (!email) {
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
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
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
         <br></br>
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
                     backgroundColor: 'background.main',
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                 }}
             />
             <Grid backgroundColor="background.main" item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                 <Box
                     sx={{
                     my: 8,
                     mx: 4,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     backgroundColor: 'background.main',
                     color: 'secondary.main'
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
                    sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': { mr: 1, ml: 1, mt: 2 },
                    }}
                    >
                    <CustomTextField
                        fullWidth
                        required
                        label="Firstname"
                        id="firstname"
                        name="firstname"
                        sx={{ input: { color: "secondary.main" } }} 
                        value={firstname} 
                        onChange={(e)=>(setFirstname(e.target.value))}
                        autoFocus
                    />
                    <CustomTextField
                        fullWidth
                        required
                        label="Lastname"
                        id="lastname"
                        name="lastname"
                        sx={{ input: { color: "secondary.main" } }} 
                        value={lastname} 
                        onChange={(e)=>(setLastname(e.target.value))}
                    />
                </Box>
                 <Box 
                     component="form" 
                     noValidate sx={{ m: 1 }}
                     onSubmit={Register}    
                 >
                    <CustomTextField
                         margin="normal"
                         required
                         fullWidth
                         id="username"
                         label="Username"
                         name="username"
                         sx={{ input: { color: "secondary.main" } }} 
                         value={username} 
                         onChange={(e)=>(setUsername(e.target.value))}
                         autoComplete="current-username"
                     />
                     <CustomTextField
                         margin="normal"
                         required
                         fullWidth
                         id="email"
                         label="Email"
                         name="email"
                         sx={{ input: { color: "secondary.main" } }} 
                         value={email} 
                         onChange={(e)=>(setEmail(e.target.value))}
                         autoComplete="current-email"
                     />
                     <CustomTextField
                         margin="normal"
                         required
                         fullWidth
                         name="password"
                         label="Password"
                         sx={{ input: { color: "secondary.main" } }} 
                         type="password"
                         id="password"
                         value={password} 
                         onChange={(e)=>(setPassword(e.target.value))}
                         autoComplete="current-password"
                     />
                     <hr></hr>
                     <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" name="file" multiple type="file" onChange={(e) => {setFile(e.target.files[0])}} />
                        <Button startIcon={<PhotoCamera/>} variant="contained" component="span" sx={{ backgroundColor: "btnBlue.main", color: "white" }}>Select Photo</Button>
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
                        sx={{ mt: 3, mb: 2, backgroundColor: "btnBlue.main", color: "white" }}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item>
                        <Link color='btnBlue.main' href="../login" variant="body2" sx={{mb: 2}}>
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