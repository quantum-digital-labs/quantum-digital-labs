import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { cardSurface } from '../../theme/surfaces';

interface ContentCardProps {
  title: string;
  meta?: string;
  description: string;
  to: string;
  image?: string;
  imageAlt?: string;
}

export function ContentCard({
  title,
  meta,
  description,
  to,
  image,
  imageAlt = '',
}: ContentCardProps) {
  return (
    <Card elevation={0} sx={{ ...cardSurface, height: '100%', overflow: 'hidden' }}>
      <CardActionArea component={RouterLink} to={to} sx={{ height: '100%' }}>
        {image ? (
          <CardMedia
            component="img"
            height="176"
            image={image}
            alt={imageAlt || title}
            sx={{ objectFit: 'cover' }}
          />
        ) : null}
        <CardContent sx={{ p: 2.75 }}>
          {meta ? (
            <Typography variant="overline" color="accent.dark" sx={{ display: 'block', mb: 0.75 }}>
              {meta}
            </Typography>
          ) : null}
          <Typography variant="h6" gutterBottom sx={{ lineHeight: 1.35 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.65 }}>
            {description}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'primary.main' }}>
            <Typography variant="subtitle2">View details</Typography>
            <ArrowForwardRoundedIcon sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
