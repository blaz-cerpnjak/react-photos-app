import { Alert, Container, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import Photo from './Photo';
var decay = require('decay')
var hotScore = decay.redditHot();

function Photos(){
    const [photos, setPhotos] = useState([]);

    useEffect(function(){
        const getPhotos = async function(){
            const res = await fetch("http://localhost:3001/photos");
            const data = await res.json();
            setPhotos(data);
        }
        getPhotos();
    }, []);

    setInterval(function() {
        var candidates = photos;
        console.log("Updating photo scores ...");
        candidates.forEach(function(photo) {
            photo.score = hotScore(photo.likes.length, photo.reports.length, new Date(photo.datetime));
            updatePhoto(photo);
        });
        resetPhotos();
    }, 1000 * 60 * 5);

    async function resetPhotos() {
        const res = await fetch("http://localhost:3001/photos");
        const data = await res.json();
        setPhotos(data);
    }

    async function updatePhoto(photo) {
        const res = await fetch("http://localhost:3001/photos/" + photo._id, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                score: photo.score
            })
        });
    }

    return(
        <>
            <Container>
                <br></br>
                <h3>Photos:</h3>
                <br></br>
                <Grid 
                    container
                    xs={12}
                    md={6}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    {photos.map(photo=>(<Photo photo={photo} key={photo._id}></Photo>))}
                </Grid>
                <br></br>
            </Container>
        </>
    );
}

export default Photos;