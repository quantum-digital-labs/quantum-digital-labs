import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import {
  JOB_APPLICATION_TERMS,
  JOB_APPLICATION_TERMS_CHECKBOX,
  JOB_APPLICATION_TERMS_INTRO,
  JOB_APPLICATION_TERMS_TITLE,
} from '../../constants/jobApplicationTerms';
import {
  INTERNSHIP_APPLICATION_TERMS,
  INTERNSHIP_APPLICATION_TERMS_CHECKBOX,
  INTERNSHIP_APPLICATION_TERMS_INTRO,
  INTERNSHIP_APPLICATION_TERMS_LINK_LABEL,
  INTERNSHIP_APPLICATION_TERMS_TITLE,
} from '../../constants/internshipApplicationTerms';

interface TermsAcceptProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  variant?: 'job' | 'internship';
}

type TermsConfig = {
  title: string;
  intro: string;
  linkLabel: string;
  checkboxLabel: string;
  terms: readonly { title: string; body: string }[];
  dialogId: string;
};

const TERMS_BY_VARIANT: Record<'job' | 'internship', TermsConfig> = {
  job: {
    title: JOB_APPLICATION_TERMS_TITLE,
    intro: JOB_APPLICATION_TERMS_INTRO,
    linkLabel: 'Job Application Terms & Conditions',
    checkboxLabel: JOB_APPLICATION_TERMS_CHECKBOX,
    terms: JOB_APPLICATION_TERMS,
    dialogId: 'job-application-terms-title',
  },
  internship: {
    title: INTERNSHIP_APPLICATION_TERMS_TITLE,
    intro: INTERNSHIP_APPLICATION_TERMS_INTRO,
    linkLabel: INTERNSHIP_APPLICATION_TERMS_LINK_LABEL,
    checkboxLabel: INTERNSHIP_APPLICATION_TERMS_CHECKBOX,
    terms: INTERNSHIP_APPLICATION_TERMS,
    dialogId: 'internship-application-terms-title',
  },
};

const squareDialogPaperSx = {
  width: { xs: '92vw', sm: 520 },
  height: { xs: '92vw', sm: 520 },
  maxWidth: { xs: '92vw', sm: 520 },
  maxHeight: { xs: '92vw', sm: 520 },
  m: 2,
  display: 'flex',
  flexDirection: 'column',
} as const;

export function TermsAccept<T extends FieldValues>({
  control,
  name,
  variant = 'internship',
}: TermsAcceptProps<T>) {
  const [open, setOpen] = useState(false);
  const config = TERMS_BY_VARIANT[variant];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <FormControl error={Boolean(fieldState.error)} sx={{ alignItems: 'flex-start' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Please review and accept the{' '}
              <Link
                component="button"
                type="button"
                underline="hover"
                onClick={() => setOpen(true)}
                sx={{
                  verticalAlign: 'baseline',
                  font: 'inherit',
                  cursor: 'pointer',
                  p: 0,
                  border: 0,
                  background: 'none',
                }}
              >
                {config.linkLabel}
              </Link>
              .
            </Typography>
            {fieldState.error?.message ? (
              <FormHelperText sx={{ ml: 0 }}>{fieldState.error.message}</FormHelperText>
            ) : null}
          </FormControl>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth={false}
            scroll="paper"
            aria-labelledby={config.dialogId}
            slotProps={{ paper: { sx: squareDialogPaperSx } }}
          >
            <DialogTitle id={config.dialogId} sx={{ fontWeight: 800, flexShrink: 0 }}>
              {config.title}
            </DialogTitle>
            <DialogContent dividers sx={{ flex: 1, overflow: 'auto' }}>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  {config.intro}
                </Typography>
                <List dense disablePadding>
                  {config.terms.map((term, index) => (
                    <ListItem key={term.title} alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary={`${index + 1}. ${term.title}`}
                        secondary={term.body}
                        slotProps={{
                          primary: { variant: 'body2', sx: { fontWeight: 700 } },
                          secondary: { variant: 'body2' },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                <FormControlLabel
                  sx={{ alignItems: 'flex-start', mr: 0, mt: 1 }}
                  control={
                    <Checkbox
                      checked={Boolean(field.value)}
                      onChange={(event) => field.onChange(event.target.checked)}
                      onBlur={field.onBlur}
                      slotProps={{ input: { ref: field.ref } }}
                      sx={{ mt: -0.5 }}
                    />
                  }
                  label={config.checkboxLabel}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, flexShrink: 0 }}>
              <Button onClick={() => setOpen(false)} variant="contained" sx={{ fontWeight: 700 }}>
                {field.value ? 'Continue' : 'Close'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    />
  );
}
