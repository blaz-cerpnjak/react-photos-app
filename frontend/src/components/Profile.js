import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Container, Divider, Grid, ImageList, ImageListItem, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Profile(){
    const userContext = useContext(UserContext); 
    const navigate = useNavigate()
    const { id } = useParams();
    const [profile, setProfile] = useState({});
    const [photos, setPhotos] = useState([]);
    const [likes, setLikes] = useState([]);
    
    useEffect(function() {
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile/" + id);
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    useEffect(function() {
        const getPhotos = async function(){
            const res = await fetch("http://localhost:3001/photos/user/" + id);
            const data = await res.json();
            setPhotos(data);
        }
        getPhotos();
    }, [id]);

    useEffect(function() {
        const getLikes = async function() {
            const res = await fetch("http://localhost:3001/photos/likes/user/" + id);
            const data = await res.json();
            setLikes(data);
        }
        getLikes();
    }, [id]);

    const imageOnClick = (e) => {
        navigate('/photos/' + e.target.id);
    };

    return (
        <>
            <Container>
                <br></br>
                <Grid container spacing={2}>
                    <Grid item>
                        <Avatar
                            alt={profile.username}
                            src={"http://localhost:3001/"+profile.path}
                            sx={{ width: '24vh', height: '24vh' }}
                        />
                    </Grid>
                    <Grid item sm container>
                            <Grid item xs>
                                <Typography gutterBottom variant="h4" component="div">
                                    {profile.firstname} {profile.lastname}
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    {profile.username}
                                </Typography>
                            </Grid>
                    </Grid>
                </Grid>
                {photos &&
                <Grid container>
                    <Grid>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <ImageIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={photos.length} secondary="posts" />
                        </ListItem>
                    </Grid>
                    <Grid>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <FavoriteIcon/>
                            </Avatar>
                            </ListItemAvatar>
                            {likes ?
                            <ListItemText primary={likes} secondary="likes" />
                            :
                            <ListItemText primary="0" secondary="likes" />
                            }
                        </ListItem>
                    </Grid>
                </Grid>
                }
                <br></br>
                <Divider />
                <br></br>
                { photos &&
                <ImageList cols={3}>
                    {photos.map((photo) => (
                        <ImageListItem key={photo._id} onClick={imageOnClick}>
                            <img 
                                id={photo._id}
                                src={"http://localhost:3001/"+photo.path}
                                alt={photo.name}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                }
            </Container>
        </>
    );
}

export default Profile;