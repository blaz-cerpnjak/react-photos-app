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
import { Container } from '@mui/material';

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
        </Container>
        </>
    );
}

export default ShowPhoto;