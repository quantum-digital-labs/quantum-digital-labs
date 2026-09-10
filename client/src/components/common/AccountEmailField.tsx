import TextField from '@mui/material/TextField';
import type { SxProps, Theme } from '@mui/material/styles';

interface AccountEmailFieldProps {
  email: string;
  error?: string;
  sx?: SxProps<Theme>;
}

export function AccountEmailField({ email, error, sx }: AccountEmailFieldProps) {
  return (
    <TextField
      fullWidth
      label="Email"
      type="email"
      required
      value={email}
      error={Boolean(error)}
      helperText={error}
      slotProps={{
        htmlInput: { readOnly: true, autoComplete: 'email' },
      }}
      sx={[
        {
          '& .MuiInputBase-root': {
            bgcolor: 'action.hover',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
}
