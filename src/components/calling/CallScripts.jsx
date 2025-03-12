import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Button, 
    TextField, 
    CircularProgress, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions 
} from '@mui/material';
import AICallingService from '../../services/aiCallingService';
import { AntDesignWrapper } from '../calling';

const CallScripts = () => {
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openScriptDialog, setOpenScriptDialog] = useState(false);
    const [newScript, setNewScript] = useState({ name: '', description: '', content: '' });

    useEffect(() => {
        fetchScripts();
    }, []);

    const fetchScripts = async () => {
        try {
            setLoading(true);
            const scriptsData = await AICallingService.getCallScripts();
            setScripts(scriptsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleScriptSave = async (scriptData) => {
        try {
            await AICallingService.saveCallScript(scriptData);
            fetchScripts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenScriptDialog = () => {
        setNewScript({ name: '', description: '', content: '' });
        setOpenScriptDialog(true);
    };
    
    const handleCloseScriptDialog = () => {
        setOpenScriptDialog(false);
    };
    
    const handleScriptInputChange = (e) => {
        const { name, value } = e.target;
        setNewScript(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCreateScript = async () => {
        try {
            await handleScriptSave(newScript);
            handleCloseScriptDialog();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteScript = async (scriptId) => {
        try {
            // Implement script deletion logic
            await AICallingService.deleteCallScript(scriptId);
            fetchScripts();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
                <Button variant="contained" onClick={fetchScripts}>Retry</Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Call Scripts</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenScriptDialog}
                >
                    Create New Script
                </Button>
            </Box>
            
            <Grid container spacing={3}>
                {scripts.length === 0 ? (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 5 }}>
                                <Typography variant="h6">No Scripts Available</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Create your first AI call script to get started
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    sx={{ mt: 3 }}
                                    onClick={handleOpenScriptDialog}
                                >
                                    Create Script
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (
                    scripts.map(script => (
                        <Grid item xs={12} md={6} lg={4} key={script.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{script.name}</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {script.description}
                                    </Typography>
                                    <Box sx={{ 
                                        mt: 2, 
                                        p: 2, 
                                        bgcolor: 'background.default', 
                                        borderRadius: 1,
                                        maxHeight: 100,
                                        overflow: 'auto',
                                        fontSize: '0.8rem'
                                    }}>
                                        <pre style={{ margin: 0, fontFamily: 'monospace' }}>
                                            {script.content?.substring(0, 150)}...
                                        </pre>
                                    </Box>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                    <Button 
                                        size="small" 
                                        onClick={() => {
                                            setNewScript(script);
                                            setOpenScriptDialog(true);
                                        }}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        size="small" 
                                        color="error"
                                        onClick={() => handleDeleteScript(script.id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
            
            {/* Script Dialog */}
            <Dialog open={openScriptDialog} onClose={handleCloseScriptDialog} maxWidth="md" fullWidth>
                <DialogTitle>{newScript.id ? 'Edit Script' : 'Create New Script'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Script Name"
                            name="name"
                            value={newScript.name}
                            onChange={handleScriptInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Description"
                            name="description"
                            value={newScript.description}
                            onChange={handleScriptInputChange}
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Script Content"
                            name="content"
                            value={newScript.content}
                            onChange={handleScriptInputChange}
                            multiline
                            rows={10}
                            helperText="Write your AI script using natural language. The AI will follow this script during the call."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseScriptDialog}>Cancel</Button>
                    <Button onClick={handleCreateScript} variant="contained" color="primary">
                        {newScript.id ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CallScripts;
