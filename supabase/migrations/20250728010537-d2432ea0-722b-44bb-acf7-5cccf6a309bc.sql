-- Add Hawaii, Tennessee, and Nevada to restricted states
INSERT INTO public.restricted_states (state_code, state_name, reason) VALUES 
('HI', 'Hawaii', 'Legal compliance - sweepstakes restrictions'),
('TN', 'Tennessee', 'Legal compliance - sweepstakes restrictions'),
('NV', 'Nevada', 'Legal compliance - sweepstakes restrictions');