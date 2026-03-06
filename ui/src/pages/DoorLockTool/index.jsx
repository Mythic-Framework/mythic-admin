import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    TextField, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Switch, FormControlLabel, MenuItem, Select, FormControl, InputLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import Nui from '../../util/Nui';
import { Loader } from '../../components';

const PAGE_SIZE = 50;

const useStyles = makeStyles((theme) => ({
    wrapper: {
        padding: '20px 10px 20px 20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Rajdhani', sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        flexShrink: 0,
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
    title: { fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: "'Orbitron', sans-serif" },
    subtitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.35)', fontFamily: "'Rajdhani', sans-serif" },
    headerActions: { display: 'flex', gap: 8, alignItems: 'center' },
    statsRow: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', flexShrink: 0 },
    filterRow: { display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexShrink: 0 },
    searchField: {
        flex: 1, maxWidth: 300,
        '& .MuiOutlinedInput-root': {
            fontFamily: "'Rajdhani', sans-serif", background: 'rgba(255, 255, 255, 0.04)', borderRadius: 6, fontSize: 13, color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(32, 134, 146, 0.3)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(32, 134, 146, 0.6)' },
        },
        '& .MuiInputAdornment-root': { color: 'rgba(255, 255, 255, 0.3)' },
    },
    tableContainer: {
        flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0,
        background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8,
        border: '1px solid rgba(255, 255, 255, 0.06)',
    },
    // Dialog styles (kept MUI for dialog only)
    dialog: {
        '& .MuiDialog-paper': {
            background: '#121025', border: '1px solid rgba(32, 134, 146, 0.2)',
            borderRadius: 12, color: '#fff', minWidth: 500, maxWidth: 600, maxHeight: '80vh',
        },
    },
    dialogTitle: { background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', padding: '12px 20px', fontSize: 15, fontWeight: 600, fontFamily: "'Orbitron', sans-serif" },
    dialogContent: { padding: '16px 20px', overflowY: 'auto' },
    dialogActions: { padding: '12px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', gap: 8 },
    formField: {
        marginBottom: 12,
        '& .MuiOutlinedInput-root': {
            fontFamily: "'Rajdhani', sans-serif", background: 'rgba(255, 255, 255, 0.04)', borderRadius: 6, fontSize: 13, color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(32, 134, 146, 0.3)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(32, 134, 146, 0.6)' },
        },
        '& .MuiInputLabel-root': { fontFamily: "'Rajdhani', sans-serif", color: 'rgba(255, 255, 255, 0.4)', fontSize: 13 },
        '& .MuiInputLabel-root.Mui-focused': { color: '#4db8c4' },
    },
    formRow: { display: 'flex', gap: 10 },
    sectionLabel: { fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(32, 134, 146, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 8, marginBottom: 8 },
    switchLabel: {
        '& .MuiTypography-root': { fontSize: 13, color: 'rgba(255, 255, 255, 0.7)' },
        '& .MuiSwitch-colorSecondary.Mui-checked': { color: '#208692' },
        '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': { backgroundColor: '#208692' },
    },
    restrictionRow: { display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, padding: '8px 10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.05)' },
    restrictionFields: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
    restrictionFieldRow: { display: 'flex', gap: 6 },
    smallField: {
        '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.04)', borderRadius: 4, fontSize: 12, color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.06)' },
            '&:hover fieldset': { borderColor: 'rgba(32, 134, 146, 0.2)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(32, 134, 146, 0.5)' },
        },
        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.3)', fontSize: 12 },
        '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.3)' },
    },
    selectMenu: { '& .MuiPaper-root': { background: '#1c1a30', border: '1px solid rgba(32, 134, 146, 0.2)', color: '#fff' }, '& .MuiMenuItem-root': { fontSize: 12 } },
}));

const EMPTY_DOOR = { id: '', model: '', coords: { x: '', y: '', z: '' }, locked: false, maxDist: 2.0, canLockpick: false, holdOpen: false, autoRate: 0, autoDist: '', autoLock: 0, double: '', special: false, restricted: [] };
const EMPTY_RESTRICTION = { type: 'job', job: '', workplace: '', grade: '', gradeLevel: '', reqDuty: false, SID: '', key: '', value: '' };
const FILTERS = ['All', 'Locked', 'Unlocked'];

// Plain CSS for table (avoids MUI overhead per row)
const tableStyles = {
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: "'Rajdhani', sans-serif" },
    th: { background: '#0a0914', color: 'rgba(32, 134, 146, 0.8)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '8px 12px', textAlign: 'left', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.06)' },
    td: { padding: '6px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'rgba(255, 255, 255, 0.7)', fontFamily: "'Rajdhani', sans-serif" },
    mono: { fontFamily: 'monospace', fontSize: 11 },
    coords: { fontFamily: 'monospace', fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' },
    dot: (locked) => ({ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', background: locked ? '#2ecc71' : '#e74c3c', boxShadow: locked ? '0 0 6px rgba(46, 204, 113, 0.5)' : '0 0 6px rgba(231, 76, 60, 0.5)' }),
    btn: { background: 'none', border: 'none', padding: '4px 6px', cursor: 'pointer', color: 'rgba(32, 134, 146, 0.7)', fontSize: 12 },
    btnDanger: { background: 'none', border: 'none', padding: '4px 6px', cursor: 'pointer', color: 'rgba(231, 76, 60, 0.6)', fontSize: 12 },
    badge: { display: 'inline-block', padding: '1px 8px', borderRadius: 10, fontSize: 10, fontFamily: "'Rajdhani', sans-serif", background: 'rgba(32, 134, 146, 0.15)', color: '#4db8c4' },
    chip: (active) => ({ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 13, fontSize: 11, fontFamily: "'Rajdhani', sans-serif", border: active ? '1px solid rgba(32, 134, 146, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)', background: active ? 'rgba(32, 134, 146, 0.2)' : 'rgba(255, 255, 255, 0.04)', color: active ? '#4db8c4' : 'rgba(255, 255, 255, 0.5)', userSelect: 'none' }),
    stat: (borderColor) => ({ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 13, fontSize: 11, fontFamily: "'Rajdhani', sans-serif", background: 'rgba(255, 255, 255, 0.06)', border: `1px solid ${borderColor || 'rgba(255, 255, 255, 0.08)'}`, color: 'rgba(255, 255, 255, 0.7)' }),
    headerBtn: (bg, border, color) => ({ background: bg, border: `1px solid ${border}`, color, fontSize: 12, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: '0.05em', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }),
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(32, 134, 146, 0.7)', fontSize: 14 },
    pager: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '8px 0', flexShrink: 0, color: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: "'Rajdhani', sans-serif" },
    pageBtn: (disabled) => ({ background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(32, 134, 146, 0.15)', border: '1px solid rgba(32, 134, 146, 0.2)', color: disabled ? 'rgba(255,255,255,0.2)' : '#4db8c4', borderRadius: 6, padding: '4px 10px', cursor: disabled ? 'default' : 'pointer', fontSize: 11, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }),
};

// Lightweight restriction tooltip text
const restrictionText = (r) => {
    if (!r || !r.length) return '';
    return r.map(x => {
        if (x.type === 'job') return `Job: ${x.job || 'any'}${x.reqDuty ? ' (duty)' : ''}`;
        if (x.type === 'character') return `SID: ${x.SID}`;
        if (x.type === 'propertyData') return `Prop: ${x.key}=${x.value}`;
        return x.type;
    }).join(', ');
};

export default () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [doors, setDoors] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingDoor, setEditingDoor] = useState(null);
    const [formData, setFormData] = useState({ ...EMPTY_DOOR });
    const [saving, setSaving] = useState(false);

    const fetchDoors = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Nui.send('GetDoorList');
            if (res) {
                const data = await res.json();
                if (data && Array.isArray(data)) {
                    setDoors(data.filter(d => !d.removed));
                }
            }
        } catch (e) {}
        setLoading(false);
    }, []);

    useEffect(() => { fetchDoors(); }, []);

    useEffect(() => {
        const handler = (event) => {
            if (event.data && event.data.type === 'DOOR_CAPTURED') {
                const d = event.data.data;
                if (d) {
                    setFormData(prev => ({
                        ...prev,
                        model: d.model ? String(d.model) : '',
                        coords: {
                            x: d.coords ? String(Math.round(d.coords.x * 100) / 100) : '',
                            y: d.coords ? String(Math.round(d.coords.y * 100) / 100) : '',
                            z: d.coords ? String(Math.round(d.coords.z * 100) / 100) : '',
                        },
                        id: prev.id || '',
                    }));
                    setDialogOpen(true);
                    toast.success('Door captured - model & coordinates updated');
                }
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    // Memoized filtering + stats
    const filteredDoors = useMemo(() => {
        return doors.filter((d) => {
            if (filter === 'Locked' && !d.locked) return false;
            if (filter === 'Unlocked' && d.locked) return false;
            if (search) {
                const s = search.toLowerCase();
                if (!(d.id && String(d.id).toLowerCase().includes(s)) &&
                    !String(d.model).includes(s) &&
                    !String(d.index).includes(s) &&
                    !`${d.coords.x}, ${d.coords.y}, ${d.coords.z}`.includes(s)) return false;
            }
            return true;
        });
    }, [doors, filter, search]);

    const stats = useMemo(() => ({
        total: doors.length,
        locked: doors.filter(d => d.locked).length,
        unlocked: doors.filter(d => !d.locked).length,
    }), [doors]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredDoors.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages - 1);
    const pagedDoors = useMemo(() => filteredDoors.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE), [filteredDoors, safePage]);

    // Reset page when filter/search changes
    useEffect(() => { setPage(0); }, [filter, search]);

    // Actions
    const handleToggleLock = async (door) => {
        try {
            const res = await Nui.send('ToggleDoorLock', { index: door.index });
            if (res) {
                const data = await res.json();
                if (data && data.success) {
                    toast.success(data.message);
                    setDoors(prev => prev.map(d => d.index === door.index ? { ...d, locked: data.locked } : d));
                } else toast.error(data?.message || 'Failed');
            }
        } catch (e) { toast.error('Failed to toggle lock'); }
    };

    const handleDelete = async (door) => {
        try {
            const res = await Nui.send('DeleteDoor', { index: door.index });
            if (res) {
                const data = await res.json();
                if (data && data.success) {
                    toast.success(data.message);
                    setDoors(prev => prev.filter(d => d.index !== door.index));
                } else toast.error(data?.message || 'Failed');
            }
        } catch (e) { toast.error('Failed to delete door'); }
    };

    const handleTeleport = async (door) => {
        try {
            const res = await Nui.send('TeleportToCoords', { x: door.coords.x, y: door.coords.y, z: door.coords.z });
            if (res) {
                const data = await res.json();
                if (data && data.success) toast.success('Teleported to door');
                else toast.error(data?.message || 'Failed');
            }
        } catch (e) { toast.error('Failed to teleport'); }
    };

    const handleCaptureDoor = async () => {
        setDialogOpen(false);
        try { await Nui.send('StartDoorHelper'); } catch (e) {}
    };

    const openCreateDialog = () => { setEditingDoor(null); setFormData({ ...EMPTY_DOOR, restricted: [] }); setDialogOpen(true); };

    const openEditDialog = (door) => {
        setEditingDoor(door);
        setFormData({
            id: door.id || '', model: String(door.model),
            coords: { x: String(door.coords.x), y: String(door.coords.y), z: String(door.coords.z) },
            locked: door.locked, maxDist: door.maxDist || 2.0, canLockpick: door.canLockpick || false,
            holdOpen: door.holdOpen || false, autoRate: door.autoRate || 0, autoDist: door.autoDist || '',
            autoLock: door.autoLock || 0, double: door.double || '', special: door.special || false,
            restricted: (door.restricted || []).map(r => ({ ...EMPTY_RESTRICTION, ...r, workplace: (r.workplace && r.workplace !== false) ? r.workplace : '', grade: (r.grade && r.grade !== false) ? r.grade : '', gradeLevel: (r.gradeLevel != null && r.gradeLevel !== false) ? String(r.gradeLevel) : '', jobPermission: (r.jobPermission && r.jobPermission !== false) ? r.jobPermission : '', SID: r.SID != null ? String(r.SID) : '' })),
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.model) { toast.error('Model hash is required'); return; }
        if (!formData.coords.x || !formData.coords.y || !formData.coords.z) { toast.error('Coordinates are required'); return; }
        setSaving(true);
        const payload = {
            id: formData.id || false, model: Number(formData.model),
            coords: { x: Number(formData.coords.x), y: Number(formData.coords.y), z: Number(formData.coords.z) },
            locked: formData.locked, maxDist: Number(formData.maxDist) || 2.0, canLockpick: formData.canLockpick,
            holdOpen: formData.holdOpen, autoRate: Number(formData.autoRate) || 0,
            autoDist: formData.autoDist ? Number(formData.autoDist) : false,
            autoLock: Number(formData.autoLock) || 0,
            double: formData.double || false, special: formData.special,
            restricted: formData.restricted.filter(r => r.type).map(r => {
                const c = { type: r.type };
                if (r.type === 'job') { if (r.job) c.job = r.job; if (r.workplace && r.workplace !== false && r.workplace !== 'false') c.workplace = r.workplace; if (r.grade && r.grade !== false && r.grade !== 'false') c.grade = r.grade; if (r.gradeLevel && Number(r.gradeLevel) > 0) c.gradeLevel = Number(r.gradeLevel); if (r.jobPermission && r.jobPermission !== false && r.jobPermission !== 'false') c.jobPermission = r.jobPermission; c.reqDuty = r.reqDuty === true; }
                else if (r.type === 'character') c.SID = Number(r.SID);
                else if (r.type === 'propertyData') { c.key = r.key; c.value = r.value; }
                return c;
            }),
        };
        try {
            if (editingDoor) {
                payload.index = editingDoor.index;
                const res = await Nui.send('UpdateDoor', payload);
                if (res) { const data = await res.json(); if (data && data.success) { toast.success(data.message); setDialogOpen(false); fetchDoors(); } else toast.error(data?.message || 'Failed to update'); }
            } else {
                const res = await Nui.send('CreateDoor', payload);
                if (res) { const data = await res.json(); if (data && data.success) { toast.success(data.message); setDialogOpen(false); fetchDoors(); } else toast.error(data?.message || 'Failed to create'); }
            }
        } catch (e) { toast.error('Operation failed'); }
        setSaving(false);
    };

    const addRestriction = () => setFormData(prev => ({ ...prev, restricted: [...prev.restricted, { ...EMPTY_RESTRICTION }] }));
    const removeRestriction = (idx) => setFormData(prev => ({ ...prev, restricted: prev.restricted.filter((_, i) => i !== idx) }));
    const updateRestriction = (idx, field, value) => setFormData(prev => ({ ...prev, restricted: prev.restricted.map((r, i) => i === idx ? { ...r, [field]: value } : r) }));

    return (
        <div className={classes.wrapper}>
            {/* Header */}
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <div>
                        <div className={classes.title}>
                            <FontAwesomeIcon icon={['fas', 'door-open']} style={{ marginRight: 8, color: '#208692' }} />
                            Door Lock Tool
                        </div>
                        <div className={classes.subtitle}>Manage door locks and create dynamic doors</div>
                    </div>
                </div>
                <div className={classes.headerActions}>
                    <button style={tableStyles.headerBtn('rgba(32, 134, 146, 0.15)', 'rgba(32, 134, 146, 0.3)', '#4db8c4')} onClick={openCreateDialog} disabled={loading}>
                        <FontAwesomeIcon icon={['fas', 'plus']} /> New Door
                    </button>
                    <button style={tableStyles.iconBtn} onClick={fetchDoors} disabled={loading}>
                        <FontAwesomeIcon icon={['fas', 'arrows-rotate']} spin={loading} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className={classes.statsRow}>
                <span style={tableStyles.stat('rgba(255, 255, 255, 0.08)')}>Total: {stats.total}</span>
                <span style={tableStyles.stat('rgba(231, 76, 60, 0.3)')}>Locked: {stats.locked}</span>
                <span style={tableStyles.stat('rgba(46, 204, 113, 0.3)')}>Unlocked: {stats.unlocked}</span>
            </div>

            {/* Filters */}
            <div className={classes.filterRow}>
                <TextField className={classes.searchField} variant="outlined" size="small" placeholder="Search doors..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon={['fas', 'search']} /></InputAdornment> }}
                />
                {FILTERS.map((f) => (
                    <span key={f} style={tableStyles.chip(filter === f)} onClick={() => setFilter(f)}>{f}</span>
                ))}
            </div>

            {/* Table - plain HTML for performance */}
            <div className={classes.tableContainer}>
                <table style={tableStyles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...tableStyles.th, width: 40 }}>Status</th>
                            <th style={{ ...tableStyles.th, width: 50 }}>#</th>
                            <th style={tableStyles.th}>Door ID</th>
                            <th style={tableStyles.th}>Model</th>
                            <th style={tableStyles.th}>Coordinates</th>
                            <th style={{ ...tableStyles.th, width: 80, textAlign: 'center' }}>Restrictions</th>
                            <th style={{ ...tableStyles.th, width: 140, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center' }}><Loader text="Loading Door Data" /></td></tr>
                        ) : pagedDoors.length === 0 ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No doors match your search criteria</td></tr>
                        ) : pagedDoors.map((door) => (
                            <tr key={door.index} style={{ transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(32,134,146,0.05)'} onMouseLeave={e => e.currentTarget.style.background=''}>
                                <td style={tableStyles.td}><span style={tableStyles.dot(door.locked)} /></td>
                                <td style={{ ...tableStyles.td, ...tableStyles.mono }}>{door.index}</td>
                                <td style={{ ...tableStyles.td, fontWeight: door.id ? 500 : 400, color: door.id ? '#fff' : 'rgba(255,255,255,0.3)' }}>{door.id || '(none)'}</td>
                                <td style={{ ...tableStyles.td, ...tableStyles.mono }}>{door.model}</td>
                                <td style={{ ...tableStyles.td, ...tableStyles.coords }}>{Number(door.coords.x).toFixed(2)}, {Number(door.coords.y).toFixed(2)}, {Number(door.coords.z).toFixed(2)}</td>
                                <td style={{ ...tableStyles.td, textAlign: 'center' }} title={restrictionText(door.restricted)}>
                                    {door.restricted && door.restricted.length > 0
                                        ? <span style={tableStyles.badge}>{door.restricted.length}</span>
                                        : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>None</span>}
                                </td>
                                <td style={{ ...tableStyles.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    <button style={tableStyles.btn} title={door.locked ? 'Unlock' : 'Lock'} onClick={() => handleToggleLock(door)}><FontAwesomeIcon icon={['fas', door.locked ? 'lock-open' : 'lock']} /></button>
                                    <button style={tableStyles.btn} title="Edit" onClick={() => openEditDialog(door)}><FontAwesomeIcon icon={['fas', 'pen-to-square']} /></button>
                                    <button style={tableStyles.btn} title="Teleport To" onClick={() => handleTeleport(door)}><FontAwesomeIcon icon={['fas', 'location-arrow']} /></button>
                                    <button style={tableStyles.btnDanger} title="Delete" onClick={() => handleDelete(door)}><FontAwesomeIcon icon={['fas', 'trash']} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div style={tableStyles.pager}>
                    <button style={tableStyles.pageBtn(safePage === 0)} onClick={() => safePage > 0 && setPage(safePage - 1)} disabled={safePage === 0}>
                        <FontAwesomeIcon icon={['fas', 'chevron-left']} /> Prev
                    </button>
                    <span>Page {safePage + 1} of {totalPages} ({filteredDoors.length} doors)</span>
                    <button style={tableStyles.pageBtn(safePage >= totalPages - 1)} onClick={() => safePage < totalPages - 1 && setPage(safePage + 1)} disabled={safePage >= totalPages - 1}>
                        Next <FontAwesomeIcon icon={['fas', 'chevron-right']} />
                    </button>
                </div>
            )}

            {/* Create/Edit Dialog - MUI is fine here since it renders once */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} className={classes.dialog} hideBackdrop>
                <DialogTitle className={classes.dialogTitle}>
                    <FontAwesomeIcon icon={['fas', editingDoor ? 'pen-to-square' : 'plus']} style={{ marginRight: 8, color: '#208692' }} />
                    {editingDoor ? `Edit Door: ${editingDoor.id || `#${editingDoor.index}`}` : 'Create New Door'}
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <div className={classes.sectionLabel}>Door ID</div>
                    <TextField className={classes.formField} label="Door ID" variant="outlined" size="small" fullWidth
                        value={formData.id} onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))} placeholder="e.g. mrpd_front" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={classes.sectionLabel}>Model & Coordinates</div>
                        <button style={{ ...tableStyles.headerBtn('rgba(46, 204, 113, 0.15)', 'rgba(46, 204, 113, 0.3)', '#2ecc71'), height: 24, fontSize: 11 }} onClick={handleCaptureDoor}>
                            <FontAwesomeIcon icon={['fas', 'crosshairs']} /> Capture Door
                        </button>
                    </div>
                    <TextField className={classes.formField} label="Model Hash" variant="outlined" size="small" fullWidth
                        value={formData.model} onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))} placeholder="e.g. -1215222675 (auto-filled by capture)" />
                    <div className={classes.formRow}>
                        <TextField className={classes.formField} label="X" variant="outlined" size="small" fullWidth
                            value={formData.coords.x} onChange={(e) => setFormData(prev => ({ ...prev, coords: { ...prev.coords, x: e.target.value } }))} />
                        <TextField className={classes.formField} label="Y" variant="outlined" size="small" fullWidth
                            value={formData.coords.y} onChange={(e) => setFormData(prev => ({ ...prev, coords: { ...prev.coords, y: e.target.value } }))} />
                        <TextField className={classes.formField} label="Z" variant="outlined" size="small" fullWidth
                            value={formData.coords.z} onChange={(e) => setFormData(prev => ({ ...prev, coords: { ...prev.coords, z: e.target.value } }))} />
                    </div>
                    <div className={classes.sectionLabel}>Settings</div>
                    <div className={classes.formRow}>
                        <TextField className={classes.formField} label="Max Distance" variant="outlined" size="small" fullWidth type="number"
                            value={formData.maxDist} onChange={(e) => setFormData(prev => ({ ...prev, maxDist: e.target.value }))} />
                        <TextField className={classes.formField} label="Swing Speed (0 = default)" variant="outlined" size="small" fullWidth type="number"
                            value={formData.autoRate} onChange={(e) => setFormData(prev => ({ ...prev, autoRate: e.target.value }))} />
                        <TextField className={classes.formField} label="Auto Distance" variant="outlined" size="small" fullWidth type="number"
                            value={formData.autoDist} onChange={(e) => setFormData(prev => ({ ...prev, autoDist: e.target.value }))} placeholder="(optional)" />
                    </div>
                    <TextField className={classes.formField} label="Auto Lock (seconds, 0 = off)" variant="outlined" size="small" fullWidth type="number"
                        value={formData.autoLock} onChange={(e) => setFormData(prev => ({ ...prev, autoLock: e.target.value }))} placeholder="e.g. 10 = re-locks after 10 seconds" />
                    <TextField className={classes.formField} label="Double Door ID" variant="outlined" size="small" fullWidth
                        value={formData.double} onChange={(e) => setFormData(prev => ({ ...prev, double: e.target.value }))} placeholder="e.g. mrpd_front_2" />
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <FormControlLabel className={classes.switchLabel} control={<Switch checked={formData.locked} onChange={(e) => setFormData(prev => ({ ...prev, locked: e.target.checked }))} color="secondary" size="small" />} label="Default Locked" />
                        <FormControlLabel className={classes.switchLabel} control={<Switch checked={formData.canLockpick} onChange={(e) => setFormData(prev => ({ ...prev, canLockpick: e.target.checked }))} color="secondary" size="small" />} label="Can Lockpick" />
                        <FormControlLabel className={classes.switchLabel} control={<Switch checked={formData.holdOpen} onChange={(e) => setFormData(prev => ({ ...prev, holdOpen: e.target.checked }))} color="secondary" size="small" />} label="Hold Open" />
                        <FormControlLabel className={classes.switchLabel} control={<Switch checked={formData.special} onChange={(e) => setFormData(prev => ({ ...prev, special: e.target.checked }))} color="secondary" size="small" />} label="Special" />
                    </div>
                    <div className={classes.sectionLabel} style={{ marginTop: 12 }}>
                        Restrictions <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>(Who can use this door)</span>
                    </div>
                    {formData.restricted.map((restriction, idx) => (
                        <div key={idx} className={classes.restrictionRow}>
                            <div className={classes.restrictionFields}>
                                <FormControl variant="outlined" size="small" className={classes.smallField} fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select value={restriction.type} onChange={(e) => updateRestriction(idx, 'type', e.target.value)} label="Type" MenuProps={{ className: classes.selectMenu }}>
                                        <MenuItem value="job">Job</MenuItem>
                                        <MenuItem value="character">Character (SID)</MenuItem>
                                        <MenuItem value="propertyData">Property Data</MenuItem>
                                    </Select>
                                </FormControl>
                                {restriction.type === 'job' && (<>
                                    <div className={classes.restrictionFieldRow}>
                                        <TextField className={classes.smallField} label="Job ID" variant="outlined" size="small" fullWidth value={restriction.job} onChange={(e) => updateRestriction(idx, 'job', e.target.value)} placeholder="e.g. police" />
                                        <TextField className={classes.smallField} label="Workplace" variant="outlined" size="small" fullWidth value={restriction.workplace} onChange={(e) => updateRestriction(idx, 'workplace', e.target.value)} placeholder="(optional)" />
                                    </div>
                                    <div className={classes.restrictionFieldRow}>
                                        <TextField className={classes.smallField} label="Grade" variant="outlined" size="small" fullWidth value={restriction.grade} onChange={(e) => updateRestriction(idx, 'grade', e.target.value)} placeholder="(optional)" />
                                        <TextField className={classes.smallField} label="Grade Level" variant="outlined" size="small" fullWidth type="number" value={restriction.gradeLevel} onChange={(e) => updateRestriction(idx, 'gradeLevel', e.target.value)} />
                                        <FormControlLabel className={classes.switchLabel} style={{ marginLeft: 0 }} control={<Switch checked={restriction.reqDuty} onChange={(e) => updateRestriction(idx, 'reqDuty', e.target.checked)} color="secondary" size="small" />} label="Req. Duty" />
                                    </div>
                                </>)}
                                {restriction.type === 'character' && (
                                    <TextField className={classes.smallField} label="State ID (SID)" variant="outlined" size="small" fullWidth type="number" value={restriction.SID} onChange={(e) => updateRestriction(idx, 'SID', e.target.value)} />
                                )}
                                {restriction.type === 'propertyData' && (
                                    <div className={classes.restrictionFieldRow}>
                                        <TextField className={classes.smallField} label="Key" variant="outlined" size="small" fullWidth value={restriction.key} onChange={(e) => updateRestriction(idx, 'key', e.target.value)} />
                                        <TextField className={classes.smallField} label="Value" variant="outlined" size="small" fullWidth value={restriction.value} onChange={(e) => updateRestriction(idx, 'value', e.target.value)} />
                                    </div>
                                )}
                            </div>
                            <button style={{ ...tableStyles.btnDanger, marginTop: 2 }} onClick={() => removeRestriction(idx)}><FontAwesomeIcon icon={['fas', 'xmark']} /></button>
                        </div>
                    ))}
                    <Button variant="outlined" size="small" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'none', color: '#4db8c4', borderColor: 'rgba(32, 134, 146, 0.3)' }} onClick={addRestriction}>
                        <FontAwesomeIcon icon={['fas', 'plus']} style={{ marginRight: 6 }} /> Add Restriction
                    </Button>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'none', fontSize: 12 }} onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, background: 'rgba(32,134,146,0.2)', color: '#4db8c4', border: '1px solid rgba(32,134,146,0.3)', textTransform: 'none', fontSize: 12 }} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : (editingDoor ? 'Update Door' : 'Create Door')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
