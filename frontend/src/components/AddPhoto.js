import { Container, IconButton } from '@mui/material';
import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

function AddPhoto(props) {
    const userContext = useContext(UserContext); 
    const[name, setTitle] = useState('');
    const[file, setFile] = useState('');
    const[uploaded, setUploaded] = useState(false);

    async function onSubmit(e){
        e.preventDefault();

        if(!name){
            alert("Vnesite ime!");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
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
            <form className="form-group" onSubmit={onSubmit}>
                {!userContext.user ? <Navigate replace to="/login" /> : ""}
                {uploaded ? <Navigate replace to="/" /> : ""}
                <input type="text" className="form-control" name="ime" placeholder="Title" value={name} onChange={(e)=>{setTitle(e.target.value)}}/>
                <label>Izberi sliko</label>
                <input type="file" id="file" onChange={(e)=>{setFile(e.target.files[0])}}/>
                <Input accept="image/*" id="icon-button-file" type="file" />
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                </IconButton>
                <input className="btn btn-primary" type="submit" name="submit" value="Naloži" />
            </form>
        </Container>
        </>
    )
}

export default AddPhoto;