import { Container, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import Photo from './Photo';

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