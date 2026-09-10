import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import {
  AlertDialog,
  AppBreadcrumbs,
  FormErrorAlert,
  PageContainer,
  RouterButton,
  SuccessPanel,
  ValidationDialog,
} from '../components';
import { ROUTES } from '../constants';
import { SERVICE_CATEGORIES, getCategoryById, getService } from '../data';
import { useAlertPopup, useValidationPopup } from '../hooks/useValidationPopup';
import { submitQuote } from '../services';
import type { FormStatus } from '../utils';
import { quoteFormSchema, type QuoteFormValues } from '../validations';

export function QuotePage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') ?? '';
  const serviceParam = searchParams.get('service') ?? '';
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | undefined>();
  const popup = useValidationPopup();
  const alert = useAlertPopup();

  const serviceOptions = useMemo(
    () =>
      SERVICE_CATEGORIES.flatMap((category) =>
        category.services.map((service) => ({
          value: `${category.id}:${service.slug}`,
          label: `${category.title} — ${service.title}`,
        })),
      ),
    [],
  );

  const defaultServiceValue = useMemo(() => {
    if (serviceParam.includes(':')) {
      const [categoryId, slug] = serviceParam.split(':');
      if (getService(categoryId, slug)) return serviceParam;
    }
    if (categoryParam && serviceParam && getService(categoryParam, serviceParam)) {
      return `${categoryParam}:${serviceParam}`;
    }
    const category = getCategoryById(categoryParam);
    if (category?.services[0]) {
      return `${category.id}:${category.services[0].slug}`;
    }
    return serviceOptions[0]?.value ?? '';
  }, [categoryParam, serviceParam, serviceOptions]);

  const parentCategoryPath =
    getCategoryById(categoryParam)?.path ??
    getCategoryById(defaultServiceValue.split(':')[0] ?? '')?.path ??
    ROUTES.services;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: defaultServiceValue,
      budget: '',
      requirements: '',
      timeline: '',
    },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    setStatus('loading');
    setError(null);
    try {
      const result = await submitQuote(values);
      setReference(result.referenceNumber);
      setStatus('success');
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: defaultServiceValue,
        budget: '',
        requirements: '',
        timeline: '',
      });
      alert.show({
        title: 'Quote request submitted',
        message: result.referenceNumber
          ? `We received your requirements. Reference: ${result.referenceNumber}.`
          : 'We received your requirements and will follow up soon.',
        severity: 'success',
      });
    } catch (err) {
      setStatus('error');
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      alert.show({
        title: 'Quote request not submitted',
        message,
        severity: 'error',
      });
    }
  };

  if (status === 'success') {
    return (
      <PageContainer>
        <AppBreadcrumbs
          items={[
            { label: 'Home', to: ROUTES.home },
            { label: 'Services', to: ROUTES.services },
            { label: 'Get a Quote' },
          ]}
        />
        <SuccessPanel
          title="Quote Request Submitted Successfully"
          message="We received your requirements and will follow up soon."
          referenceNumber={reference}
          primaryLabel="Back to Service"
          primaryTo={parentCategoryPath}
          secondaryLabel="Back to Home"
          secondaryTo={ROUTES.home}
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

  return (
    <PageContainer>
      <AppBreadcrumbs
        items={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Services', to: ROUTES.services },
          { label: 'Get a Quote' },
        ]}
      />
      <Typography component="h1" variant="h2">
        Get a Quote
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
        Share name, email, phone, company, service, budget, requirements, and timeline.
      </Typography>
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
        <TextField
          label="Company"
          required
          {...register('company')}
          error={Boolean(errors.company)}
          helperText={errors.company?.message}
        />
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
        <TextField label="Budget (optional)" {...register('budget')} />
        <TextField
          label="Requirements"
          required
          multiline
          minRows={4}
          {...register('requirements')}
          error={Boolean(errors.requirements)}
          helperText={errors.requirements?.message}
        />
        <TextField label="Timeline (optional)" {...register('timeline')} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button type="submit" variant="contained" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : 'Submit Quote Request'}
          </Button>
          <RouterButton to={parentCategoryPath} variant="outlined">
            Back to Service
          </RouterButton>
          <RouterButton to={ROUTES.home} variant="text">
            Back to Home
          </RouterButton>
        </Stack>
      </Stack>

      <ValidationDialog
        open={popup.open}
        fields={popup.fields}
        onClose={popup.close}
        title="Quote form incomplete"
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
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const;
