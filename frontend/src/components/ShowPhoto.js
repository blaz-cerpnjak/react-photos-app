import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Alert, AlertTitle, Button, Container, Divider, Grid, Paper, TextField } from '@mui/material';
import Comment from './Comment.js'
import SendIcon from '@mui/icons-material/Send';

function ShowPhoto(props){
    const navigate = useNavigate()
    const { id } = useParams();

    const [photo, setPhoto] = useState([]);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('')
    const [isError, showError] = useState(false);

    useEffect(function(){
        const getPhoto = async function() {
            const res = await fetch("http://localhost:3001/photos/" + id);
            const data = await res.json();
            console.log(data);
            setPhoto(data);
        }
        getPhoto();
    }, []);

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

        if(data._id === undefined){
            setError('Comment was not posted.');
            showError(true);
        } else {
            setComment('');
        }
    }

    return (
        <>
        <Container>
            <Card>
                <CardHeader
                    
                />
                <CardMedia
                    component="img"
                    image={"http://localhost:3001/"+photo.path}
                    alt={photo.name}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {photo.name}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </CardActions>
            </Card>
            <br></br>
            <Paper style={{ padding: "40px 20px" }}>
                { photo.comments && photo.comments.map(comment=>(<Comment comment={comment}></Comment>))}
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
            <br></br>
            <br></br>
        </Container>
        </>
    );
}

export default ShowPhoto;