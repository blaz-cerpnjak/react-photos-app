import * as React from 'react';
import { useContext } from "react";
import { UserContext } from "../userContext";
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import { Icon, Stack } from '@mui/material';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const settings = ['Upload Photo', 'Profile', 'Logout'];

function Header(props) {
    const userContext = useContext(UserContext); 
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    /* Icon Buttons */
    const handleHomeOnClick = (event) => {
        navigate('/');
    };
    const handleUploadOnClick  = (event) => {
        navigate('/publish');
    };

    /* User Menu */
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handlePageOnClick = (event) => {
        switch (event.currentTarget.id) {
            case "Home":
                navigate('/');
                break;
        }
        setAnchorElNav(null);
    };

    const handleUserMenuClick = (event) => {
        switch (event.currentTarget.id) {
            case "Upload Photo":
                navigate('/publish');
                break;
            case "Profile":
                navigate('/profile/' + userContext.user._id);
                break;
            case "Logout":
                navigate('/logout');
                break;
        }
        setAnchorElUser(null);
    };

    return (
        <>
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                <IconButton onClick={handleHomeOnClick}>
                    <CameraIcon sx={{display: { xs: 'none', md: 'flex' }, color: 'white' }}/>
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}
                >
                    PHOTOGRAM
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                    <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                        >
                            <MenuItem id="Home" onClick={handlePageOnClick}>Home</MenuItem>
                    </Menu>
                </Box>
                <IconButton onClick={handleHomeOnClick}>
                    <CameraIcon sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }} />
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                >
                    PHOTOGRAM
                </Typography>
                <Stack
                    direction='row'
                    spacing={1}
                    mr={2}
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    <IconButton onClick={handleHomeOnClick}>
                        <HomeRoundedIcon sx={{ color: 'white' }}/>
                    </IconButton>
                    <IconButton onClick={handleUploadOnClick}>
                        <AddBoxRoundedIcon sx={{ color: 'white' }}/>
                    </IconButton>
                </Stack>
                <UserContext.Consumer>
                    { context => (context.user ? 
                        <Box>
                            <Tooltip title="Settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={userContext.user.username} src={"http://localhost:3001/"+userContext.user.path}></Avatar>
                            </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                >
                                {settings.map((setting) => (
                                    <MenuItem id={setting} key={setting} onClick={handleUserMenuClick}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    : 
                        <Button color="inherit" href="/login">Sign In</Button>
                    )}
                </UserContext.Consumer>
                </Toolbar>
            </Container>
        </AppBar>
    </>
    );
}

export default Header;