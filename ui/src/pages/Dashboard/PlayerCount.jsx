import React from 'react';
import { Grid, Card, CardContent, Divider, Avatar, Box, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    card: {
        textAlign: 'center',
        background: 'rgba(18, 16, 37, 0.96)',
        border: '1px solid rgba(32,134,146,0.2)',
        boxShadow: '0 0 0 1px rgba(32,134,146,0.06), 0 24px 80px rgba(0,0,0,0.7)',
        borderRadius: 2,
    },
    statLabel: {
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(32,134,146,0.5)',
        fontFamily: "'Rajdhani', sans-serif",
        margin: 0,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 700,
        fontFamily: "'Orbitron', sans-serif",
        color: '#ffffff',
        letterSpacing: '0.05em',
        marginBottom: 0,
        marginTop: 4,
    },
    divider: {
        backgroundColor: 'rgba(32,134,146,0.15)',
    },
    progressWrapper: {
        padding: 23,
    },
    progress: {
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(32,134,146,0.1)',
        '& .MuiLinearProgress-bar': {
            borderRadius: 2,
            background: 'linear-gradient(90deg, #0e5a62, #208692)',
            boxShadow: '0 0 8px rgba(32,134,146,0.4)',
        },
    },
}));

export default ({ players, max, queue }) => {
	const classes = useStyles();

	return (
        <Card className={classes.card} variant="outlined">
            <Box display={'flex'}>
                <Box p={2} flex={'auto'}>
                    <p className={classes.statLabel}>Online Players</p>
                    <p className={classes.statValue}>{players}</p>
                </Box>
                <Box p={2} flex={'auto'}>
                    <p className={classes.statLabel}>Players in Queue</p>
                    <p className={classes.statValue}>{queue}</p>
                </Box>
            </Box>
            <Divider className={classes.divider} />
            <CardContent className={classes.progressWrapper}>
                <LinearProgress className={classes.progress} variant="determinate" value={Math.floor((players / max) * 100)} />
            </CardContent>
        </Card>
	);
};
