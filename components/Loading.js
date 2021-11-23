import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </div>
    )
}

export default Loading;
