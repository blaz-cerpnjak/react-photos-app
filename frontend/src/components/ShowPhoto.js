import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Container, Divider, Grid, Paper, TextField } from '@mui/material';
import Comment from './Comment.js'
import SendIcon from '@mui/icons-material/Send';

function ShowPhoto(props){
    const navigate = useNavigate()
    const { id } = useParams();
    console.log(id);

    const [photo, setPhoto] = useState([]);
    
    useEffect(function(){
        const getPhoto = async function() {
            const res = await fetch("http://localhost:3001/photos/" + id);
            const data = await res.json();
            console.log(data);
            console.log("TEST" + data.postedBy.username);
            setPhoto(data);
        }
        getPhoto();
    }, []);

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
                <Comment comment="Example"/>
                <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
                <Comment comment="Example"/>
                <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
                <Grid container>
                    <Grid item xs={10}>
                        <TextField
                            id="comment"
                            name="comment"
                            label="Comment"
                            fullWidth
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={2}>
                    <Button 
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                        }} 
                        variant="contained" 
                        endIcon={<SendIcon />}
                    >
                        Post
                    </Button>
                    <IconButton
                        sx={{
                            display: {xs : 'flex', md: 'none' },
                        }}
                    >
                        <SendIcon/>
                    </IconButton>
                    </Grid>
                </Grid>
            </Paper>
            <br></br>
            <br></br>
        </Container>
        </>
    );
}

export default ShowPhoto;