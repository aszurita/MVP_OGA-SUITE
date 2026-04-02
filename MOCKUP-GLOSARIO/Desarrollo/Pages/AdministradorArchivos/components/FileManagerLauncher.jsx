import { useState } from 'react';
import FileManagerButton from './FileManagerButton';
import FileManagerModal from './FileManagerModal';
import '../styles/AdministradorArchivos.css';

export default function FileManagerLauncher({ variant }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FileManagerButton onClick={() => setIsOpen(true)} variant={variant} />
      <FileManagerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
