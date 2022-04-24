import { Avatar, Divider, Grid } from "@mui/material";

function Comment(props) {
    return (
        <>
        <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
                <Avatar alt="Remy Sharp" />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>{props.comment.postedBy.username}</h4>
                <p style={{ textAlign: "left", color: "gray" }}>{props.comment.datetime}</p>
                <p style={{ textAlign: "left", color: "black" }}>{props.comment.comment}</p>
            </Grid>
        </Grid>
        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
        </>
    );
}

export default Comment;