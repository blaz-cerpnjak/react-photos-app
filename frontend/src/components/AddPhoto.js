import { Alert, AlertTitle, Button, Container, IconButton, Step, StepLabel, Stepper } from '@mui/material';
import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/system';

const Input = styled('input')({
    display: 'none',
});

const steps = [
    'Set photo title',
    'Choose photo',
    'Publish',
];

function AddPhoto(props) {
    const userContext = useContext(UserContext); 
    const [title, setTitle] = useState('');
    const [file, setFile] = useState('');
    const [error, setError] = useState("");
    const [isError, showError] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState('');

    async function onSubmit(e){
        e.preventDefault();

        if (!title){
            setError("You must specify image title.");
            showError(true);
            return;
        }

        const formData = new FormData();
        formData.append('name', title);
        formData.append('image', file);
        const res = await fetch('http://localhost:3001/photos', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json();

        setUploaded(true);
    }

    return (
        <>
        <Container>
            <br></br>
            <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStepIndex} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            </Box>
            <br></br>
            <br></br>
            <form className="form-group" onSubmit={onSubmit}>
                {!userContext.user ? <Navigate replace to="/login" /> : ""}
                {uploaded ? <Navigate replace to="/" /> : ""}
                <input type="text" className="form-control" name="title" placeholder="Title" value={title} onChange={(e)=>{setTitle(e.target.value); setActiveStepIndex(0)}}/>
                <br></br>
                <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={(e) => {setFile(e.target.files[0]); setActiveStepIndex(1)}} />
                    <Button startIcon={<PhotoCamera/>} variant="contained" component="span">Select Photo</Button>
                    &nbsp;&nbsp;
                    { file ? 
                        "Photo is selected."
                    :
                        "Photo is not selected."
                    }
                </label>
                <br></br>
                <br></br>
                { file && title ?
                <Button startIcon={<AddIcon/>} variant="contained" onClick={onSubmit}>Upload</Button>
                :
                <Button disabled startIcon={<AddIcon/>} variant="contained" onClick={onSubmit}>Upload</Button>
                }
            </form>
            <br></br>
            { isError ?
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error} <strong>Please try again!</strong>
            </Alert> 
            : ""
            }
        </Container>
        </>
    )
}

export default AddPhoto;