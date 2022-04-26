import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import { useContext, useState, useEffect } from 'react';
import { Alert, AlertTitle, Menu, MenuItem } from '@mui/material';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';

function Photo(props){
    const userContext = useContext(UserContext); 
    const navigate = useNavigate()
    const photo = props.photo;
    const [userLiked, setUserLiked] = useState('');
    const [imageError, setImageError] = useState('');
    const [isImageError, showImageError] = useState(false);
    const [imageSuccess, setImageSuccess] = useState('');
    const [isImageSuccess, showImageSuccess] = useState(false);
    const [error, setError] = useState('')
    const [isError, showError] = useState(false);
    const [photoMenu, setPhotoMenu] = useState(false);
    const photoMenuOpened = Boolean(photoMenu);

    const photoMenuClick = (event) => {
        setPhotoMenu(event.currentTarget);
    }

    const photoMenuClose = () => {
        setPhotoMenu(null);
    }

    const imageOnClick = (event) => {
        navigate('/photos/' + props.photo._id);
    };
    
    useEffect(function() {
        const checkUserLiked = async function() {
            if (photo && userContext.user._id) {
                for (let i = 0; i < photo.likes.length; i++) {
                    if (photo.likes[i] == userContext.user._id) {
                        setUserLiked(true);
                        break;
                    }
                }
            }
        }
        checkUserLiked();
    }, [photo]);

    async function likePhoto(e) {
        e.preventDefault();

        if (!photo)
            return;

        if (!userContext.user) {
            setImageError("You must be logged in to like this photo.");
            showImageError(true);
            return;
        }

        var likes = [];
        for (let i = 0; i < photo.likes.length; i++) {
            if (userContext.user._id == photo.likes[i] && userLiked)
                continue;
            likes.push(photo.likes[i]);
        }
        
        if (!userLiked)
            likes.push(userContext.user._id);

        const res = await fetch("http://localhost:3001/photos/" + photo._id, {
            method: "PUT",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                likes: likes
            })
        });

        if (userLiked) setUserLiked(false);
        else setUserLiked(true)
    }

    async function userOnClick(e) {
        navigate('/profile/' + props.photo.postedBy._id);
    }

    async function reportPhoto(e) {
        e.preventDefault();

        if (!photo)
            return;

        if (!userContext.user) {
            setImageError("You must be logged in to report photos.");
            showImageError(true);
            return;
        }

        var reports = [];
        for (let i = 0; i < photo.reports.length; i++) {
            if (photo.reports[i] == userContext.user._id) {
                setImageError("You've already reported this photo.");
                showImageError(true);
                return;
            }
            reports.push(photo.reports[i]);
        }

        reports.push(userContext.user._id);
        if (reports.length >= 5) {
            const putRes = await fetch("http://localhost:3001/photos/" + photo._id, {
                method: "PUT",
                credentials: "include",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    hidden: true
                })
            });
            return;
        }

        const res = await fetch("http://localhost:3001/photos/" + photo._id, {
            method: "PUT",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                reports: reports
            })
        });

        const data = await res.json();

        if(data._id === undefined){
            setError('Report Failed.');
            showError(true);
        } else {
            setImageSuccess('Reported.');
            showImageSuccess(true);
        }
        
    }

    return (
        <div>
            { props.photo &&
             <Card>
                <CardHeader
                    avatar={
                        <Avatar 
                            sx={{ bgcolor: red[500] }} 
                            src={"http://localhost:3001/"+props.photo.postedBy.path}
                            onClick={userOnClick}    
                        />
                    }
                    action={
                        <>
                        <IconButton aria-label="settings" onClick={photoMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={photoMenu}
                            open={photoMenuOpened}
                            onClose={photoMenuClose}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={reportPhoto}>
                                <FlagRoundedIcon/>
                                Report
                            </MenuItem>
                        </Menu>
                        </>
                    }
                    title={props.photo.postedBy.username}
                    subheader={props.photo.datetime}
                />
                <CardMedia
                    component="img"
                    image={"http://localhost:3001/"+props.photo.path}
                    alt={props.photo.name}
                    onClick={imageOnClick}
                />
                <CardContent>
                    <Typography>
                        {props.photo.name}
                    </Typography>
                    { photo && 
                    <Typography>
                        {photo.likes.length} likes
                    </Typography>
                    }
                </CardContent>
                <CardActions disableSpacing>
                    { userLiked ? 
                        <IconButton color="error" onClick={likePhoto}>
                            <FavoriteIcon/>
                        </IconButton>
                    :
                        <IconButton onClick={likePhoto}>
                            <FavoriteIcon/>
                        </IconButton>
                    }
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </CardActions>
            </Card>}
            { isImageError &&
                <>
                <br></br>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {imageError}
                </Alert> 
                </>
            }
            { isImageSuccess &&
                <>
                <br></br>
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    {imageSuccess}
                </Alert> 
                </>
            }
            <br></br>
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
        </div>
    );
}

export default Photo;