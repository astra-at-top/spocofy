import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

export interface DeleteModalHandle {
  open: () => void;
  close: () => void;
}

interface DeleteModalProps {
  onConfirm: () => void;
  itemName: string;
}

const DeleteModal = forwardRef<DeleteModalHandle, DeleteModalProps>(({ onConfirm, itemName }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-900 text-purple-500 font-firacode">
        <DialogHeader>
          <DialogTitle className="text-purple-500">Confirm Deletion</DialogTitle>
          <DialogDescription className="text-purple-500">
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            className="bg-gray-700 text-purple-500 hover:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default DeleteModal;
