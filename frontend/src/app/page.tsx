"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { MoreHorizontal } from "lucide-react";

interface Song {
  id: number;
  title: string;
  author: string;
  fileUrl: string; // URL của file nhạc
  imageUrl?: string; // URL của ảnh đại diện bài hát
  duration?: string; // Thời gian bài hát (mm:ss)
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songTitle, setSongTitle] = useState<string>("");
  const [songAuthor, setSongAuthor] = useState<string>("");
  const [editSongId, setEditSongId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);

  // Hàm định dạng thời gian từ giây sang mm:ss
  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Thêm bài hát mới
  const handleAddSong = () => {
    if (
      fileInputRef.current?.files &&
      fileInputRef.current.files[0] &&
      songTitle &&
      songAuthor
    ) {
      const file = fileInputRef.current.files[0];
      const fileUrl = URL.createObjectURL(file);
      const imageFile = imageInputRef.current?.files?.[0];
      const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;

      // Tạo audio element tạm để lấy metadata
      const audio = new Audio(fileUrl);
      audio.addEventListener("loadedmetadata", () => {
        const duration = formatDuration(audio.duration);
        const newSong: Song = {
          id: songs.length + 1,
          title: songTitle,
          author: songAuthor,
          fileUrl,
          imageUrl,
          duration,
        };
        setSongs([...songs, newSong]);
        // Reset input và đóng dialog
        setSongTitle("");
        setSongAuthor("");
        fileInputRef.current!.value = "";
        if (imageInputRef.current) imageInputRef.current.value = "";
        setIsAddDialogOpen(false);
      });

      audio.addEventListener("error", () => {
        alert("File nhạc không hợp lệ hoặc không được hỗ trợ!");
      });
    } else {
      alert("Vui lòng nhập đầy đủ thông tin và chọn file nhạc!");
    }
  };

  // Xóa bài hát
  const handleDeleteSong = (id: number) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  // Sửa bài hát
  const handleEditSong = (song: Song) => {
    setEditSongId(song.id);
    setSongTitle(song.title);
    setSongAuthor(song.author);
    setIsEditDialogOpen(true);
  };

  // Cập nhật bài hát sau khi sửa
  const handleUpdateSong = () => {
    if (editSongId !== null && songTitle && songAuthor) {
      let newFileUrl = songs.find((song) => song.id === editSongId)!.fileUrl;
      let newImageUrl = songs.find((song) => song.id === editSongId)!.imageUrl;
      let newDuration = songs.find((song) => song.id === editSongId)!.duration;

      // Kiểm tra nếu có file nhạc mới
      if (
        editFileInputRef.current?.files &&
        editFileInputRef.current.files[0]
      ) {
        const file = editFileInputRef.current.files[0];
        newFileUrl = URL.createObjectURL(file);

        // Lấy metadata của file mới
        const audio = new Audio(newFileUrl);
        audio.addEventListener("loadedmetadata", () => {
          newDuration = formatDuration(audio.duration);
          updateSong(newFileUrl, newImageUrl, newDuration);
        });

        audio.addEventListener("error", () => {
          alert("File nhạc không hợp lệ hoặc không được hỗ trợ!");
        });
      } else {
        // Kiểm tra nếu có ảnh mới
        if (
          editImageInputRef.current?.files &&
          editImageInputRef.current.files[0]
        ) {
          newImageUrl = URL.createObjectURL(editImageInputRef.current.files[0]);
        }
        updateSong(newFileUrl, newImageUrl, newDuration);
      }
    } else {
      alert("Vui lòng nhập đầy đủ thông tin!");
    }
  };

  const updateSong = (
    fileUrl: string,
    imageUrl: string | undefined,
    duration: string | undefined
  ) => {
    setSongs(
      songs.map((song) =>
        song.id === editSongId
          ? {
              ...song,
              title: songTitle,
              author: songAuthor,
              fileUrl,
              imageUrl,
              duration,
            }
          : song
      )
    );
    setEditSongId(null);
    setSongTitle("");
    setSongAuthor("");
    if (editFileInputRef.current) editFileInputRef.current.value = "";
    if (editImageInputRef.current) editImageInputRef.current.value = "";
    setIsEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-blue-100 p-4 flex items-center justify-between border-b border-blue-200">
        <div className="flex justify-center items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-blue-800">
            QUẢN LÝ NHẠC CỦA TÔI
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Tìm kiếm"
            className="w-64 border-blue-300 rounded-full focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                Thêm bài hát
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm bài hát mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên bài hát
                  </label>
                  <Input
                    type="text"
                    placeholder="Nhập tên bài hát"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên tác giả
                  </label>
                  <Input
                    type="text"
                    placeholder="Nhập tên tác giả"
                    value={songAuthor}
                    onChange={(e) => setSongAuthor(e.target.value)}
                    className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    File bài hát
                  </label>
                  <Input
                    type="file"
                    accept="audio/*"
                    ref={fileInputRef}
                    className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ảnh bài hát
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
                  />
                  <p className="text-xs text-gray-500">(Tùy chọn)</p>
                </div>

                <Button
                  onClick={handleAddSong}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 w-full"
                >
                  Thêm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">
          Tất cả bài hát
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-between hover:shadow-xl transition duration-300 border border-blue-100"
            >
              <div className="flex items-center">
                {song.imageUrl ? (
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded-md mr-4 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-200 rounded-md mr-4"></div>
                )}
                <div>
                  <p className="font-medium text-blue-900">{song.title}</p>
                  <p className="text-sm text-blue-500">{song.author}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <audio
                      controls
                      src={song.fileUrl}
                      preload="metadata"
                      className="w-full"
                    ></audio>
                    {song.duration && (
                      <span className="text-sm text-gray-500">
                        {song.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEditSong(song)}>
                      Sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteSong(song.id)}>
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog sửa bài hát */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa bài hát</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên bài hát
              </label>
              <Input
                type="text"
                placeholder="Nhập tên bài hát"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên tác giả
              </label>
              <Input
                type="text"
                placeholder="Nhập tên tác giả"
                value={songAuthor}
                onChange={(e) => setSongAuthor(e.target.value)}
                className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                File bài hát mới
              </label>
              <Input
                type="file"
                accept="audio/*"
                ref={editFileInputRef}
                className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
              />
              <p className="text-xs text-gray-500">
                (Để trống nếu giữ nguyên file cũ)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ảnh bài hát mới
              </label>
              <Input
                type="file"
                accept="image/*"
                ref={editImageInputRef}
                className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900"
              />
              <p className="text-xs text-gray-500">
                (Để trống nếu giữ nguyên ảnh cũ)
              </p>
            </div>

            <Button
              onClick={handleUpdateSong}
              className="bg-green-500 text-white hover:bg-green-600 transition duration-300 w-full"
            >
              Cập nhật
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
