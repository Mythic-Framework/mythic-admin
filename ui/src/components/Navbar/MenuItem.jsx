import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

export default (props) => {
	const useStyles = makeStyles((theme) => ({
		link: {
			paddingLeft: props.nested ? `15% !important` : null,
			color: 'rgba(255,255,255,0.5)',
			height: 52,
			transition: 'all 0.2s ease',
			fontFamily: "'Rajdhani', sans-serif",
			position: 'relative',
			borderBottom: '1px solid rgba(32,134,146,0.06)',
			'& svg': {
				fontSize: 16,
				transition: 'color 0.2s ease',
				color: 'rgba(255,255,255,0.3)',
			},
			'& .MuiListItemText-primary': {
				fontFamily: "'Rajdhani', sans-serif",
				fontSize: 13,
				fontWeight: 600,
				letterSpacing: '0.08em',
			},
			'&:hover': {
				color: '#ffffff',
				background: 'rgba(32,134,146,0.05)',
				cursor: 'pointer',
				'& svg': {
					color: '#208692',
				},
			},
			'&.active': {
				color: '#ffffff',
				background: 'rgba(32,134,146,0.08)',
				'& svg': {
					color: '#208692',
				},
			},
		},
		accentBar: {
			position: 'absolute',
			left: 0,
			top: 0,
			bottom: 0,
			width: 3,
			background: '#208692',
			boxShadow: '0 0 8px rgba(32,134,146,0.6)',
			opacity: 0,
			transition: 'opacity 0.2s ease',
			'.active &': {
				opacity: 1,
			},
		},
	}));
	const classes = useStyles();

	return (
		<ListItem
			button
			exact={props.link.exact}
			className={classes.link}
			component={NavLink}
			to={props.link.path}
			name={props.link.name}
			onClick={props.onClick}
		>
			<div className={classes.accentBar} />
			<ListItemIcon>
				<FontAwesomeIcon icon={props.link.icon} />
			</ListItemIcon>
			{!props.compress ? (
				<ListItemText primary={props.link.label} />
			) : null}
		</ListItem>
	);
};
