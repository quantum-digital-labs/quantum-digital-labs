import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AlertDialog,
  AppBreadcrumbs,
  FormErrorAlert,
  PageContainer,
  RouterButton,
  SuccessPanel,
  ValidationDialog,
  CompanyContactDetails,
} from '../components';
import { ROUTES } from '../constants';
import { SERVICE_CATEGORIES } from '../data';
import { useAlertPopup, useValidationPopup } from '../hooks/useValidationPopup';
import { submitContact } from '../services';
import type { FormStatus } from '../utils';
import { contactFormSchema, type ContactFormValues } from '../validations';

const serviceOptions = SERVICE_CATEGORIES.flatMap((category) =>
  category.services.map((service) => ({
    value: `${category.id}:${service.slug}`,
    label: `${category.title} — ${service.title}`,
  })),
);

export function ContactPage() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | undefined>();
  const popup = useValidationPopup();
  const alert = useAlertPopup();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: serviceOptions[0]?.value ?? '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('loading');
    setError(null);
    try {
      const result = await submitContact(values);
      setReference(result.referenceNumber);
      setStatus('success');
      reset();
      alert.show({
        title: 'Message sent',
        message: result.referenceNumber
          ? `Thank you. Your reference number is ${result.referenceNumber}. We will respond shortly.`
          : 'Thank you for contacting Quantum Digital Labs. We will respond shortly.',
        severity: 'success',
      });
    } catch (err) {
      setStatus('error');
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      alert.show({
        title: 'Message not sent',
        message,
        severity: 'error',
      });
    }
  };

  return (
    <PageContainer>
      {status === 'success' ? (
        <>
          <AppBreadcrumbs
            items={[
              { label: 'Home', to: ROUTES.home },
              { label: 'Contact' },
            ]}
          />
          <SuccessPanel
            title="Message Sent Successfully"
            message="Thank you for contacting Quantum Digital Labs. We will respond shortly."
            referenceNumber={reference}
            primaryLabel="Back to Home"
            primaryTo={ROUTES.home}
            secondaryLabel="Explore Services"
            secondaryTo={ROUTES.services}
          />
          <Button variant="text" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </>
      ) : (
        <>
          <AppBreadcrumbs
            items={[
              { label: 'Home', to: ROUTES.home },
              { label: 'Contact' },
            ]}
          />
          <Typography component="h1" variant="h2">
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Send a message to Quantum Digital Labs Pvt. Ltd. Official contact details will
            replace placeholders when provided.
          </Typography>
          <CompanyContactDetails tone="light" />

          <FormErrorAlert error={error} />

          <Stack
            component="form"
            spacing={2}
            noValidate
            onSubmit={handleSubmit(onSubmit, popup.showErrors)}
            sx={formSx}
          >
            <TextField
              label="Name"
              required
              {...register('name')}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email"
              type="email"
              required
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label="Phone"
              required
              {...register('phone')}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />
            <TextField label="Company" {...register('company')} />
            <Controller
              name="service"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Service"
                  required
                  error={Boolean(errors.service)}
                  helperText={errors.service?.message}
                >
                  {serviceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              label="Message"
              required
              multiline
              minRows={4}
              {...register('message')}
              error={Boolean(errors.message)}
              helperText={errors.message?.message}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button type="submit" variant="contained" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </Button>
              <RouterButton to={ROUTES.home} variant="outlined">
                Back to Home
              </RouterButton>
            </Stack>
          </Stack>
        </>
      )}

      <ValidationDialog
        open={popup.open}
        fields={popup.fields}
        onClose={popup.close}
        title="Contact form incomplete"
        message="Please complete these required fields:"
      />
      <AlertDialog
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={alert.close}
      />
    </PageContainer>
  );
}

const formSx = {
  p: 3,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;
