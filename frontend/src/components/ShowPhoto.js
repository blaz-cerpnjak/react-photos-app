import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Alert, AlertTitle, Button, Container, Divider, Grid, Menu, MenuItem, Paper, TextField } from '@mui/material';
import Comment from './Comment.js'
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import { UserContext } from '../userContext';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Snackbar from '@mui/material/Snackbar';

function ShowPhoto(props){
    const navigate = useNavigate()
    const { id } = useParams();
    const userContext = useContext(UserContext); 
    const [photo, setPhoto] = useState([]);
    const [isAuthor, setAuthor] = useState(false);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('')
    const [isError, showError] = useState(false);
    const [imageError, setImageError] = useState('');
    const [isImageError, showImageError] = useState(false);
    const [photoMenu, setPhotoMenu] = useState(false);
    const photoMenuOpened = Boolean(photoMenu);
    const [userLiked, setUserLiked] = useState(false);    
    const [snackbarOpened, setSnackbarOpened] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');

    const photoMenuClick = (event) => {
        setPhotoMenu(event.currentTarget);
    }

    const photoMenuClose = () => {
        setPhotoMenu(null);
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        
        setSnackbarOpened(false);
    };

    async function userOnClick(e) {
        navigate('/profile/' + photo.postedBy._id);
    }

    useEffect(function(){
        const getPhoto = async function() {
            const res = await fetch("http://localhost:3001/photos/" + id);
            const data = await res.json();
            setPhoto(data);
        }
        getPhoto();
    }, [id]);

    useEffect(function(){
        const getAuthor = async function() {
            if (userContext && photo.postedBy._id === userContext.user._id) {
                setAuthor(true);
            } else {
                setAuthor(false);
            }
        }
        getAuthor();
    }, [photo, userContext]);

    useEffect(function() {
        const checkUserLiked = async function() {
            if (photo.likes) {
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

    async function postComment(e){
        e.preventDefault();

        if (!comment) {
            setError("You must write comment first.");
            showError(true);
            return;
        }
        showError(false);
        
        const res = await fetch("http://localhost:3001/photos/comment", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                photoId: id,
                comment: comment
            })
        });
        const data = await res.json();
        console.log(data);
        setComment('');
        
    }

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

        const res = await fetch("http://localhost:3001/photos/" + id, {
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

    async function removePhoto(e) {
        e.preventDefault();

        const res = await fetch("http://localhost:3001/photos/" + id, {
            method: "DELETE",
            credentials: "include",
        });
        navigate("/");
    }

    async function reportPhoto(e) {
        e.preventDefault();

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
            const putRes = await fetch("http://localhost:3001/photos/" + id, {
                method: "PUT",
                credentials: "include",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    hidden: true
                })
            });
            return;
        }

        const res = await fetch("http://localhost:3001/photos/" + id, {
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
            setSnackbarOpened(true);
            setSnackbarText("Photo reported.");
        }
        
    }

    return (
        <>
        <Container>
            <br></br>
            { photo.path &&
             <Card>
                { photo.postedBy && 
                <CardHeader
                    avatar={
                        <Avatar 
                            alt={photo.postedBy.username}
                            src={"http://localhost:3001/"+photo.postedBy.path} 
                            onClick={userOnClick}>
                        </Avatar>
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
                            { isAuthor &&
                                <MenuItem onClick={removePhoto}>
                                    <DeleteRoundedIcon/>
                                    Remove
                                </MenuItem>
                            }
                        </Menu>
                        </>
                    }
                    title={photo.postedBy.username}
                    subheader={photo.datetime}
                /> 
                }
                <CardMedia
                    component="img"
                    image={"http://localhost:3001/"+photo.path}
                    alt={photo.name}
                />
                <CardContent>
                    <Typography>
                        {photo.name}
                    </Typography>
                    {photo.likes && 
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
            </Card> 
            }
            { isImageError &&
                <>
                <br></br>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {imageError}
                </Alert> 
                </>
            }
            <br></br>
            <Paper style={{ padding: "40px 20px" }}>
                { photo.comments && 
                    photo.comments.map(comment => (<Comment key={comment.id} photo={photo} comment={comment}/>))
                }
                <Grid container>
                    <Grid item xs={10}>
                        <TextField
                            id="comment"
                            name="comment"
                            label="Comment"
                            fullWidth
                            value={comment} 
                            onChange={(e)=>{setComment(e.target.value)}}
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={2}>
                    <Button 
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                        }} 
                        variant="contained" 
                        onClick={postComment}
                        endIcon={<SendIcon />}
                    >
                        Post
                    </Button>
                    <IconButton
                        sx={{
                            display: {xs : 'flex', md: 'none' },
                        }}
                        onClick={postComment}
                    >
                        <SendIcon/>
                    </IconButton>
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
            </Paper>
            <Snackbar open={snackbarOpened} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarText}
                </Alert>
            </Snackbar>
            <br></br>
            <br></br>
        </Container>
        </>
    );
}

export default ShowPhoto;