import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
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
import { styled } from '@mui/material/styles';

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

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isError, showError] = useState(false);
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();

        if (!username) {
            setError("Invalid username.");
            showError(true);
            return;
        } else if (!password) {
            setError("Invalid password.");
            showError(true);
            return;
        }

        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            userContext.setUserContext(data);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password.");
            showError(true);
        }
    }

    return (
        <div>
            {userContext.user ? <Navigate replace to="/" /> : ""}
            <br></br>
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
                        backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid backgroundColor="background.main" item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <br></br>
                    <br></br>
                    <Box
                        sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'secondary.main',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <AccountCircleRoundedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box 
                            component="form" 
                            noValidate sx={{ mt: 1 }}
                            onSubmit={Login}    
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
                                autoFocus
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: "btnBlue.main", color: "white" }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item>
                                <Link href="../register" color='btnBlue.main' variant="body2" sx={{mb: 2}}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                                </Grid>
                            </Grid>
                            { isError ? 
                                <>
                                <br></br>
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    {error} <strong>Please try again!</strong>
                                </Alert> 
                                </>
                                : ""
                            }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default Login;