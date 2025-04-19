<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class SongController extends Controller
{

    protected $songService;
    public function __construct()
    {
        $this->songService = new \App\Services\SongService();
    }
    public function index()
    {
        // Fetch songs from the database or any other source
        $songs = [
            ['id' => 1, 'title' => 'Song 1', 'artist' => 'Artist 1'],
            ['id' => 2, 'title' => 'Song 2', 'artist' => 'Artist 2'],
            // Add more songs as needed
        ];

        return response()->json($songs);
    }

    public function create(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'songName' => 'required|string|max:255',
            'idAlbum' => 'required',
            'duration' => 'required|numeric',
            'releaseCategoryId' => 'required|integer',
            'file' => 'required|file',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = [
                'Title' => $request->input('songName'),
                'AlbumID' => $request->input('idAlbum'),
                'Duration' => $request->input('duration'),
                'ReleaseCategoryID' => $request->input('releaseCategoryId'),
                'CreatedAt' => now(),
                'FileID' => $this->songService->uploadFile($request->file('file')),
            ];
            $this->songService->createSong($data);

            return response()->json([
                'message' => 'Song created successfully',
                'song' => [
                    'songName' => $request->input('songName'),
                    'idAlbum' => $request->input('idAlbum'),
                    'duration' => $request->input('duration'),
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating song',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update($id, Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'songName' => 'required|string|max:255',
            'idAlbum' => 'required',
            'duration' => 'required|numeric',
            'releaseCategoryId' => 'required|integer',
            'file' => 'nullable|file',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {

            $data = [
                'Title' => $request->input('songName'),
                'AlbumID' => $request->input('idAlbum'),
                'Duration' => $request->input('duration'),
                'ReleaseCategoryID' => $request->input('releaseCategoryId'),
                'CreatedAt' => now(),
            ];

            if ($request->hasFile('file')) {
                $data['FileID'] = $this->songService->uploadFile($request->file('file'));
            }

            $this->songService->updateSong($id, $data);
            return response()->json([
                'message' => 'Song updated successfully',
                'song' => [
                    'songName' => $request->input('songName'),
                    'idAlbum' => $request->input('idAlbum'),
                    'duration' => $request->input('duration'),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating song',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $this->songService->deleteSong($id);
            return response()->json([
                'message' => 'Song deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting song',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
