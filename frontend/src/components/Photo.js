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

function Photo(props){
    const navigate = useNavigate()

    const photo = props.photo;

    const imageOnClick = (event) => {
        navigate('/photos/' + props.photo._id);
    };
    console.log("Photo props: " + photo);
    return (
        <div>
            { props.photo ?
             <Card>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} src={"http://localhost:3001/"+props.photo.postedBy.path}></Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
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
                    <Typography variant="body2" color="text.secondary">
                        {props.photo.name}
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
            </Card> : "" }
            <br></br>
        </div>
    );
}

export default Photo;