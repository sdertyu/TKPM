<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class User
 * 
 * @property int $UserID
 * @property string $Username
 * @property string $Password
 * @property string $Email
 * @property string|null $FullName
 * @property string|null $Bio
 * @property int|null $RoleID
 * @property Carbon|null $CreatedAt
 * 
 * @property Role|null $role
 * @property Collection|ReleaseCategory[] $release_categories
 * @property Collection|Album[] $albums
 * @property Collection|Comment[] $comments
 * @property Collection|Song[] $songs
 *
 * @package App\Models
 */
class User extends Model
{
	protected $table = 'User';
	protected $primaryKey = 'UserID';
	public $timestamps = false;

	protected $casts = [
		'RoleID' => 'int',
		'CreatedAt' => 'datetime'
	];

	protected $fillable = [
		'Username',
		'Password',
		'Email',
		'FullName',
		'Bio',
		'RoleID',
		'CreatedAt'
	];

	public function role()
	{
		return $this->belongsTo(Role::class, 'RoleID');
	}

	public function release_categories()
	{
		return $this->hasMany(ReleaseCategory::class, 'UserID');
	}

	public function albums()
	{
		return $this->hasMany(Album::class, 'UserID');
	}

	public function comments()
	{
		return $this->hasMany(Comment::class, 'UserID');
	}

	public function songs()
	{
		return $this->hasMany(Song::class, 'UserID');
	}
}
