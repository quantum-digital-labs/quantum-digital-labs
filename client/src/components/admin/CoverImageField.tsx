import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRef, useState, type ChangeEvent } from 'react';
import {
  isUploadedImageUrl,
  resolveMediaUrl,
  uploadCoverImage,
} from '../../services';

type CoverImageFieldProps = {
  value: string;
  onChange: (url: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
  helperText?: string;
};

export function CoverImageField({
  value,
  onChange,
  onError,
  disabled = false,
  helperText = 'Optional. If none is uploaded, a default image is used automatically.',
}: CoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const hasCustom =
    Boolean(value) &&
    isUploadedImageUrl(value) &&
    !value.includes('/uploads/defaults/');

  const onPick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadCoverImage(file);
      onChange(url);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        Cover image
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {helperText}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(event) => void onPick(event)}
      />
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          sx={{ fontWeight: 700 }}
        >
          {uploading ? 'Uploading…' : hasCustom ? 'Replace image' : 'Upload image'}
        </Button>
        {hasCustom ? (
          <Button
            variant="text"
            color="inherit"
            onClick={() => onChange('')}
            disabled={disabled || uploading}
          >
            Remove
          </Button>
        ) : null}
      </Stack>
      {hasCustom ? (
        <Box
          component="img"
          src={resolveMediaUrl(value)}
          alt="Cover preview"
          sx={{
            width: '100%',
            maxWidth: 360,
            height: 180,
            objectFit: 'cover',
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            display: 'block',
          }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          No image yet — default will be used on save.
        </Typography>
      )}
    </Stack>
  );
}
