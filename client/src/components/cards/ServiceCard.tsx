import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { cardSurface } from '../../theme/surfaces';

interface ServiceCardProps {
  title: string;
  description: string;
  to: string;
  image?: string;
  imageAlt?: string;
  techs?: string[];
  meta?: string;
}

export function ServiceCard({
  title,
  description,
  to,
  image,
  imageAlt = '',
  techs,
  meta,
}: ServiceCardProps) {
  return (
    <Card elevation={0} sx={{ ...cardSurface, height: '100%', overflow: 'hidden' }}>
      <CardActionArea
        component={RouterLink}
        to={to}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {image ? (
          <CardMedia
            component="img"
            height="168"
            image={image}
            alt={imageAlt || title}
            sx={{ objectFit: 'cover' }}
          />
        ) : null}
        <CardContent
          sx={{
            p: 2.75,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
          }}
        >
          {meta ? (
            <Typography variant="overline" color="accent.dark">
              {meta}
            </Typography>
          ) : null}
          <Typography variant="h6" sx={{ color: 'primary.main', lineHeight: 1.35, pr: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.65 }}>
            {description}
          </Typography>
          {techs && techs.length > 0 ? (
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', pt: 0.5 }}>
              {techs.slice(0, 4).map((tech) => (
                <Chip
                  key={tech}
                  size="small"
                  label={tech}
                  variant="outlined"
                  sx={{ borderColor: 'divider', fontWeight: 600 }}
                />
              ))}
              {techs.length > 4 ? (
                <Chip size="small" label={`+${techs.length - 4}`} variant="outlined" />
              ) : null}
            </Stack>
          ) : null}
          <Stack direction="row" spacing={0.5} sx={{ pt: 0.75, alignItems: 'center', color: 'accent.dark' }}>
            <Typography variant="subtitle2">Learn more</Typography>
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
