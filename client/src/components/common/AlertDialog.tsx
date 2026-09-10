import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface AlertDialogProps {
  open: boolean;
  title: string;
  message: string;
  severity?: AlertSeverity;
  confirmLabel?: string;
  secondaryLabel?: string;
  secondaryDisabled?: boolean;
  onSecondary?: () => void;
  onClose: () => void;
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  const sx = { fontSize: 20 } as const;
  if (severity === 'success') {
    return <CheckCircleOutlinedIcon color="success" sx={sx} />;
  }
  if (severity === 'warning') {
    return <WarningAmberOutlinedIcon color="warning" sx={sx} />;
  }
  if (severity === 'info') {
    return <InfoOutlinedIcon color="info" sx={sx} />;
  }
  return <ErrorOutlinedIcon color="error" sx={sx} />;
}

/**
 * General-purpose popup for success, failures, and informational alerts.
 */
export function AlertDialog({
  open,
  title,
  message,
  severity = 'error',
  confirmLabel = 'OK',
  secondaryLabel,
  secondaryDisabled,
  onSecondary,
  onClose,
}: AlertDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableRestoreFocus
      maxWidth="xs"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <SeverityIcon severity={severity} />
          <span>{title}</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {secondaryLabel && onSecondary ? (
          <Button
            onClick={onSecondary}
            disabled={secondaryDisabled}
            color="inherit"
            size="small"
          >
            {secondaryLabel}
          </Button>
        ) : null}
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          color={severity === 'success' ? 'success' : 'primary'}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
