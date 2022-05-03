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
import { ListItemIcon, ListItemText, Stack } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import Zoom from '@mui/material/Zoom';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

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
        <AppBar>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', background: 'background.main' }}>
        <Container>
            <Toolbar disableGutters>
            <Tooltip TransitionComponent={Zoom} title="Home">
                <IconButton onClick={handleHomeOnClick}>
                    <CameraIcon sx={{display: { xs: 'none', md: 'flex' }, color: 'secondary.main' }}/>
                </IconButton>
            </Tooltip>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2, display: { xs: 'none', md: 'flex', color: 'secondary.main' }, flexGrow: 1 }}
            >
                PHOTOGRAM
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    sx={{ color: 'seconday.main' }}
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
                        <MenuItem id="Home" onClick={handlePageOnClick}>
                            <ListItemIcon sx={{ color: 'secondary.main' }}>
                                <HomeRoundedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Home</ListItemText>
                        </MenuItem>
                </Menu>
            </Box>
            <IconButton onClick={handleHomeOnClick}>
                <CameraIcon sx={{ display: { xs: 'flex', md: 'none' }, color: 'secondary.main' }} />
            </IconButton>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', color: 'secondary.main' } }}
            >
                PHOTOGRAM
            </Typography>
            <Stack
                direction='row'
                spacing={1}
                mr={2}
                sx={{ display: { xs: 'none', md: 'flex' } }}
            >
                <Tooltip TransitionComponent={Zoom} title="Home">
                    <IconButton onClick={handleHomeOnClick}>
                        <HomeRoundedIcon sx={{ color: 'secondary.main' }}/>
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title="Upload">
                    <IconButton onClick={handleUploadOnClick}>
                        <AddBoxOutlinedIcon sx={{ color: 'secondary.main' }}/>
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title="Explore">
                    <IconButton>
                        <ExploreOutlinedIcon sx={{ color: 'secondary.main' }}/>
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title="Likes">
                    <IconButton>
                        <FavoriteBorderOutlinedIcon sx={{ color: 'secondary.main' }}/>
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title={ props.darkMode ? "Light mode" : "Dark mode" }>
                    <IconButton sx={{ ml: 1 }} onClick={props.onChange} color="secondary">
                        { props.darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon /> }
                    </IconButton>
            </Tooltip>
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
                    <Button sx={{ color: 'secondary.main' }} href="/login">Sign In</Button>
                )}
            </UserContext.Consumer>
            </Toolbar>
        </Container>
    </Box>
    </AppBar>
    );
}

export default Header;