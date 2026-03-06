import React, { useState } from 'react';
import {
	Grid,
	TextField,
	Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import { Modal } from '../../components';
import Nui from '../../util/Nui';

const inputSx = {
	'& .MuiOutlinedInput-root': {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 14,
		color: '#fff',
		background: 'rgba(255,255,255,0.03)',
		borderRadius: '2px',
		'& fieldset': { borderColor: 'rgba(32,134,146,0.2)' },
		'&:hover fieldset': { borderColor: 'rgba(32,134,146,0.5)' },
		'&.Mui-focused fieldset': { borderColor: '#208692', borderWidth: '1px' },
	},
	'& .MuiInputLabel-root': {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 13,
		fontWeight: 600,
		color: 'rgba(255,255,255,0.35)',
		'&.Mui-focused': { color: '#208692' },
	},
};

const useStyles = makeStyles((theme) => ({
	imageContainer: {
		textAlign: 'center',
		padding: '12px 0 16px',
	},
	image: {
		maxWidth: 96,
		maxHeight: 96,
		objectFit: 'contain',
		filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
	},
	placeholder: {
		fontSize: 48,
		color: 'rgba(32,134,146,0.3)',
	},
	details: {
		marginBottom: 12,
	},
	detailRow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '5px 0',
		borderBottom: '1px solid rgba(32,134,146,0.06)',
		'&:last-child': { borderBottom: 'none' },
	},
	detailLabel: {
		color: 'rgba(32,134,146,0.5)',
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		textTransform: 'uppercase',
		fontSize: 9,
		letterSpacing: '0.2em',
	},
	detailValue: {
		color: 'rgba(255, 255, 255, 0.85)',
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 14,
		fontWeight: 600,
	},
	rarityDot: {
		display: 'inline-block',
		width: 8,
		height: 8,
		borderRadius: '50%',
		marginRight: 6,
		verticalAlign: 'middle',
	},
	section: {
		marginTop: 8,
	},
	sectionLabel: {
		fontSize: 9,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.3em',
		color: 'rgba(32,134,146,0.5)',
		textTransform: 'uppercase',
		marginBottom: 10,
	},
	divider: {
		backgroundColor: 'rgba(32,134,146,0.15)',
	},
	actionBtn: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		padding: '8px 14px',
		borderRadius: 2,
		border: '1px solid rgba(32,134,146,0.35)',
		background: 'rgba(32,134,146,0.12)',
		color: '#208692',
		fontSize: 12,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		width: '100%',
		'&:hover': {
			background: 'rgba(32,134,146,0.25)',
			borderColor: '#208692',
			boxShadow: '0 0 12px rgba(32,134,146,0.25)',
		},
		'&:disabled': {
			opacity: 0.3,
			cursor: 'not-allowed',
			'&:hover': {
				background: 'rgba(32,134,146,0.12)',
				borderColor: 'rgba(32,134,146,0.35)',
				boxShadow: 'none',
			},
		},
	},
}));

const ITEM_TYPES = {
	1: 'Consumable', 2: 'Weapon', 3: 'Tool', 4: 'Crafting', 5: 'Collectible',
	6: 'Junk', 7: 'Unknown', 8: 'Evidence', 9: 'Ammo', 10: 'Container',
	11: 'Gem', 12: 'Paraphernalia', 13: 'Wearable', 14: 'Contraband',
	15: 'Gang Chain', 16: 'Attachment', 17: 'Schematic',
};

const RARITY_LABELS = {
	0: 'Common', 1: 'Common', 2: 'Uncommon', 3: 'Rare', 4: 'Epic', 5: 'Legendary',
};

const RARITY_COLORS = {
	0: '#8e8e8e', 1: '#8e8e8e', 2: '#52984a', 3: '#4a7fb5', 4: '#9f5cd6', 5: '#f09348',
};

export default ({ open, item, onClose }) => {
	const classes = useStyles();

	const [sid, setSid] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [ammo, setAmmo] = useState(50);
	const [giving, setGiving] = useState(false);

	if (!item) return null;

	const isWeapon = item.type === 2;
	const imgSrc = `nui://mythic-inventory/ui/images/items/${item.name}.webp`;
	const typeLabel = ITEM_TYPES[item.type] || 'Unknown';
	const rarityLabel = RARITY_LABELS[item.rarity] || 'Common';
	const rarityColor = RARITY_COLORS[item.rarity] || RARITY_COLORS[0];

	const handleGive = async (toSelf) => {
		if (giving) return;
		if (!toSelf && (!sid || isNaN(parseInt(sid)))) {
			toast.error('Enter a valid State ID');
			return;
		}

		setGiving(true);
		try {
			let res = await (await Nui.send('GiveItem', {
				itemName: item.name,
				isWeapon,
				sid: toSelf ? null : parseInt(sid),
				quantity: isWeapon ? 1 : parseInt(quantity) || 1,
				ammo: isWeapon ? (parseInt(ammo) || 0) : 0,
				toSelf,
			})).json();

			if (res && res.success) {
				toast.success(res.message);
			} else {
				toast.error(res?.message || 'Failed to Give Item');
			}
		} catch (err) {
			toast.error('Error Giving Item');
		}
		setGiving(false);
	};

	return (
		<Modal
			open={open}
			title={item.label}
			maxWidth="xs"
			onClose={onClose}
		>
			<div className={classes.imageContainer}>
				<img
					className={classes.image}
					src={imgSrc}
					alt={item.label}
					onError={(e) => { e.target.style.display = 'none'; }}
				/>
			</div>

			<div className={classes.details}>
				<div className={classes.detailRow}>
					<span className={classes.detailLabel}>Item ID</span>
					<span className={classes.detailValue} style={{ fontFamily: 'monospace', fontSize: 12 }}>{item.name}</span>
				</div>
				<div className={classes.detailRow}>
					<span className={classes.detailLabel}>Type</span>
					<span className={classes.detailValue}>{typeLabel}</span>
				</div>
				<div className={classes.detailRow}>
					<span className={classes.detailLabel}>Rarity</span>
					<span className={classes.detailValue}>
						<span className={classes.rarityDot} style={{ backgroundColor: rarityColor }} />
						{rarityLabel}
					</span>
				</div>
				<div className={classes.detailRow}>
					<span className={classes.detailLabel}>Weight</span>
					<span className={classes.detailValue}>{item.weight}</span>
				</div>
				<div className={classes.detailRow}>
					<span className={classes.detailLabel}>Price</span>
					<span className={classes.detailValue}>${item.price}</span>
				</div>
				<div className={classes.detailRow}>
					<span className={classes.detailLabel}>Stackable</span>
					<span className={classes.detailValue}>
						{item.isStackable === false ? 'No' : `Yes (${item.isStackable})`}
					</span>
				</div>
				{item.description && (
					<div className={classes.detailRow}>
						<span className={classes.detailLabel}>Description</span>
						<span className={classes.detailValue} style={{ textAlign: 'right', maxWidth: '60%' }}>{item.description}</span>
					</div>
				)}
			</div>

			<Divider className={classes.divider} />

			<div className={classes.section}>
				<div className={classes.sectionLabel}>Give Item</div>
				<Grid container spacing={1}>
					{!isWeapon && (
						<Grid item xs={12}>
							<TextField
								fullWidth
								variant="outlined"
								size="small"
								label="Quantity"
								type="number"
								value={quantity}
								onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
								inputProps={{ min: 1, max: 1000 }}
								sx={inputSx}
							/>
						</Grid>
					)}
					{isWeapon && (
						<Grid item xs={12}>
							<TextField
								fullWidth
								variant="outlined"
								size="small"
								label="Ammo Amount"
								type="number"
								value={ammo}
								onChange={(e) => setAmmo(Math.max(0, parseInt(e.target.value) || 0))}
								inputProps={{ min: 0 }}
								sx={inputSx}
							/>
						</Grid>
					)}
					<Grid item xs={12}>
						<button
							className={classes.actionBtn}
							onClick={() => handleGive(true)}
							disabled={giving}
						>
							<FontAwesomeIcon icon={['fas', 'hand-holding']} />
							{giving ? 'Giving...' : 'Give to Self'}
						</button>
					</Grid>
					<Grid item xs={8}>
						<TextField
							fullWidth
							variant="outlined"
							size="small"
							label="State ID (SID)"
							type="number"
							value={sid}
							onChange={(e) => setSid(e.target.value)}
							sx={inputSx}
						/>
					</Grid>
					<Grid item xs={4}>
						<button
							className={classes.actionBtn}
							onClick={() => handleGive(false)}
							disabled={giving || !sid}
							style={{ height: '100%' }}
						>
							<FontAwesomeIcon icon={['fas', 'paper-plane']} />
							Give
						</button>
					</Grid>
				</Grid>
			</div>
		</Modal>
	);
};
