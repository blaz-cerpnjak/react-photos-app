import { Avatar, Grid } from "@mui/material";

function Comment(props) {
    return (
        <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
                <Avatar alt="Remy Sharp" />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
                <p style={{ textAlign: "left" }}>{props.comment}</p>
                <p style={{ textAlign: "left", color: "gray" }}>
                posted 1 minute ago
                </p>
            </Grid>
        </Grid>
    );
}

export default Comment;