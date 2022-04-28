import { Alert, AlertTitle, Avatar, Divider, Grid, IconButton } from "@mui/material";
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../userContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useNavigate } from 'react-router-dom';

function Comment(props) {
    const navigate = useNavigate()
    const userContext = useContext(UserContext); 
    const [isAuthor, setAuthor] = useState(false);
    const [error, setError] = useState('')
    const [isError, showError] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const editClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(function(){
        const getAuthor = async function() {
            if (userContext && props.comment.postedBy._id === userContext.user._id) {
                setAuthor(true);
            } else {
                setAuthor(false);
            }
        }
        getAuthor();
    }, [userContext]);

    async function removeComment(e){
        e.preventDefault();

        if (!props.comment) {
            setError("Unable to delete comment.");
            showError(true);
            return;
        }
        showError(false);
        
        const res = await fetch("http://localhost:3001/photoComments/" + props.comment._id, {
            credentials: 'include',
            method: "DELETE" 
        });
        const data = await res.json();

        navigate('/photos/' + props.photo._id);
    }

    return (
        <div>
        <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
                { props.photo.postedBy.username &&
                <Avatar alt={props.comment.postedBy.username}  src={"http://localhost:3001/"+props.comment.postedBy.path}/>
                }
            </Grid>
            { props.comment.postedBy && 
            <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>{props.comment.postedBy.username}</h4>
                <p style={{ textAlign: "left", color: "gray" }}>{props.comment.datetime}</p>
                <p style={{ textAlign: "left", color: "black" }}>{props.comment.comment}</p>
            </Grid>
            }
            { isAuthor &&
            <Grid>
                <IconButton aria-label="settings" onClick={editClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                >
                    <MenuItem onClick={removeComment}>
                        <DeleteRoundedIcon/>
                        Remove
                    </MenuItem>
                </Menu>
            </Grid>
            }
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
        </Grid>
        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
        </div>
    );
}

export default Comment;