<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Comment
 * 
 * @property int $CommentID
 * @property string $Content
 * @property int|null $UserID
 * @property Carbon|null $UpdatedAt
 * 
 * @property User|null $user
 * @property Collection|Song[] $songs
 *
 * @package App\Models
 */
class Comment extends Model
{
	protected $table = 'Comment';
	protected $primaryKey = 'CommentID';
	public $timestamps = false;

	protected $casts = [
		'UserID' => 'int',
		'UpdatedAt' => 'datetime'
	];

	protected $fillable = [
		'Content',
		'UserID',
		'UpdatedAt'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'UserID');
	}

	public function songs()
	{
		return $this->hasMany(Song::class, 'CommentID');
	}
}
