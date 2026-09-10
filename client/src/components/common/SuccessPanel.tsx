import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { RouterButton } from './RouterButton';

interface SuccessPanelProps {
  title: string;
  message: string;
  referenceNumber?: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export function SuccessPanel({
  title,
  message,
  referenceNumber,
  primaryLabel,
  primaryTo,
  secondaryLabel = 'Back to Home',
  secondaryTo = '/',
}: SuccessPanelProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'success.light',
        bgcolor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 56, mb: 1 }} />
      <Typography component="h2" variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {message}
      </Typography>
      {referenceNumber ? (
        <Typography variant="subtitle2" sx={{ mb: 3 }}>
          Reference: {referenceNumber}
        </Typography>
      ) : null}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'center' }}
      >
        <RouterButton to={primaryTo} variant="contained">
          {primaryLabel}
        </RouterButton>
        <RouterButton to={secondaryTo} variant="outlined">
          {secondaryLabel}
        </RouterButton>
      </Stack>
    </Box>
  );
}

interface FormStatusAlertsProps {
  error?: string | null;
  children?: ReactNode;
}

export function FormErrorAlert({ error }: FormStatusAlertsProps) {
  if (!error) return null;
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  );
}
