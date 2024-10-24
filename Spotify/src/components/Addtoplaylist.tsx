import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useImperativeHandle, forwardRef, useState } from 'react'
import { useAppSelector, AppDispatch } from "@/Store/store"
import { useDispatch } from "react-redux"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

import { useForm, Controller } from 'react-hook-form'
import { addSongToPlaylist, setError } from '@/Store/Reducer/PlaylistReducer'

interface Song {
  id: string;
  name: string;
  artists: [string];
  album: string;
  duration: number;
}

interface AddSongToPlaylistHandle {
  open: (song: Song) => void;
}

interface FormData {
  playlist: string;
}

const AddsongtoPlaylist = forwardRef<AddSongToPlaylistHandle>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const playlists = useAppSelector(state => state.playlist.playlists)
  const error = useAppSelector(state => state.playlist.error)
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

  useImperativeHandle(ref, () => ({
    open: (song: Song) => {
      console.log(song,"song")
      setCurrentSong(song)
      setIsOpen(true)
      dispatch(setError(null))
    }
  }))

  function showToast () {
    toast({
        title: "Added song to playlist",
        description: `${currentSong?.name} by ${currentSong?.artists.join(", ")} is added to your playlist.`,
    })
    setIsOpen(false)
  }

  const onSubmit = (data: FormData) => {
    if (currentSong) {
        dispatch(addSongToPlaylist({ playlistId: data.playlist, songData: {...currentSong, _id : currentSong.id} , showToast  }))
    }
  }

  if (!currentSong) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] font-firacode bg-gray-800 text-white border border-purple-500">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Add to Playlist</DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose a playlist to add "{currentSong.name}" by {currentSong?.artists?.join(", ")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Controller
            name="playlist"
            control={control}
            rules={{ required: 'Please select a playlist' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a playlist" />
                </SelectTrigger>
                <SelectContent>
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist._id} value={playlist._id}>
                      {playlist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.playlist && <span className="text-red-500 fs-2">{errors.playlist.message}</span>}
          <button
            type="submit"
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 text-white"
          >
            Add to Playlist
          </button>
          {error && (
          <div className="text-red-500  text-center  ">
            {error}
          </div>
        )}
        </form>
      </DialogContent>
    </Dialog>
  )
})

export default AddsongtoPlaylist