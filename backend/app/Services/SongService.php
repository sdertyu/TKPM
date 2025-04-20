<?php

namespace App\Services;

use App\Models\Song;
use App\Models\File;
use Illuminate\Support\Facades\Storage;

class SongService {
    public function getAllSongs() {
        return Song::with(['file', 'user'])->get();
    }

    public function createSong($data) {
        return Song::create($data);
    }

    public function uploadFile($file) {
        $path = $file->store('songs', 'public');
        $response = File::create([
            'Path' => $path,
            'Size' => $file->getSize(),
            'CreateAt' => now(),
        ]);
        return $response->FileID;
    }

    public function updateSong($id, $data) {
        $song = Song::findOrFail($id);
        $song->update($data);
        return $song;
    }

    public function deleteSong($id) {
        $song = Song::findOrFail($id);
        $song->delete();
        if($song->FileID) {
            $file = File::findOrFail($song->FileID);
            $file->delete();
            if($file->Path) {
                Storage::disk('public')->delete($file->Path);
            }
        }
        return response()->json(['message' => 'Song deleted successfully']);
    }
}
