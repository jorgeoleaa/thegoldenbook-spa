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

const ReviewDialog: React.FC<RatingDialogProps> = ({ open, onClose, onSave }) => {
  const [rating, setRating] = useState<number>(0);
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const handleSave = () => {
    onSave({ rating, subject, body });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave your review</DialogTitle>
      <DialogContent>
        <Typography component="legend">Rating</Typography>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue || 0);
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Subject"
          type="text"
          fullWidth
          variant="standard"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Body"
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;