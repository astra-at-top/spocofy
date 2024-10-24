import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createPlaylist, updatePlaylist } from '@/Store/Reducer/PlaylistReducer';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AppDispatch } from "@/Store/store"

export interface AddPlaylistHandle {
  open: () => void;
  close: () => void;
}

interface FormData {
  name: string;
  description: string;
  coverImage: string;
}

interface AddPlaylistProps {
  updateData?: {
    id: string;
    name: string;
    description: string;
    coverImage: string;
  };
}

const AddPlaylist = forwardRef<AddPlaylistHandle, AddPlaylistProps>(({ updateData }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();

  useImperativeHandle(ref, () => ({
    open: () => {
      reset();
      if (updateData) {
        setValue('name', updateData.name);
        setValue('description', updateData.description);
        setValue('coverImage', updateData.coverImage);
      }
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  }));

  useEffect(() => {
    if (updateData) {
      setValue('name', updateData.name);
      setValue('description', updateData.description);
      setValue('coverImage', updateData.coverImage);
    }
  }, [updateData, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (updateData) {
      await dispatch(updatePlaylist({
        id: updateData.id,
        playlistData: data,
        showToast: () => {
          toast({
            title: "Playlist is updated",
            description: `${data.name} playlist has been updated`,
          });
          setIsOpen(false);
        }
      }));
    } else {
      await dispatch(createPlaylist({
        ...data,
        showToast: () => {
          toast({
            title: "Playlist is created",
            description: `${data.name} playlist has been created`,
          });
          setIsOpen(false);
        }
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-900 text-purple-500 font-firacode">
        <DialogHeader>
          <DialogTitle className="text-purple-500">{updateData ? 'Update Playlist' : 'Add New Playlist'}</DialogTitle>
          <DialogDescription className="text-purple-500">
            {updateData ? 'Update the details of the playlist.' : 'Enter the details of the new playlist you want to create.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium text-purple-500">Playlist Name</label>
          <input
            {...register("name", { required: "Playlist name is required" })}
            type="text"
            placeholder="Enter playlist name"
            className="w-full px-3 py-2 text-sm bg-gray-900 border border-purple-400  focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          
          <label className="block text-sm font-medium text-purple-500 mt-2">Playlist Description</label>
          <textarea
            {...register("description", { required: "Playlist description is required" })}
            placeholder="Enter playlist description"
            className="w-full px-3 py-2 mt-2 text-sm bg-gray-900 border border-purple-400 focus:outline-none"
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          
          <label className="block text-sm font-medium text-purple-500 mt-2">Cover Image URL</label>
          <input
            {...register("coverImage", { required: "Cover image URL is required" })}
            type="text"
            placeholder="Enter cover image URL"
            className="w-full px-3 py-2 mt-2 text-sm bg-gray-900 border border-purple-400 focus:outline-none"
          />
          {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}
          
          <DialogFooter className='mt-3'>
            <Button 
              type="button" 
              className="bg-gray-700 text-purple-500 py-2 px-4  hover:bg-gray-600 border-none transition-colors duration-300" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-600 text-white py-2 px-4 border-none hover:bg-purple-700 transition-colors duration-300"
            >
              {updateData ? 'Update Playlist' : 'Add Playlist'}
            </Button>
          </DialogFooter>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
});

export default AddPlaylist;
