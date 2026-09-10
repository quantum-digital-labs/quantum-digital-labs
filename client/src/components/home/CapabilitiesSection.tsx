import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import { HOME_CAPABILITY_CARDS } from '../../data/homeCapabilities';
import { ROUTES } from '../../constants';
import { sectionPanel } from '../../theme/surfaces';
import { RouterButton } from '../common/RouterButton';
import { SectionHeader } from '../common/SectionHeader';
import { HomeCapabilityCard } from './HomeCapabilityCard';

/**
 * Capabilities grid — 3 columns × equal rows (desktop), 2 cols on tablet, 1 on mobile.
 */
export function CapabilitiesSection() {
  return (
    <Box component="section" sx={{ ...sectionPanel, overflow: 'hidden' }}>
      <SectionHeader
        eyebrow="Capabilities"
        title="Services built for scale and clarity"
        subtitle="Each capability has a focused scope — read the highlights, then explore the full service."
        action={
          <RouterButton to={ROUTES.services} variant="text" endIcon={<ArrowForwardRoundedIcon />}>
            All services
          </RouterButton>
        }
      />

      <Box
        sx={{
          mt: 0.5,
          display: 'grid',
          gap: { xs: 1.5, md: 2 },
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gridAutoRows: '1fr',
          alignItems: 'stretch',
        }}
      >
        {HOME_CAPABILITY_CARDS.map((item) => (
          <Box
            key={item.id}
            sx={{
              minWidth: 0,
              display: 'flex',
              height: '100%',
              '& > *': { flex: 1, width: '100%', height: '100%' },
            }}
          >
            <HomeCapabilityCard item={item} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
