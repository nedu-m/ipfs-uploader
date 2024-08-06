// __tests__/IPFS_UPLOADER.test.js
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import IPFS_UPLOADER from '../components/ipfs_uploader'; // Update the path to match your project structure

describe('IPFS_UPLOADER', () => {
  it('renders the file upload component', () => {
    render(<IPFS_UPLOADER />);
    expect(screen.getByText(/IPFS File Upload/i)).toBeInTheDocument();
  });

  it('disables the Add to IPFS button when no file is selected', () => {
    render(<IPFS_UPLOADER />);
    expect(screen.getByText(/Add to IPFS/i)).toBeDisabled();
  });

  it('enables the Add to IPFS button when a file is selected', async () => {
    render(<IPFS_UPLOADER />);
    const fileInput = screen.getByLabelText(/Choose file/i);
    const file = new File(['file content'], 'example.txt', { type: 'text/plain' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByText(/Add to IPFS/i)).toBeEnabled();
  });

});
