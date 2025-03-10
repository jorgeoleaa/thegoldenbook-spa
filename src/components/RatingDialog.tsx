import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Typography,
} from '@mui/material';

interface RatingData {
  rating: number;
  subject: string;
  body: string;
}

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (ratingData: RatingData) => void;
}

const RatingDialog: React.FC<RatingDialogProps> = ({ open, onClose, onSave }) => {
  const [rating, setRating] = useState<number>(0);
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const handleSave = () => {
    onSave({ rating, subject, body });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Deja tu valoración</DialogTitle>
      <DialogContent>
        <Typography component="legend">Calificación</Typography>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue || 0); // Asegúrate de manejar el caso en que newValue sea null
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Asunto"
          type="text"
          fullWidth
          variant="standard"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Cuerpo"
          type="text"
          fullWidth
          variant="standard"
          multiline
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;