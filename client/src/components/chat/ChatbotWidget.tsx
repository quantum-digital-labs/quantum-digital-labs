import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { COMPANY } from '../../constants';
import {
  CHAT_WELCOME,
  getAssistantReply,
  type ChatReply,
} from '../../utils/chatAssistant';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestions?: string[];
  link?: { label: string; to: string };
}

function createId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function toAssistantMessage(reply: ChatReply): ChatMessage {
  return {
    id: createId(),
    role: 'assistant',
    text: reply.text,
    suggestions: reply.suggestions,
    link: reply.link,
  };
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    toAssistantMessage(CHAT_WELCOME),
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, busy]);

  const sendMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;

    setInput('');
    setMessages((prev) => [...prev, { id: createId(), role: 'user', text }]);
    setBusy(true);
    try {
      const reply = await getAssistantReply(text);
      setMessages((prev) => [...prev, toAssistantMessage(reply)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          text: 'Sorry — I could not answer just now. Please try again or use Contact Us.',
          suggestions: ['Contact us', 'What services do you offer?'],
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 16, sm: 24 },
        bottom: { xs: 16, sm: 24 },
        zIndex: 1400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1.5,
      }}
    >
      {open ? (
        <Paper elevation={8} sx={panelSx} role="dialog" aria-label="AI assistant chat">
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              px: 2,
              py: 1.5,
              alignItems: 'center',
              background: 'linear-gradient(135deg, #0B3A6E 0%, #1565C0 55%, #0A2F5C 100%)',
              color: 'common.white',
            }}
          >
            <SmartToyOutlinedIcon fontSize="small" />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {COMPANY.brandName} AI Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                Ask about services, careers, and more
              </Typography>
            </Box>
            <IconButton
              size="small"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              sx={{ color: 'common.white' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box ref={listRef} sx={messagesSx}>
            <Stack spacing={1.5}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                  }}
                >
                  <Box
                    sx={{
                      px: 1.5,
                      py: 1.15,
                      borderRadius: 2,
                      bgcolor:
                        message.role === 'user' ? 'primary.main' : 'rgba(11, 58, 110, 0.06)',
                      color: message.role === 'user' ? 'common.white' : 'text.primary',
                      border:
                        message.role === 'assistant' ? '1px solid' : '1px solid transparent',
                      borderColor: message.role === 'assistant' ? 'divider' : 'transparent',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>
                    {message.link ? (
                      <Link
                        component={RouterLink}
                        to={message.link.to}
                        underline="hover"
                        variant="body2"
                        sx={{
                          display: 'inline-block',
                          mt: 1,
                          fontWeight: 700,
                          color: message.role === 'user' ? 'accent.light' : 'primary.main',
                        }}
                        onClick={() => setOpen(false)}
                      >
                        {message.link.label} →
                      </Link>
                    ) : null}
                  </Box>
                  {message.role === 'assistant' && message.suggestions?.length ? (
                    <Stack
                      direction="row"
                      spacing={0.75}
                      useFlexGap
                      sx={{ flexWrap: 'wrap', mt: 1 }}
                    >
                      {message.suggestions.map((suggestion) => (
                        <Chip
                          key={suggestion}
                          size="small"
                          label={suggestion}
                          clickable
                          disabled={busy}
                          onClick={() => void sendMessage(suggestion)}
                          sx={{ bgcolor: 'background.paper' }}
                        />
                      ))}
                    </Stack>
                  ) : null}
                </Box>
              ))}
              {busy ? (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', px: 0.5 }}>
                  <CircularProgress size={14} />
                  <Typography variant="caption" color="text.secondary">
                    Assistant is thinking…
                  </Typography>
                </Stack>
              ) : null}
            </Stack>
          </Box>

          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
            sx={{
              p: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask the AI assistant…"
                value={input}
                disabled={busy}
                onChange={(event) => setInput(event.target.value)}
                multiline
                maxRows={3}
              />
              <IconButton
                type="submit"
                color="primary"
                aria-label="Send message"
                disabled={busy || !input.trim()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                }}
              >
                <SendRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      ) : null}

      <Fab
        color="primary"
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
        onClick={() => setOpen((value) => !value)}
        sx={{
          boxShadow: '0 10px 28px rgba(11, 58, 110, 0.35)',
          background: 'linear-gradient(135deg, #1565C0 0%, #0B3A6E 100%)',
        }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </Box>
  );
}

const panelSx = {
  width: { xs: 'min(100vw - 32px, 380px)', sm: 380 },
  height: { xs: 'min(70vh, 520px)', sm: 520 },
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
} as const;

const messagesSx = {
  flexGrow: 1,
  overflowY: 'auto',
  px: 1.75,
  py: 1.75,
  bgcolor: 'rgba(232, 241, 250, 0.55)',
} as const;
