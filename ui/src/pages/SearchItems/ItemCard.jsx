import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
	card: {
		background: 'rgba(18, 16, 37, 0.96)',
		border: '1px solid rgba(32,134,146,0.15)',
		borderRadius: 2,
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		overflow: 'hidden',
		'&:hover': {
			borderColor: 'rgba(32,134,146,0.5)',
			boxShadow: '0 0 16px rgba(32,134,146,0.15)',
		},
	},
	imageContainer: {
		width: '100%',
		aspectRatio: '1',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		position: 'relative',
	},
	image: {
		width: '68%',
		height: '68%',
		objectFit: 'contain',
		filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))',
	},
	placeholder: {
		width: '68%',
		height: '68%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 24,
		color: 'rgba(32,134,146,0.2)',
	},
	body: {
		padding: '0 8px 8px',
	},
	label: {
		fontSize: 11,
		fontWeight: 600,
		fontFamily: "'Rajdhani', sans-serif",
		color: 'rgba(255, 255, 255, 0.9)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: 1.2,
	},
	name: {
		fontSize: 9,
		color: 'rgba(255, 255, 255, 0.3)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		marginTop: 1,
		fontFamily: 'monospace',
	},
	badges: {
		display: 'flex',
		gap: 4,
		marginTop: 5,
		flexWrap: 'wrap',
	},
	badge: {
		fontSize: 8,
		padding: '2px 5px',
		borderRadius: 2,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
	},
	typeBadge: {
		background: 'rgba(32,134,146,0.15)',
		color: 'rgba(32,134,146,0.8)',
		border: '1px solid rgba(32,134,146,0.25)',
	},
}));

export default ({ item, onClick, rarityColor, typeLabel }) => {
	const classes = useStyles();
	const [imgErr, setImgErr] = useState(false);
	const imgSrc = `nui://mythic-inventory/ui/images/items/${item.name}.webp`;

	return (
		<div className={classes.card} onClick={onClick}>
			<div className={classes.imageContainer}>
				{imgErr ? (
					<div className={classes.placeholder}>
						<FontAwesomeIcon icon={['fas', 'cube']} />
					</div>
				) : (
					<img
						className={classes.image}
						src={imgSrc}
						alt={item.label}
						draggable={false}
						onError={() => setImgErr(true)}
					/>
				)}
			</div>
			<div className={classes.body}>
				<div className={classes.label} title={item.label}>{item.label}</div>
				<div className={classes.name} title={item.name}>{item.name}</div>
				<div className={classes.badges}>
					<span className={`${classes.badge} ${classes.typeBadge}`}>
						{typeLabel}
					</span>
					<span
						className={classes.badge}
						style={{
							background: `${rarityColor}18`,
							color: rarityColor,
							border: `1px solid ${rarityColor}40`,
						}}
					>
						R{item.rarity}
					</span>
				</div>
			</div>
		</div>
	);
};
