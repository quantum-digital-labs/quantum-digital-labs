import type { ReactNode } from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { HomeCapabilityItem } from '../../data/homeCapabilities';
import { RouterButton } from '../common/RouterButton';

interface HomeCapabilityCardProps {
  item: HomeCapabilityItem;
  /** Stretch to match sibling height (row 1). */
  fillHeight?: boolean;
  /** Narrow column — stack image above content. */
  compact?: boolean;
}

function ReadMoreLink({ to }: { to: string }) {
  return (
    <RouterButton
      to={to}
      variant="text"
      size="small"
      endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '16px !important' }} />}
      sx={{
        alignSelf: 'flex-start',
        px: 0,
        mt: 'auto',
        minHeight: 28,
        fontSize: '0.8125rem',
        fontWeight: 700,
        color: 'primary.main',
        '&:hover': { bgcolor: 'transparent', color: 'accent.dark' },
      }}
    >
      Read more
    </RouterButton>
  );
}

function Highlights({ items }: { items: readonly string[] }) {
  return (
    <Stack component="ul" spacing={0.4} sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {items.map((point) => (
        <Stack
          key={point}
          component="li"
          direction="row"
          spacing={0.75}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box
            aria-hidden
            sx={{
              width: 5,
              height: 5,
              mt: 0.7,
              borderRadius: '50%',
              bgcolor: 'accent.main',
              flexShrink: 0,
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.5, fontSize: '0.75rem' }}
          >
            {point}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function CardShell({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 1px 2px rgba(12, 35, 64, 0.04), 0 6px 18px rgba(12, 35, 64, 0.05)',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 22px rgba(12, 35, 64, 0.09)',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function FeaturedCard({ item }: HomeCapabilityCardProps) {
  return (
    <CardShell>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 100, md: 112 },
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={item.image}
          alt={item.imageAlt}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, transparent 25%, ${item.accent}CC 100%)`,
          }}
        />
        <Typography
          variant="overline"
          sx={{
            position: 'absolute',
            top: 10,
            left: 12,
            color: 'common.white',
            bgcolor: 'rgba(7, 24, 40, 0.55)',
            px: 0.9,
            py: 0.25,
            borderRadius: 1,
            fontSize: '0.625rem',
          }}
        >
          Core capability
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 10,
            color: 'common.white',
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </Typography>
      </Box>
      <Stack spacing={1} sx={{ p: 1.75, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55, fontSize: '0.8125rem' }}>
          {item.summary}
        </Typography>
        <Highlights items={item.highlights} />
        <ReadMoreLink to={item.path} />
      </Stack>
    </CardShell>
  );
}

function PortraitCard({ item }: HomeCapabilityCardProps) {
  return (
    <CardShell>
      <Stack spacing={1.25} sx={{ p: 1.75, height: '100%' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'accent.light',
            boxShadow: '0 4px 12px rgba(12, 35, 64, 0.1)',
            mx: 'auto',
          }}
        >
          <Box
            component="img"
            src={item.image}
            alt={item.imageAlt}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.9375rem' }}
        >
          {item.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" sx={{ lineHeight: 1.55 }}>
          {item.summary}
        </Typography>
        <Highlights items={item.highlights} />
        <ReadMoreLink to={item.path} />
      </Stack>
    </CardShell>
  );
}

function OverlayCard({ item, fillHeight }: HomeCapabilityCardProps) {
  return (
    <CardShell sx={{ minHeight: fillHeight ? { md: '100%' } : { md: 220 } }}>
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: fillHeight ? { xs: 200, md: 260 } : 200,
        }}
      >
        <Box
          component="img"
          src={item.image}
          alt={item.imageAlt}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(200deg, rgba(7,24,40,0.12) 0%, rgba(7,24,40,0.9) 78%)',
          }}
        />
        <Stack
          spacing={0.85}
          sx={{
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: 14,
            color: 'common.white',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            {item.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, lineHeight: 1.55, fontSize: '0.8125rem' }}>
            {item.summary}
          </Typography>
          <Stack spacing={0.25}>
            {item.highlights.map((point) => (
              <Typography key={point} variant="caption" sx={{ opacity: 0.82, fontSize: '0.7rem' }}>
                · {point}
              </Typography>
            ))}
          </Stack>
          <RouterButton
            to={item.path}
            variant="text"
            size="small"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              alignSelf: 'flex-start',
              px: 0,
              minHeight: 28,
              fontSize: '0.8125rem',
              color: 'accent.light',
              fontWeight: 700,
              '&:hover': { bgcolor: 'transparent', color: 'common.white' },
            }}
          >
            Read more
          </RouterButton>
        </Stack>
      </Box>
    </CardShell>
  );
}

function SplitCard({ item, compact }: HomeCapabilityCardProps) {
  const stackVertical = compact !== false;

  return (
    <CardShell>
      <Stack
        direction={stackVertical ? 'column' : { xs: 'column', sm: 'row' }}
        sx={{ height: '100%' }}
      >
        <Box
          sx={{
            width: stackVertical ? '100%' : { xs: '100%', sm: '42%' },
            height: stackVertical ? 96 : { xs: 96, sm: 'auto' },
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={item.image}
            alt={item.imageAlt}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Box>
        <Stack spacing={1} sx={{ p: 1.75, flex: 1 }}>
          <Typography variant="overline" sx={{ color: item.accent, fontSize: '0.625rem', lineHeight: 1.2 }}>
            Talent
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>
            {item.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55 }}>
            {item.summary}
          </Typography>
          <Highlights items={item.highlights} />
          <ReadMoreLink to={item.path} />
        </Stack>
      </Stack>
    </CardShell>
  );
}

function AccentBarCard({ item }: HomeCapabilityCardProps) {
  return (
    <CardShell>
      <Stack direction="row" sx={{ height: '100%' }}>
        <Box sx={{ width: 4, bgcolor: item.accent, flexShrink: 0 }} />
        <Stack spacing={1} sx={{ p: 1.75, flex: 1 }}>
          <Box
            component="img"
            src={item.image}
            alt={item.imageAlt}
            sx={{
              width: '100%',
              height: 88,
              objectFit: 'cover',
              borderRadius: 1.5,
            }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>
            {item.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55 }}>
            {item.summary}
          </Typography>
          <Highlights items={item.highlights} />
          <ReadMoreLink to={item.path} />
        </Stack>
      </Stack>
    </CardShell>
  );
}

function BannerCard({ item }: HomeCapabilityCardProps) {
  return (
    <CardShell>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ alignItems: { md: 'stretch' }, minHeight: { md: 148 } }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '28%' },
            minHeight: { xs: 120, md: 'auto' },
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={item.image}
            alt={item.imageAlt}
            sx={{
              width: '100%',
              height: '100%',
              minHeight: { xs: 120, md: 148 },
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>
        <Stack
          spacing={1}
          sx={{
            p: { xs: 1.75, md: 2.25 },
            flex: 1,
            justifyContent: 'center',
            background:
              'linear-gradient(135deg, rgba(12,35,64,0.03) 0%, rgba(184,149,107,0.08) 100%)',
          }}
        >
          <Typography variant="overline" color="accent.dark" sx={{ fontSize: '0.625rem' }}>
            For students & early careers
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {item.title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ maxWidth: 560, lineHeight: 1.55, fontSize: '0.8125rem' }}
          >
            {item.summary}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
              alignItems: { sm: 'end' },
            }}
          >
            <Highlights items={item.highlights} />
            <ReadMoreLink to={item.path} />
          </Box>
        </Stack>
      </Stack>
    </CardShell>
  );
}

export function HomeCapabilityCard({ item, fillHeight, compact }: HomeCapabilityCardProps) {
  const props = { item, fillHeight, compact };

  switch (item.variant) {
    case 'featured':
      return <FeaturedCard {...props} />;
    case 'portrait':
      return <PortraitCard {...props} />;
    case 'overlay':
      return <OverlayCard {...props} />;
    case 'split':
      return <SplitCard {...props} />;
    case 'accent-bar':
      return <AccentBarCard {...props} />;
    case 'banner':
      return <BannerCard {...props} />;
    default:
      return <FeaturedCard {...props} />;
  }
}
