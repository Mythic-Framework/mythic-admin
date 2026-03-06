import React, { useState, useEffect } from 'react';
import {
	Grid,
	TextField,
	Dialog,
	DialogContent,
	Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

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
	dialog: {
		'& .MuiDialog-paper': {
			background: '#121025',
			border: '1px solid rgba(32,134,146,0.25)',
			boxShadow: '0 0 0 1px rgba(32,134,146,0.06), 0 24px 80px rgba(0,0,0,0.7)',
			borderRadius: 2,
			width: 420,
			maxWidth: 420,
			color: '#fff',
			overflow: 'hidden',
		},
		'& .MuiBackdrop-root': {
			backgroundColor: 'rgba(0,0,0,0.5)',
		},
	},
	hero: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '24px 0 16px',
		overflow: 'hidden',
	},
	heroBg: {
		position: 'absolute',
		inset: 0,
		background: 'radial-gradient(ellipse at 50% 60%, rgba(32,134,146,0.06) 0%, transparent 70%)',
		pointerEvents: 'none',
	},
	heroImg: {
		width: 88,
		height: 88,
		objectFit: 'contain',
		position: 'relative',
		zIndex: 1,
		filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
	},
	heroImgFallback: {
		width: 88,
		height: 88,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: 'rgba(32,134,146,0.3)',
		fontSize: 36,
		position: 'relative',
		zIndex: 1,
	},
	info: {
		textAlign: 'center',
		padding: '0 28px 16px',
	},
	itemLabel: {
		fontSize: 16,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		color: '#fff',
		letterSpacing: '0.02em',
	},
	itemName: {
		fontSize: 11,
		color: 'rgba(255,255,255,0.3)',
		fontFamily: 'monospace',
		marginTop: 2,
	},
	tags: {
		display: 'flex',
		justifyContent: 'center',
		gap: 6,
		marginTop: 8,
	},
	tag: {
		fontSize: 9,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.08em',
		textTransform: 'uppercase',
		padding: '3px 8px',
		borderRadius: 2,
		background: 'rgba(32,134,146,0.1)',
		color: 'rgba(32,134,146,0.7)',
		border: '1px solid rgba(32,134,146,0.2)',
	},
	tagMuted: {
		fontSize: 9,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.08em',
		textTransform: 'uppercase',
		padding: '3px 8px',
		borderRadius: 2,
		background: 'rgba(255,255,255,0.03)',
		color: 'rgba(255,255,255,0.3)',
		border: '1px solid rgba(255,255,255,0.06)',
	},
	divider: {
		backgroundColor: 'rgba(32,134,146,0.15)',
	},
	details: {
		padding: '12px 28px 8px',
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
		padding: '12px 28px 16px',
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
	targetBanner: {
		display: 'flex',
		alignItems: 'center',
		gap: 6,
		padding: '6px 10px',
		marginBottom: 10,
		background: 'rgba(32,134,146,0.08)',
		border: '1px solid rgba(32,134,146,0.2)',
		borderRadius: 2,
		fontSize: 11,
		fontWeight: 600,
		fontFamily: "'Rajdhani', sans-serif",
		color: '#208692',
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
	footer: {
		display: 'flex',
		gap: 8,
		padding: '12px 28px 20px',
		borderTop: '1px solid rgba(32,134,146,0.15)',
		background: 'rgba(10, 8, 28, 0.5)',
	},
	cancelBtn: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		padding: '8px 14px',
		borderRadius: 2,
		border: '1px solid rgba(255,255,255,0.08)',
		background: 'transparent',
		color: 'rgba(255,255,255,0.4)',
		fontSize: 12,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			borderColor: 'rgba(255,255,255,0.2)',
			color: 'rgba(255,255,255,0.7)',
		},
	},
	result: {
		margin: '0 28px 12px',
		padding: '8px 12px',
		borderRadius: 2,
		fontSize: 12,
		fontWeight: 600,
		fontFamily: "'Rajdhani', sans-serif",
		textAlign: 'center',
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

const HeroImage = ({ item, classes }) => {
	const [err, setErr] = useState(false);
	const imgSrc = `nui://mythic-inventory/ui/images/items/${item.name}.webp`;
	if (err) {
		return (
			<div className={classes.heroImgFallback}>
				<FontAwesomeIcon icon={['fas', 'cube']} />
			</div>
		);
	}
	return (
		<img
			className={classes.heroImg}
			src={imgSrc}
			alt={item.label}
			draggable={false}
			onError={() => setErr(true)}
		/>
	);
};

export default ({ open, item, onClose, targetSid = '', targetName = '' }) => {
	const classes = useStyles();

	const [sid, setSid] = useState(targetSid);
	const [quantity, setQuantity] = useState(1);
	const [ammo, setAmmo] = useState(50);
	const [giving, setGiving] = useState(false);
	const [result, setResult] = useState(null);

	useEffect(() => {
		setSid(targetSid);
	}, [targetSid]);

	useEffect(() => {
		if (open) {
			setQuantity(1);
			setAmmo(50);
			setGiving(false);
			setResult(null);
			setSid(targetSid);
		}
	}, [open, item]);

	if (!item) return null;

	const isWeapon = item.type === 2;
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
		setResult(null);
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
				setResult({ ok: true, msg: res.message });
				toast.success(res.message);
			} else {
				setResult({ ok: false, msg: res?.message || 'Failed to Give Item' });
				toast.error(res?.message || 'Failed to Give Item');
			}
		} catch (err) {
			setResult({ ok: false, msg: 'Error Giving Item' });
			toast.error('Error Giving Item');
		}
		setGiving(false);
	};

	const handleClose = () => {
		setResult(null);
		setGiving(false);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} className={classes.dialog}>
			<div className={classes.hero}>
				<div className={classes.heroBg} />
				<HeroImage item={item} classes={classes} />
			</div>

			<div className={classes.info}>
				<div className={classes.itemLabel}>{item.label}</div>
				<div className={classes.itemName}>{item.name}</div>
				<div className={classes.tags}>
					<span className={classes.tag}>{typeLabel}</span>
					{item.weight > 0 && <span className={classes.tagMuted}>{item.weight} lbs</span>}
					<span className={classes.tagMuted} style={{ color: rarityColor, borderColor: `${rarityColor}40` }}>
						<span className={classes.rarityDot} style={{ backgroundColor: rarityColor }} />
						{rarityLabel}
					</span>
				</div>
			</div>

			<Divider className={classes.divider} />

			<div className={classes.details}>
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
						<span className={classes.detailValue} style={{ textAlign: 'right', maxWidth: '60%', fontSize: 12 }}>{item.description}</span>
					</div>
				)}
			</div>

			<Divider className={classes.divider} />

			<div className={classes.section}>
				<div className={classes.sectionLabel}>Give Item</div>

				{targetSid && targetName && (
					<div className={classes.targetBanner}>
						<FontAwesomeIcon icon={['fas', 'crosshairs']} />
						Target: {targetName} (SID {targetSid})
					</div>
				)}

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
					{!targetSid && (
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
					)}
					<Grid item xs={targetSid ? 12 : 8}>
						<TextField
							fullWidth
							variant="outlined"
							size="small"
							label="State ID (SID)"
							type="number"
							value={sid}
							onChange={(e) => setSid(e.target.value)}
							sx={inputSx}
							disabled={!!targetSid}
						/>
					</Grid>
					{!targetSid && (
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
					)}
					{targetSid && (
						<Grid item xs={12}>
							<button
								className={classes.actionBtn}
								onClick={() => handleGive(false)}
								disabled={giving || !sid}
							>
								<FontAwesomeIcon icon={['fas', 'paper-plane']} />
								{giving ? 'Giving...' : `Give to ${targetName || 'Player'}`}
							</button>
						</Grid>
					)}
				</Grid>
			</div>

			{result && (
				<div
					className={classes.result}
					style={{
						backgroundColor: result.ok ? 'rgba(82, 152, 74, 0.1)' : 'rgba(240, 68, 68, 0.1)',
						color: result.ok ? '#52984a' : '#f04444',
						border: `1px solid ${result.ok ? 'rgba(82, 152, 74, 0.2)' : 'rgba(240, 68, 68, 0.2)'}`,
					}}
				>
					{result.msg}
				</div>
			)}

			<div className={classes.footer}>
				<button className={classes.cancelBtn} onClick={handleClose}>
					Close
				</button>
			</div>
		</Dialog>
	);
};
