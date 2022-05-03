import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
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
import Moment from 'moment';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

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

function ShowPhoto(props){
    const navigate = useNavigate()
    const { id } = useParams();
    const userContext = useContext(UserContext); 
    const [photo, setPhoto] = useState([]);
    const [isAuthor, setAuthor] = useState(false);
    const [comment, setComment] = useState('');
    const [photoMenu, setPhotoMenu] = useState(false);
    const photoMenuOpened = Boolean(photoMenu);
    const [userLiked, setUserLiked] = useState(false);    
    const [snackbarOpened, setSnackbarOpened] = useState(false);
    const [snackbarErrorOpened, setSnackbarOpenedError] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [datetime, setDatetime] = useState('');

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
        setSnackbarOpenedError(false);
    };

    async function userOnClick(e) {
        navigate('/profile/' + photo.postedBy._id);
    }

    useEffect(function(){
        const getPhoto = async function() {
            const res = await fetch("http://localhost:3001/photos/" + id);
            const data = await res.json();
            setPhoto(data);
            setDatetime(data.datetime);
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

        if (!userContext.user) {
            setSnackbarText("You must be logged to be able to comment photos.");
            setSnackbarOpenedError(true);
            setComment('');
            return;
        }

        if (!comment) {
            setSnackbarOpenedError(true);
            setSnackbarText("You must write comment first.");
            return;
        }
        
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
        setPhoto(data);
    }

    async function likePhoto(e) {
        e.preventDefault();

        if (!photo)
            return;

        if (!userContext.user) {
            setSnackbarOpenedError(true);
            setSnackbarText("You must be logged in to be able to like this photo.");
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
        const data = await res.json();
        setPhoto(data);

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
            setSnackbarOpenedError(true);
            setSnackbarText("You must be logged in to be able to report photos.");
            return;
        }

        var reports = [];
        for (let i = 0; i < photo.reports.length; i++) {
            if (photo.reports[i] == userContext.user._id) {
                setSnackbarOpenedError(true);
            setSnackbarText("You've already reported this photo.");
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

        if(data._id === undefined) {
            setSnackbarOpenedError(true);
            setSnackbarText("Somethink went wrong with your report. Try again!");
        } else {
            setSnackbarOpened(true);
            setSnackbarText("Photo reported");
        }
        
    }

    return (
        <>
        <Container>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            { photo.path &&
             <Card sx={{ backgroundColor: "primary.main" }}>
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
                        <IconButton color="secondary" aria-label="settings" onClick={photoMenuClick}>
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
                    subheader={<p style={{ color: 'gray' }}>{Moment(datetime).format('d.MM.yyyy HH:mm')}</p>}
                    sx={{ color: "secondary.main" }}
                /> 
                }
                <CardMedia
                    component="img"
                    image={"http://localhost:3001/"+photo.path}
                    alt={photo.name}
                />
                <CardContent>
                    <Typography color="secondary.main">
                        {photo.name}
                    </Typography>
                    {photo.likes && 
                    <Typography color="secondary.main">
                        {photo.likes.length} likes
                    </Typography>
                    }
                </CardContent>
                <CardActions disableSpacing>
                    { userLiked ? 
                    <Tooltip TransitionComponent={Zoom} title="Unlike">
                        <IconButton color="error" onClick={likePhoto}>
                            <FavoriteIcon/>
                        </IconButton>
                    </Tooltip>
                    :
                    <Tooltip TransitionComponent={Zoom} title="Like">
                        <IconButton sx={{ color: "secondary.main" }} onClick={likePhoto}>
                            <FavoriteIcon/>
                        </IconButton>
                    </Tooltip>
                    }
                    <Tooltip TransitionComponent={Zoom} title="Share">
                        <IconButton sx={{ color: "secondary.main" }} aria-label="share">
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card> 
            }
            <br></br>
            <Paper sx={{ backgroundColor: "primary.main" }} style={{ padding: "40px 20px" }}>
                { photo && photo.comments && 
                    photo.comments.map(comment => (<Comment key={comment.id} photo={photo} comment={comment}/>))
                }
                <Grid container>
                    <Grid item xs={10}>
                        <CustomTextField 
                            id="comment"
                            name="comment"
                            value={comment}
                            onChange={(e)=>{setComment(e.target.value)}}
                            sx={{ input: { color: "secondary.main" } }} 
                            fullWidth 
                            label="Comment"
                        />
                    </Grid>
                    <Grid item xs={2}>
                    <Button 
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            backgroundColor: "btnBlue.main", 
                            color: "white"
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
                            backgroundColor: "btnBlue.main", 
                            color: "white"
                        }}
                        onClick={postComment}
                    >
                        <SendIcon/>
                    </IconButton>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar open={snackbarOpened} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarText}
                </Alert>
            </Snackbar>
            <Snackbar open={snackbarErrorOpened} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
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