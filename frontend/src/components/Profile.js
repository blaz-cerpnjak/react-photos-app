import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, ImageList, ImageListItem, Typography } from '@mui/material';

function Profile(){
    const userContext = useContext(UserContext); 
    const navigate = useNavigate()
    const { id } = useParams();
    const [profile, setProfile] = useState({});
    const [photos, setPhotos] = useState([]);

    useEffect(function(){
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    useEffect(function(){
        const getPhotos = async function(){
            const res = await fetch("http://localhost:3001/photos/user/" + id);
            const data = await res.json();
            setPhotos(data);
        }
        getPhotos();
    }, [id]);

    const imageOnClick = (e) => {
        navigate('/photos/' + e.target.id);
    };

    return (
        <>
            <Container>
                <br></br>
                <Typography variant="h4">
                    {profile.username}            
                </Typography>
                <Typography variant="subtitle1">
                    {profile.email}            
                </Typography>
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