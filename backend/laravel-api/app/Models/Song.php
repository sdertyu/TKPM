<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Song
 * 
 * @property int $SongID
 * @property string $Title
 * @property int|null $UserID
 * @property int|null $AlbumID
 * @property int|null $Duration
 * @property int|null $FileID
 * @property int|null $CommentID
 * @property int|null $ReleaseCategoryID
 * @property Carbon|null $CreatedAt
 * 
 * @property User|null $user
 * @property Album|null $album
 * @property File|null $file
 * @property Comment|null $comment
 * @property ReleaseCategory|null $release_category
 *
 * @package App\Models
 */
class Song extends Model
{
	protected $table = 'Song';
	protected $primaryKey = 'SongID';
	public $timestamps = false;

	protected $casts = [
		'UserID' => 'int',
		'AlbumID' => 'int',
		'Duration' => 'int',
		'FileID' => 'int',
		'CommentID' => 'int',
		'ReleaseCategoryID' => 'int',
		'CreatedAt' => 'datetime'
	];

	protected $fillable = [
		'Title',
		'UserID',
		'AlbumID',
		'Duration',
		'FileID',
		'CommentID',
		'ReleaseCategoryID',
		'CreatedAt'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'UserID');
	}

	public function album()
	{
		return $this->belongsTo(Album::class, 'AlbumID');
	}

	public function file()
	{
		return $this->belongsTo(File::class, 'FileID');
	}

	public function comment()
	{
		return $this->belongsTo(Comment::class, 'CommentID');
	}

	public function release_category()
	{
		return $this->belongsTo(ReleaseCategory::class, 'ReleaseCategoryID');
	}
}
