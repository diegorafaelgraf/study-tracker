import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BackButton from './BackButton';

describe('BackButton', () => {
  it('navigates to /closed-years from a closed-year detail page', async () => {
    render(
      <MemoryRouter initialEntries={['/closed-years/1']}>
        <Routes>
          <Route path="/closed-years/:id" element={<BackButton />} />
          <Route path="/closed-years" element={<div>CLOSED YEARS PAGE</div>} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /volver/i }));
    expect(await screen.findByText('CLOSED YEARS PAGE')).toBeInTheDocument();
  });

  it('navigates to /topics from a topic detail page', async () => {
    render(
      <MemoryRouter initialEntries={['/topics/123']}>
        <Routes>
          <Route path="/topics/:id" element={<BackButton />} />
          <Route path="/topics" element={<div>TOPICS PAGE</div>} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /volver/i }));
    expect(await screen.findByText('TOPICS PAGE')).toBeInTheDocument();
  });
});
