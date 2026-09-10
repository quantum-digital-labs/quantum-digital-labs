import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

interface ValidationDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  fields: string[];
  onClose: () => void;
}

/**
 * Popup listing missing/invalid required fields after a failed submit attempt.
 */
export function ValidationDialog({
  open,
  title = 'Form incomplete',
  message = 'Please complete or correct the following fields before continuing:',
  fields,
  onClose,
}: ValidationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableRestoreFocus
      maxWidth="xs"
      fullWidth
      aria-labelledby="validation-dialog-title"
      aria-describedby="validation-dialog-description"
    >
      <DialogTitle id="validation-dialog-title">
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <ErrorOutlinedIcon color="error" sx={{ fontSize: 20 }} />
          <span>{title}</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="validation-dialog-description" sx={{ mb: 0.5 }}>
          {message}
        </DialogContentText>
        <List dense disablePadding>
          {fields.map((field) => (
            <ListItem key={field} sx={{ py: 0.15, px: 0 }}>
              <ListItemText
                primary={`• ${field}`}
                slotProps={{
                  primary: { sx: { fontSize: '0.8125rem', lineHeight: 1.45 } },
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" size="small" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
