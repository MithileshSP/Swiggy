import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


export default function BasicButtons({ name, click }) {
    return (
        <Stack spacing={2} direction="row">  
            <Button className="nav-button" onClick={click}>{imageSrc && <img src={imageSrc} alt={altText || "Button Icon"} className="button-icon" />}
            {name}</Button>
        </Stack>
    );
}