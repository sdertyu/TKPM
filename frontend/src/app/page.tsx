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
import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Song {
  id: string;
  title: string;
  userId: string;
  duration: number;
  albumId?: string;
  releaseCategoryId?: string;
  fileUrl: string;
  imageUrl?: string;
  createdAt: string;
}

export default function Home() {
  // Fix cứng userId
  const userId = "user-123";

  const [songs, setSongs] = useState<Song[]>([]);
  const [songTitle, setSongTitle] = useState<string>("");
  const [songDuration, setSongDuration] = useState<number>(0);
  const [albumId, setAlbumId] = useState<string>("");
  const [releaseCategoryId, setReleaseCategoryId] = useState<string>("");
  const [editSongId, setEditSongId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);

  // Lấy danh sách bài hát khi component mount
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch("/api/songs");
      if (response.ok) {
        const data = await response.json();
        setSongs(data);
      } else {
        throw new Error("Failed to fetch songs");
      }
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Không thể lấy dữ liệu",
        duration: 2000,
      });
    }
  };

  // Hàm định dạng thời gian từ giây sang mm:ss
  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Thêm bài hát mới
  const handleAddSong = async () => {
    if (!songTitle || !songDuration || !fileInputRef.current?.files?.[0]) {
      toast.error("Lỗi", {
        description: "Vui lòng nhập đầy đủ thông tin bắt buộc",
        duration: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("userId", userId);
    formData.append("duration", songDuration.toString());
    if (albumId) formData.append("albumId", albumId);
    if (releaseCategoryId)
      formData.append("releaseCategoryId", releaseCategoryId);
    formData.append("file", fileInputRef.current.files[0]);
    if (imageInputRef.current?.files?.[0])
      formData.append("image", imageInputRef.current.files[0]);

    try {
      const response = await fetch("/api/songs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newSong = await response.json();
        setSongs([...songs, newSong]);
        resetForm();
        setIsAddDialogOpen(false);
        toast.success("Thành công", {
          description: "Bài hát đã được thêm thành công",
          duration: 2000,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add song");
      }
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Có lỗi xảy ra khi thêm bài hát",
        duration: 2000,
      });
    }
  };

  // Sửa bài hát
  const handleEditSong = (song: Song) => {
    setEditSongId(song.id);
    setSongTitle(song.title);
    setSongDuration(song.duration);
    setAlbumId(song.albumId || "");
    setReleaseCategoryId(song.releaseCategoryId || "");
    setIsEditDialogOpen(true);
  };

  // Cập nhật bài hát sau khi sửa
  const handleUpdateSong = async () => {
    if (!editSongId || !songTitle || !songDuration) {
      toast.error("Lỗi", {
        description: "Vui lòng nhập đầy đủ thông tin bắt buộc",
        duration: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("userId", userId);
    formData.append("duration", songDuration.toString());
    if (albumId) formData.append("albumId", albumId);
    if (releaseCategoryId)
      formData.append("releaseCategoryId", releaseCategoryId);
    if (editFileInputRef.current?.files?.[0])
      formData.append("file", editFileInputRef.current.files[0]);
    if (editImageInputRef.current?.files?.[0])
      formData.append("image", editImageInputRef.current.files[0]);

    try {
      const response = await fetch(`/api/songs/${editSongId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const updatedSong = await response.json();
        setSongs(
          songs.map((song) => (song.id === editSongId ? updatedSong : song))
        );
        resetForm();
        setIsEditDialogOpen(false);
        toast.success("Thành công", {
          description: "Bài hát đã được cập nhật thành công",
          duration: 2000,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update song");
      }
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Có lỗi xảy ra khi cập nhật bài hát",
        duration: 2000,
      });
    }
  };

  // Xóa bài hát
  const handleDeleteSong = async () => {
    if (!selectedSongId) return;

    try {
      const response = await fetch(`/api/songs/${selectedSongId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSongs(songs.filter((song) => song.id !== selectedSongId));
        setIsDeleteDialogOpen(false);
        toast.success("Thành công", {
          description: "Bài hát đã được xóa thành công",
          duration: 2000,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete song");
      }
    } catch (error: any) {
      toast.error("Lỗi", {
        description: error.message || "Có lỗi xảy ra khi xóa bài hát",
        duration: 2000,
      });
    }
  };

  const resetForm = () => {
    setSongTitle("");
    setSongDuration(0);
    setAlbumId("");
    setReleaseCategoryId("");
    setEditSongId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (editFileInputRef.current) editFileInputRef.current.value = "";
    if (editImageInputRef.current) editImageInputRef.current.value = "";
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
                Tải nhạc lên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm bài hát mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên bài hát *
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
                    Thời lượng (giây) *
                  </label>
                  <Input
                    type="number"
                    placeholder="Nhập thời lượng"
                    value={songDuration}
                    onChange={(e) => setSongDuration(Number(e.target.value))}
                    className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mã album
                  </label>
                  <Input
                    type="text"
                    placeholder="Nhập mã album"
                    value={albumId}
                    onChange={(e) => setAlbumId(e.target.value)}
                    className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mã danh mục phát hành
                  </label>
                  <Input
                    type="text"
                    placeholder="Nhập mã danh mục"
                    value={releaseCategoryId}
                    onChange={(e) => setReleaseCategoryId(e.target.value)}
                    className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    File bài hát *
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
                  Lưu
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
                  <p className="text-sm text-blue-500">
                    Thời lượng: {formatDuration(song.duration)}
                  </p>
                  {song.albumId && (
                    <p className="text-sm text-gray-500">
                      Album: {song.albumId}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <audio
                      controls
                      src={song.fileUrl}
                      preload="metadata"
                      className="w-full"
                    ></audio>
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
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSongId(song.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-500"
                    >
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
                Tên bài hát *
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
                Thời lượng (giây) *
              </label>
              <Input
                type="number"
                placeholder="Nhập thời lượng"
                value={songDuration}
                onChange={(e) => setSongDuration(Number(e.target.value))}
                className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mã album
              </label>
              <Input
                type="text"
                placeholder="Nhập mã album"
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                className="border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 placeholder-blue-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mã danh mục phát hành
              </label>
              <Input
                type="text"
                placeholder="Nhập mã danh mục"
                value={releaseCategoryId}
                onChange={(e) => setReleaseCategoryId(e.target.value)}
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

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài hát</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Bạn có chắc chắn muốn xóa bài hát này không?</p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteSong}>
                Xóa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
