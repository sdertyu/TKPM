<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Album
 * 
 * @property int $AlbumID
 * @property string $Title
 * @property int|null $UserID
 * @property Carbon|null $ReleaseDate
 * @property int|null $CategoryID
 * @property Carbon|null $CreatedAt
 * 
 * @property User|null $user
 * @property Category|null $category
 * @property Collection|Song[] $songs
 *
 * @package App\Models
 */
class Album extends Model
{
	protected $table = 'Album';
	protected $primaryKey = 'AlbumID';
	public $timestamps = false;

	protected $casts = [
		'UserID' => 'int',
		'ReleaseDate' => 'datetime',
		'CategoryID' => 'int',
		'CreatedAt' => 'datetime'
	];

	protected $fillable = [
		'Title',
		'UserID',
		'ReleaseDate',
		'CategoryID',
		'CreatedAt'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'UserID');
	}

	public function category()
	{
		return $this->belongsTo(Category::class, 'CategoryID');
	}

	public function songs()
	{
		return $this->hasMany(Song::class, 'AlbumID');
	}
}
