<?php

use App\Http\Controllers\SongController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

});


Route::prefix('songs')->group(function () {
    Route::get('/', [SongController::class, 'index']);
    Route::post('/create', [SongController::class, 'create']);
    Route::post( '/update/{id}', [SongController::class, 'update']);
    Route::delete('/delete/{id}', [SongController::class, 'delete']);
});